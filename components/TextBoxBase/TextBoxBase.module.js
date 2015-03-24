define('js!SBIS3.CONTROLS.TextBoxBase', ['js!SBIS3.CORE.Control', 'js!SBIS3.CONTROLS.FormWidgetMixin','js!SBIS3.CONTROLS.DataBindMixin'], function(Control, FormWidgetMixin, DataBindMixin) {

   'use strict';

   /**
    * Базовый класс для текстового поля
    * @class SBIS3.CONTROLS.TextBoxBase
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth extendedTooltip horizontalAlignment
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol validators verticalAlignment
    */

   var TextBoxBase = Control.Control.extend([FormWidgetMixin, DataBindMixin], /** @lends SBIS3.CONTROLS.TextBoxBase.prototype*/ {

       /**
        * @event onTextChange Срабатывает при изменении текста в поле ввода.
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {String} text Текст в поле ввода.
        * @example
        * <pre>
        *     textBox.subscribe('onTextChange', function(event, text){
        *        if (text == 'Воскресение') {
        *           alert('Такого не может быть')
        *        }
        *     };
        * </pre>
        * @see setText
        * @see setValue
        */

      $protected: {
         _options: {
            /**
             * @cfg {String} Текст в поле ввода
             * @example
             * <pre>
             *     <option name="text">Какой-то текст, с которым построится поле ввода</option>
             * </pre>
             * @see trim
             * @see maxLength
             * @see setText
             * @see getText
             * @see setValue
             * @see getValue
             */
            text: '',
            /**
             * @cfg {Boolean} Обрезать ли пробелы при вставке
             * При включённой опции обрезаются пробелы в начале и в конце текста.
             * Возможные значения:
             * <ul>
             *    <li>true - обрезать пробелы;</li>
             *    <li>false - не обрезать.</li>
             * </ul>
             * @example
             * <pre>
             *     <option name="trim">true</option>
             * </pre>
             * @see text
             * @see maxLength
             */
            trim: false,
            /**
             * @cfg {Number} Максимальное количество символов, которое возможно ввести
             * @example
             * <pre>
             *     <option name="maxLength">40</option>
             * </pre>
             * @see setMaxLength
             * @see trim
             * @see text
             */
            maxLength: null

         }
      },

      $constructor: function() {
         this._publish('onTextChange');
      },

      /**
       * Установить текст внутри поля.
       * @param {String} text Текст для установки в поле ввода.
       * @example
       * <pre>
       *     if (control.getText() == "Введите ФИО") {
       *        control.setText("");
       *     }
       * </pre>
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
       * @example
       * <pre>
       *     if (control.getText() == "Введите ФИО") {
       *        control.setText("");
       *     }
       * </pre>
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
       * @example
       * <pre>
       *    if (control.getName() == "Заголовок") {
       *       control.setMaxLength(50);
       *    }
       * </pre>
       * @see maxLength
       */
      setMaxLength: function(num) {
         this._options.maxLength = num;
      },

      
      /**
       * @noShow
       */
      setValue: function(value){
         this.setText(value);
      },
      /**
       * @noShow
       */
      getValue: function(){
         return this.getText();
      }
   });

   return TextBoxBase;

});