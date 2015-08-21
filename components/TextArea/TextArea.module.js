define('js!SBIS3.CONTROLS.TextArea', ['js!SBIS3.CONTROLS.TextBoxBase', 'html!SBIS3.CONTROLS.TextArea', 'is!browser?js!SBIS3.CORE.FieldText/resources/Autosize-plugin'], function(TextBoxBase, dotTplFn) {

   'use strict';

   /**
    * Класс, определяющий многострочное поле ввода с возможностью задать количество строк, столбцов, включить авторесайз
    * @class SBIS3.CONTROLS.TextArea
    * @extends SBIS3.CONTROLS.TextBoxBase
    * @control
    * @public
    */

   var TextArea = TextBoxBase.extend( /** @lends SBIS3.CONTROLS.TextArea.prototype */ {
      $protected: {
         _dotTplFn: dotTplFn,
         _inputField: null,
         _cachedW: null,
         _cachedH: null,
         _options: {
            /**
             * @cfg {Number} Количество строк
             */
            minLinesCount: 0,
            /**
             * @typedef {Object} autoResize
             * @property {Boolean} state включен/выключен
             * @property {Number} maxLinesCount максимальное количество строк
             */
            /**
             * @cfg {autoResize} авторесайз по высоте, если текст не помещается
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
            if(event.shiftKey || event.altKey || event.ctrlKey || event.which == $ws._const.key.esc)
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

      setPlaceholder: function(text){
         TextArea.superclass.setPlaceholder.call(this, text);
         this._inputField.attr('placeholder', text);
      },

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