define('js!SBIS3.CONTROLS.TextArea', [
   "Core/constants",
   "js!SBIS3.CONTROLS.TextBoxBase",
   "tmpl!SBIS3.CONTROLS.TextArea",
   "Core/helpers/string-helpers",
   "Core/IoC",
   "Core/constants",
   'css!SBIS3.CONTROLS.TextArea'
], function( constants,TextBoxBase, dotTplFn, strHelpers, IoC, cConst) {

   'use strict';

   function generateClassesName(min, max) {
      if (!max || max < min) {
         max = min;
      }
      return 'controls-TextArea__inputField__minheight-' + min + ' controls-TextArea__inputField__maxheight-' + max;
   }

   function prepareTextForDisplay(text, needToWrap) {
      var dispText = strHelpers.escapeHtml(text || '') + '';
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
             * @cfg {Number} Максимальное количество строк
             * @example
             * <pre>
             *     <option name="maxLinesCount">4</option>
             * </pre>
             * @remark
             * При несовпадении максимального и минимального количества строк у поля ввода включится автовысота
             * @see minLinesCount
             */
            maxLinesCount: 0,
            /**
             * @deprecated
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
         if (cfg.autoResize && cfg.autoResize.maxLinesCount) {
            cfg.maxLinesCount = cfg.autoResize.maxLinesCount;
            IoC.resolve('ILogger').log('TextArea', 'Опция cfg.autoResize устарела - используйте maxLinesCount');
         }
         newCfg.heightclassName = generateClassesName(cfg.minLinesCount, cfg.maxLinesCount);
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
            var text = self._getTextFromMarkup();
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
                  self.setText.call(self, self._formatText(self._getTextFromMarkup()));
                  self._inputField.get(0).innerText = self._options.text;
               }
            }, 100)
         });
      },

      init :function(){
         TextArea.superclass.init.call(this);
         this._initPlaceholder();
      },

      _getElementToFocus: function() {
         return this._inputField;
      },

      _setEnabled: function(state){
         TextArea.superclass._setEnabled.call(this, state);
         this._inputField.attr('contenteditable', !!state);
         this._compatPlaceholder.toggleClass('ws-hidden', !!this._options.text || !state);
         this._insertTextToMarkup(this._options.text);
      },

      _prepareTextBecauseFFBug: function(text) {
         //в файрфоксе есть баг с 2011 года при котором во время ввода и последующей очистки contenteditable там оказывается пустой фантомный br
         if (cConst.browser.firefox && text.length == 1 && text == '\n') {
            return '';
         }
         else {
            return text;
         }
      },

      _drawText: function(text) {
         this._updateCompatPlaceholderVisibility();
         if (this._getTextFromMarkup() != text) {
            this._insertTextToMarkup(text);
         }
      },

      _insertTextToMarkup: function(text) {
         var dispText = prepareTextForDisplay(text, !this._options.enabled);
         this._inputField.get(0).innerHTML = dispText || '';
      },

      _getTextFromMarkup: function() {
         var text = this._inputField.get(0).innerText;
         text = this._prepareTextBecauseFFBug(text);
         return text;
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
         var text = this._getTextFromMarkup();
         //TODO опасная проверка, но я пока не нашел случаев чтоб она не сработала
         if (this._options.enabled && event.key && event.key.length == 1) {
            //отключаем плейсхолдер на ввод первого символа
            this._compatPlaceholder.addClass('ws-hidden');
            //не даем вводить больше maxLength
            if (text && this._options.maxLength && text.length >= this._options.maxLength) {
               event.preventDefault();
            }
         }
      },

      _keyUpBind: function(event) {
         var
            newText = this._getTextFromMarkup(),
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
          this._compatPlaceholder.text(text || '');
      },
      _initPlaceholder : function() {
         var self = this;
         this._compatPlaceholder = $('.controls-TextArea__placeholder', this._container.get(0));
      },
      _updateCompatPlaceholderVisibility: function() {
         this._compatPlaceholder.toggleClass('ws-hidden', !!this._options.text || !this._options.enabled);
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
          var hClasses = generateClassesName(this._options.minLinesCount, this._options.maxLinesCount);
          this._inputField.get(0).className = 'controls-TextArea__inputField ' + hClasses;
       }
   });

   return TextArea;

});