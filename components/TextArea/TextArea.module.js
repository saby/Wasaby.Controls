define('js!SBIS3.CONTROLS.TextArea', [
   "Core/constants",
   "js!SBIS3.CONTROLS.TextBoxBase",
   "tmpl!SBIS3.CONTROLS.TextArea",
   "Core/helpers/string-helpers",
   "Core/helpers/dom&controls-helpers",
   "browser!js!SBIS3.CORE.FieldText/resources/Autosize-plugin"
], function( constants,TextBoxBase, dotTplFn, strHelpers, dcHelpers) {

   'use strict';

   function generateClassesName(min, max) {
      if (!max || max < min) {
         max = min;
      }
      return 'controls-TextArea__inputField__minheight-' + min + ' controls-TextArea__inputField__maxheight-' + max;
   }

   function prepareTextForDisplay(text, needToWrap) {
      var dispText = strHelpers.escapeHtml(text);
      if (needToWrap) {
         dispText = strHelpers.wrapURLs(dispText);
      }
      dispText = dispText.replace(/\n/g, '<br/>');
      return dispText;
   }
   /**
    * Многострочное поле ввода - это текстовое поле с автовысотой.
    * Данное поле может автоматически менять высоту в зависимости от количества введённой информации.
    * Для контрола настраиваются:
    * <ul>
    *    <li>{@link SBIS3.CONTROLS.TextArea#minLinesCount минимальное}</li>
    *    <li>и {@link SBIS3.CONTROLS.TextArea#autoResize.minLinesCount максимальное} количества отображаемых строк,</li>
    *    <li>{@link SBIS3.CONTROLS.TextArea#autoResize.state автоматическое ли изменение количества строк}.</li>
    * </ul>
    * @class SBIS3.CONTROLS.TextArea
    * @extends SBIS3.CONTROLS.TextBoxBase
    * @author Крайнов Дмитрий Олегович
    * @css controls-TextArea Класс для изменения отображения текста в многострочном поле ввода.
    *
    * @ignoreOptions independentContext contextRestriction className
    *
    * @ignoreMethods applyEmptyState applyState findParent getAlignment getEventHandlers getEvents getExtendedTooltip
    * @ignoreMethods getId getLinkedContext getMinHeight getMinSize getMinWidth getOwner getOwnerId getParentByClass
    * @ignoreMethods getParentByName getParentByWindow getStateKey getTopParent getUserData hasEvent hasEventHandlers
    * @ignoreMethods isDestroyed isSubControl makeOwnerName once sendCommand setOwner setStateKey setUserData setValue
    * @ignoreMethods subscribe unbind unsubscribe getClassName setClassName
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onStateChanged onTooltipContentRequest onChange
    * @ignoreEvents onReady
    *
    * @demo SBIS3.CONTROLS.Demo.MyTextArea
    *
    * @control
    * @public
    * @category Inputs
    */

   var TextArea = TextBoxBase.extend( /** @lends SBIS3.CONTROLS.TextArea.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _inputField: null,
         _cachedW: null,
         _cachedH: null,
         _compatPlaceholder: null,
         _options: {
             /**
              * @cfg {String} Текст подсказки внутри поля ввода
              * @remark
              * Заданный в этой опции текст отображается внутри многострочного поля ввода до начала ввода.
              * @example
              * <pre>
              *     <option name="placeholder">Введите ФИО полностью</option>
              * </pre>
              * @see setPlaceholder
              * @translatable
              */
             placeholder: '',
            /**
             * @cfg {Number} Минимальное количество строк
             * @example
             * <pre>
             *     <option name="minLinesCount">2</option>
             * </pre>
             * @remark
             * Многострочное поле ввода построится с указанным в данной опции количеством строк.
             * @see autoResize
             */
            minLinesCount: 0,
            /**
             * @typedef {Object} AutoResize
             * @property {Boolean} [state=false] Включёно/выключено автоматическое подстраивание по высоте.
             * @property {Number} maxLinesCount Максимальное количество строк.
             */
            /**
             * @cfg {AutoResize} Автоматическое подстраивание по высоте, если текст не помещается
             * @example
             * <pre>
             *    <options name="autoResize">
             *        <option name="state">true</option>
             *        <option name="maxLinesCount">10</option>
             *    </options>
             * </pre>
             * @remark
             * В данной опции можно:
             * <ul>
             *    <li>включить автоматическое изменение высоты многострочного поля ввода, например, при нехватке строк;</li>
             *    <li>задать максимальное количество строк.</li>
             * </ul>
             * По достижению максимального количества строк поле ввода больше не будет увеличиваться по высоте, и
             * появится вертикальная полоса прокрутки.
             * @see minLinesCount
             */
            autoResize: {},
            /**
             * @cfg {String} Режим перехода на новую строку
             * @variant enter По нажатию клавиши <enter>
             * @variant shiftEnter По сочетанию клавиш <shift> + <enter>
             * <pre>
             *     <opt name="newLineMode">enter</opt>
             * </pre>
             */
            newLineMode: 'enter'
         }
      },

      _modifyOptions: function(cfg) {
         var newCfg = TextArea.superclass._modifyOptions.apply(this, arguments);
         newCfg.heightclassName = generateClassesName(cfg.minLinesCount, cfg.autoResize.maxLinesCount);
         newCfg.displayedText = prepareTextForDisplay(cfg.text, !cfg.enabled);
         return newCfg;
      },

      $constructor: function() {
         var self = this;
         this._inputField = $('.controls-TextArea__inputField', this._container);
         this._disabledWrapper = $('.controls-TextArea__disabled-wrapper', this._container);
         // При потере фокуса делаем trim, если нужно
         // TODO Переделать на платформенное событие потери фокуса
         this._inputField.bind('focusout', function () {
            var text = self._inputField.get(0).innerText;
            if (self._options.trim) {
               text = String.trim(text);
            }
            //Установим текст только если значения различны и оба не пустые
            if (text !== self._options.text && !(self._isEmptyValue(self._options.text) && !text.length)){
               self.setText(text);
            }
         });

         this._container.bind('keyup',function(e){
            self._keyUpBind(e);
         });

         this._inputField.bind('keydown', function(event){
            // Если тебя посетило желание добавить ниже в исключения кнопку "shift" - то напиши зачем тебе это и будь готов к тому, что
            // благодаря keyboardHover-у где то перестанут нажиматься клавиши!
            if (!self._processNewLine(event) && !event.altKey && !event.ctrlKey && event.which !== constants.key.esc && event.which !== constants.key.tab) {
               event.stopPropagation();
            }
            self._keyDownBind(event)
         });

         this._inputField.bind('paste', function(){
            self._pasteProcessing++;
            window.setTimeout(function(){
               self._pasteProcessing--;
               if (!self._pasteProcessing) {
                  self.setText.call(self, self._formatText(self._inputField.get(0).innerText));
                  self._inputField.get(0).innerText = self._options.text;
               }
            }, 100)
         });
      },

      init :function(){
         TextArea.superclass.init.call(this);
         var self = this;
         if (this._options.placeholder) {
            this._createCompatPlaceholder();
         }
      },

      _getElementToFocus: function() {
         return this._inputField;
      },

      _setEnabled: function(state){
         TextArea.superclass._setEnabled.call(this, state);
         this._inputField.attr('contenteditable', !!state);
         this._insertTextToMarkup(this._options.text);
      },

      _drawText: function(text) {
         this._updateCompatPlaceholderVisibility();
         if (this._inputField.get(0).innerText != text) {
            this._insertTextToMarkup(text);
         }
      },

      _insertTextToMarkup: function(text) {
         var dispText = prepareTextForDisplay(text, !this._options.enabled);
         this._inputField.get(0).innerHTML = dispText || '';
      },

      _processNewLine: function(event) {
         if (this._options.newLineMode === 'shiftEnter' && event.which === constants.key.enter) {
            if (event.shiftKey) {
               event.stopPropagation();
            } else {
               event.preventDefault();
            }
            return true;
         }
      },

      _keyDownBind: function(event) {
         var text = this._inputField.get(0).innerText;
         //TODO опасная проверка, но я пока не нашел случаев чтоб она не сработала
         if (text && this._options.maxLength && text.length >= this._options.maxLength && event.key && event.key.length == 1) {
            event.preventDefault();
         }
      },

      _keyUpBind: function(event) {
         var
            newText = this._inputField.get(0).innerText,
            key = event.which || event.keyCode,
            textsEmpty = this._isEmptyValue(this._options.text) && this._isEmptyValue(newText);
         if (!textsEmpty) {
            this.setText.call(this, newText);
         }
         if (!this._processNewLine(event) && ((key === constants.key.enter && !event.ctrlKey) ||
             Array.indexOf([constants.key.up, constants.key.down], key) >= 0)) {
            event.stopPropagation();
         }
      },
       /**
        * Установить подсказку, отображаемую внутри многострочного поля ввода.
        * Метод установки или замены текста подсказки, заданного опцией {@link placeholder}.
        * @param {String} text Текст подсказки.
        * @example
        * <pre>
        *     if (control.getText() == "") {
        *        control.setPlaceholder("Введите ФИО полностью");
        *     }
        * </pre>
        * @see placeholder
        */
      setPlaceholder: function(text){
          if (!this._compatPlaceholder) {
             this._createCompatPlaceholder();
          }
          this._compatPlaceholder.text(text || '');
      },
      _createCompatPlaceholder : function() {
         var self = this;
         this._compatPlaceholder = $('<div class="controls-TextArea__placeholder">' + this._options.placeholder + '</div>');
         this._updateCompatPlaceholderVisibility();
         this._inputField.after(this._compatPlaceholder);
         this._compatPlaceholder.css({
            'left': this._inputField.position().left || parseInt(this._inputField.parent().css('padding-left'), 10),
            'right': this._inputField.position().right || parseInt(this._inputField.parent().css('padding-right'), 10)
         });
         this._compatPlaceholder.click(function(){
            if (self.isEnabled()) {
               self._inputField.get(0).focus();
            }
         });
      },
      _updateCompatPlaceholderVisibility: function() {
         if (this._compatPlaceholder) {
            this._compatPlaceholder.toggle(!this._options.text);
         }
      },
       /**
        * Метод установки минимального количества строк.
        * @param count Количество строк, меньше которого высота не уменьшается.
        * @example
        * <pre>
        *     if (textArea.getText().length > 300) {
        *        textArea.setMinLinesCount(7);
        *     }
        * </pre>
        * @see minLinesCount
        */
       setMinLinesCount: function (count) {
          this._options.minLinesCount = parseInt(count, 10);
          var hClasses = generateClassesName(this._options.minLinesCount, this._options.autoResize.maxLinesCount);
          this._inputField.get(0).className = 'controls-TextArea__inputField ' + hClasses;
       }
   });

   return TextArea;

});