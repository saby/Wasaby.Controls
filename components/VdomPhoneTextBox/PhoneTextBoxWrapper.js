define('SBIS3.CONTROLS/VdomPhoneTextBox/PhoneTextBoxWrapper',
   [
      'Core/Control',
      'tmpl!SBIS3.CONTROLS/VdomPhoneTextBox/PhoneTextBoxWrapper',

      'Controls/Input/Phone'
   ],
   function(Control, template) {


      'use strict';

      return Control.extend({
         _template: template,

         _beforeMount: function(options) {
            this._value = options.value;
         },

         _valueChangedHandler: function() {
            this._notify('onValueChange', this._value);
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
         },

         setValidationError: function(validationError) {
            this._validationErrors = validationError || [validationError];
            this._forceUpdate();
         },

         getDisplayValue: function() {
            return this._children.phone._viewModel.getDisplayValue();
         }
      })
   }
);