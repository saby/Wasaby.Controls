define('js!SBIS3.CONTROLS.TextBoxBase', ['js!SBIS3.CORE.Control', 'js!SBIS3.CONTROLS.FormWidgetMixin','js!SBIS3.CONTROLS.DataBindMixin'], function(Control, FormWidgetMixin, DataBindMixin) {

   'use strict';

   /**
    * Базовый класс для текстового поля
    * @class SBIS3.CONTROLS.TextBoxBase
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    */

   var TextBoxBase = Control.Control.extend([FormWidgetMixin, DataBindMixin], /** @lends SBIS3.CONTROLS.TextBoxBase.prototype*/ {
      $protected: {
         _options: {
            /**
             * @cfg {String} Текст в поле ввода
             * @see setText
             * @see getText
             * @see setValue
             * @see getValue
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
            placeholder: ''
         }
      },

      $constructor: function() {
         this._publish('onTextChange');
      },

      /**
       * Установить текст внутри поля.
       * @param {String} text Текст для установки в поле ввода.
       * @see text
       * @see getText
       * @see setValue
       * @see getValue
       */
      setText:function(text){
         var oldText = this._options.text;
         this._options.text = text || '';
         if (oldText !== this._options.text) {
            this.saveToContext('Text', text);
            this._notify('onTextChange', this._options.text);
         }
      },

      /**
       * Получить текст внутри поля.
       * @returns {String} Текст - значение поля ввода.
       * @see text
       * @see setText
       * @see setValue
       * @see getValue
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
       * Метод установки или замены текста подсказки, заданного опцией {@link placeholder}.
       * @param {String} text Текст подсказки.
       * @see placeholder
       */
      setPlaceholder: function(text) {
         this._options.placeholder = text || '';
      },
      /**
       * Изменяет текст в поле ввода.
       * @param value Текст для установки в поле ввода.
       * @see setText
       * @see getText
       * @see getValue
       * @see text
       */
      setValue: function(value){
         this.setText(value);
      },
      /**
       * Возвращает текущий текст поля ввода.
       * @returns {String} Текст - значение поля ввода.
       * @see getText
       * @see setText
       * @see setValue
       * @see text
       */
      getValue: function(){
         return this.getText();
      }
   });

   return TextBoxBase;

});