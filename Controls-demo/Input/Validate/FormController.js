define('Controls-demo/Input/Validate/FormController', [
   'Core/Control',
   'wml!Controls-demo/Input/Validate/FormController',
   'css!Controls-demo/Input/Validate/ValidateInfobox',
   'css!Controls-demo/Input/resources/VdomInputs',
   'Controls/validate',
   'Controls-demo/Input/Validate/Validator',
   'Controls-demo/Input/Validate/EqualEmailValidator'
], function(Control, template) {
   'use strict';
   var VdomDemoText = Control.extend({
      _template: template,
      _value1: '',
      _value2: 'Иван',
      _value5: '',
      _value6: 'email@pochta',
      _valueReadOnly: '234567',
      _items: null,
      _placeholder: 'Input text',
      _setValue: function(e, record) {
         this._example = record.get('example');
      },
      _eventHandler: function(e, value) {
         this._eventResult = e.type + ': ' + value;
      },
      _clickHandler: function() {
         var self = this;
         this._children.formController.submit().then(function(result) {
            if (self._isValid(result)) {
               self._children.Confirmation.open({
                  message: 'Валидация прошла успешно',
                  type: 'ok'
               });
            }
         });
      },
      _isValid: function(result) {
         for (var i = 0; i < Object.keys(result).length; i++) {
            if (result[i] !== null) {
               return false;
            }
         }
         return true;
      }
   });
   return VdomDemoText;
});
