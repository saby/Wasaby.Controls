define('js!SBIS3.CONTROLS.TextBoxBase', ['js!SBIS3.CORE.Control', 'js!SBIS3.CONTROLS._FormWidgetMixin'], function(Control, FormWidgetMixin) {

   'use strict';

   /**
    * Базовый класс для текстового поля
    * @class SBIS3.CONTROLS.TextBoxBase
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS._FormWidgetMixin
    */

   var TextBoxBase = Control.Control.extend([FormWidgetMixin], /** @lends SBIS3.CONTROLS.TextBoxBase.prototype*/ {
      $protected: {
         _options: {
            /**
             * @cfg {String} Текст в поле
             */
            text: '',
            /**
             * @cfg {Boolean} Обрезать пробелы при вставке или нет
             */
            trim: false,
            /**
             * @cfg {Number} Максимальное количество символов, которое возможно ввести
             */
            maxLength: null,
            /**
             * @cfg {String} Текст отображаемый внутри поля, который исчезает при получении фокуса
             */
            placeholder: '',
            /**
             * @cfg {Boolean} Выделять или нет текст в поле при получении фокуса
             */
            selectOnClick: false
         }
      },

      $constructor: function() {

      },

      /**
       * Установить текст внутри поля
       * @param {String} text текст
       */
      setText:function(text){
         this._options.text = text || '';
         this._notify('onChangeText', this._options.text);
      },

      /**
       * Получить текст внутри поля
       */
      getText:function(){
         return this._options.text;
      },

      /**
       * Установить максимальное количество символов, которое можно ввести
       * @param {Number} num количество символов
       */
      setMaxLength: function(num) {
         this._options.maxLength = num;
      },

      /**
       * Установить подсказку, отображаемую внутри поля
       * @param {String} text текст подсказки
       */
      setPlaceholder: function(text) {
         this._options.placeholder = text || '';
      },

      setValue: function(value){
         this.setText(value);
      },

      getValue: function(){
         return this.getText();
      }

   });

   return TextBoxBase;

});