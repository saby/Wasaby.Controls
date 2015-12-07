define('js!SBIS3.CONTROLS.TextArea', ['js!SBIS3.CONTROLS.TextBoxBase', 'html!SBIS3.CONTROLS.TextArea', 'is!browser?js!SBIS3.CORE.FieldText/resources/Autosize-plugin'], function(TextBoxBase, dotTplFn) {

   'use strict';

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
    * @control
    * @public
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
    */

   var TextArea = TextBoxBase.extend( /** @lends SBIS3.CONTROLS.TextArea.prototype */ {
      $protected: {
         _dotTplFn: dotTplFn,
         _inputField: null,
         _cachedW: null,
         _cachedH: null,
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
            autoResize: {}
         }
      },

      $constructor: function() {
         var self = this;
         this._inputField = $('.controls-TextArea__inputField', this._container);
         // При потере фокуса делаем trim, если нужно
         // TODO Переделать на платформенное событие потери фокуса
         this._inputField.bind('focusout', function () {
            if (self._options.trim) {
               self.setText(String.trim(self.getText()));
            }
         });

         this._container.bind('keyup',function(e){
            self._keyUpBind(e);
         });

         this._inputField.bind('keydown', function(event){
            if ((event.ctrlKey || event.shiftKey) && (event.which == $ws._const.key.left || event.which == $ws._const.key.right)) {
               event.stopPropagation();
               return true;
            }
            if(event.shiftKey || event.altKey || event.ctrlKey || event.which == $ws._const.key.esc || event.which == $ws._const.key.tab)
               return true;
            event.stopPropagation();
            return true;
         });

         this._inputField.bind('paste', function(){
            self._pasteProcessing++;
            window.setTimeout(function(){
               self._pasteProcessing--;
               if (!self._pasteProcessing) {
                  TextArea.superclass.setText.call(self, self._formatText(self._inputField.val()));
                  self._inputField.val(self._options.text);
               }
            }, 100)
         });
      },

      init :function(){
         TextArea.superclass.init.call(this);
         var self = this;
         if (this._options.autoResize.state) {
            this._options.minLinesCount = parseInt(this._options.minLinesCount, 10);
            if (!this._options.autoResize.maxLinesCount) {
               this._options.autoResize.maxLinesCount = 100500;
            }
            this._options.autoResize.maxLinesCount = parseInt(this._options.autoResize.maxLinesCount, 10);
            if (this._options.minLinesCount > this._options.autoResize.maxLinesCount) {
               this._options.autoResize.maxLinesCount = this._options.minLinesCount;
            }
            this._inputField.data('minLinesCount', this._options.minLinesCount);
            this._inputField.data('maxLinesCount', this._options.autoResize.maxLinesCount);

            this._cachedW = this._inputField.width();
            this._cachedH = this._inputField.height();

            var trg = $ws.helpers.trackElement(this._container, true);

            this._inputField.autosize({
               callback: self._textAreaResize.bind(self)
            });
            trg.subscribe('onVisible', function (event, visible) {
               if (visible) {
                  var w = self._inputField.width();
                  var h = self._inputField.height();
                  if (w != self._cachedW || h != self._cachedH) {
                     self._cachedW = w;
                     self._cachedH = h;
                     self._inputField.autosize({
                        callback: self._textAreaResize.bind(self)
                     });
                  }
               }
            });

         } else {
            if (this._options.minLinesCount){
               this._inputField.attr('rows',parseInt(this._options.minLinesCount, 10));
            }
         }
      },


      _getElementToFocus: function() {
         return this._inputField;
      },

      _setEnabled: function(state){
         TextArea.superclass._setEnabled.call(this, state);
         if (!state){
            this._inputField.attr('readonly', 'readonly')
         } else {
            this._inputField.removeAttr('readonly');
         }
      },

      _keyUpBind: function() {
         var newText = this._inputField.val();
         if (newText != this._options.text) {
            TextArea.superclass.setText.call(this, newText);
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
         TextArea.superclass.setPlaceholder.call(this, text);
         this._inputField.attr('placeholder', text);
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
      setMinLinesCount: function(count) {
         var cnt = parseInt(count, 10);
         this._options.minLinesCount = cnt;
         this._inputField.attr('rows', cnt);
      },

      _drawText: function(text) {
         if (this._inputField.val() != text) {
            this._inputField.val(text || '');
         }
         if (this._options.autoResize.state) {
            this._inputField.trigger('autosize.resize');
         }
      },

      _textAreaResize : function() {
         this._notifyOnSizeChanged(this, this);
      },

      destroy: function() {
         if (this._options.autoResize.state) {
            this._inputField instanceof $ && this._inputField.trigger('autosize.destroy');
         }
         TextArea.superclass.destroy.apply(this, arguments);
      }
   });

   return TextArea;

});