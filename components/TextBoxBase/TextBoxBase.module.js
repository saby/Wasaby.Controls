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
             * @see setText
             */
            text: '',
            /**
             * @cfg {Boolean} Обрезать ли пробелы при вставке
             * При включённой опции обрезаются пробелы в начале и конце текста.
             * Возможные значения:
             * <ul>
             *    <li>true - обрезать пробелы;</li>
             *    <li>false - не обрезать.</li>
             * </ul>
             */
            trim: false,
            /**
             * @cfg {Number} Максимальное количество символов, которое возможно ввести
             * @see setMaxLength
             */
            maxLength: null,
            /**
             * @cfg {String} Текст подсказки внутри поля ввода
             * Данный текст отображается внутри поля до момента получения фокуса.
             * @see setPlaceholder
             */
            placeholder: '',
            /**
             * @cfg {Boolean} Выделять или нет текст в поле при получении фокуса
             * Возможные значения при получении полем фокуса:
             * <ul>
             *    <li>true - выделять текст;</li>
             *    <li>false - не выделять.</li>
             * </ul>
             */
            selectOnClick: false
         }
      },

      $constructor: function() {

      },

      /**
       * Установить текст внутри поля.
       * @param {String} text текст
       * @see text
       * @see getText
       */
      setText:function(text){
         this._options.text = text || '';
         this._notify('onChangeText', this._options.text);
      },

      /**
       * Получить текст внутри поля.
       * @see text
       * @see setText
       */
      getText:function(){
         return this._options.text;
      },

      /**
       * Установить максимальное количество символов, которое можно ввести.
       * @param {Number} num Количество символов.
       * @see maxLength
       */
      setMaxLength: function(num) {
         this._options.maxLength = num;
      },

      /**
       * Установить подсказку, отображаемую внутри поля.
       * @param {String} text Текст подсказки.
       * @see placeholder
       */
      setPlaceholder: function(text) {
         this._options.placeholder = text || '';
      },
      /**
       * Изменяет текст в поле ввода.
       * @param value
       * @see setText
       */
      setValue: function(value){
         this.setText(value);
      },
      /**
       * Возвращает текущий текст поля ввода.
       * @returns {*}
       * @see getText
       */
      getValue: function(){
         return this.getText();
      }

   });

   return TextBoxBase;

});