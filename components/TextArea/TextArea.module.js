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

         this._inputField.bind('keydown', function(event){
            if(event.shiftKey || event.altKey || event.ctrlKey || event.which == $ws._const.key.esc)
               return true;
            event.stopPropagation();
            return true;
         });

         this._container.bind('keyup',function(e){
            self._keyUpBind(e);
         });
      },

      init :function(){
         TextArea.superclass.init.call(this);
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
            this._inputField.autosize();
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

      setText: function(text){
         if (this._options.trim) {
            text = String.trim(text);
         }
         TextArea.superclass.setText.call(this, text);
         this._inputField.val(text || '');
         if (this._options.autoResize.state) {
            this._inputField.trigger('autosize.resize');
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
      }
   });

   return TextArea;

});