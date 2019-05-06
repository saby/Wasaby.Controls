define('Controls-demo/Input/Validate/FormController', [
   'Core/Control',
   'wml!Controls-demo/Input/Validate/FormController',
   'css!Controls-demo/Input/Validate/ValidateInfobox',
   'css!Controls-demo/Input/resources/VdomInputs',
   'Controls/validate',
   'Controls-demo/Input/Validate/Validator'
], function(Control, template) {
   'use strict';
   var VdomDemoText = Control.extend({
      _template: template,
      _value1: '',
      _value2: 'My Name',
      _value5: '',
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
         this._children.formController.submit();
      }
   });
   return VdomDemoText;
});
