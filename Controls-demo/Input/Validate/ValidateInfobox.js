define('Controls-demo/Input/Validate/ValidateInfobox', [
   'Core/Control',
   'wml!Controls-demo/Input//Validate/ValidateInfobox',
   'css!Controls-demo/Input/resources/VdomInputs',
   'Controls/Validate/Validators/IsINN',
   'Controls/Validate/Validators/IsEmail'
], function(Control, template) {
   'use strict';
   var VdomDemoText = Control.extend({
      _template: template,
      _value: '',
      _value2: '',
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
