define('SBIS3.CONTROLS/VdomPhoneTextBox',
   [
      'Core/Control',
      'tmpl!SBIS3.CONTROLS/VdomPhoneTextBox/VdomPhoneTextBox',

      'Controls/Input/Phone'
   ],
   function(Control, template) {

      'use strict';

      /**
       * Поле ввода телефонного номера.
       * Данный контрол является оберткой над vdom контролом Controls/Input/Phone.
       * Использовать следует только после согласования с платформой.
       * @class SBIS3.CONTROLS/VdomPhoneTextBox
       * @extends Core/Control
       * @author Журавлев М. С.
       */
      var VdomPhoneTextBox = Control.extend(/** @lends SBIS3.CONTROLS/VdomPhoneTextBox.prototype*/{
         _template: template,

         _beforeMount: function(options) {
            this._value = options.value;
         },

         _valueChangedHandler: function() {
            this._notify('valueChanged', [this._value]);
         },

         /**
          * Получает текстовое значение поля ввода телефонного номера без разделителей.
          * @returns {*|value|string}
          * @example
          * <pre>
          *     myComponent.subscribe('onTextChange', function(){
       *        myPhone.getValue();
       *     });
          * </pre>
          * @see value
          * @see setValue
          */
         getValue: function() {
            return this._value;
         },

         /**
          * Устанавливает текстовое значение поля ввода телефонного номера без разделителей.
          * @param value
          * @example
          * <pre>
          *     myComponent.subscribe('onClick', function(){
       *        myPhone.setValue("88001002424");
       *     });
          * </pre>
          * @see value
          * @see getValue
          */
         setValue: function(value) {
            this._value = value;
            this._forceUpdate();
         }
      });

      return VdomPhoneTextBox;
   }
);