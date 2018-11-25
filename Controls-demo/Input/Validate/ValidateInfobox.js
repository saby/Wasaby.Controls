define('Controls-demo/Input/Validate/ValidateInfobox', [
   'Core/Control',
   'wml!Controls-demo/Input//Validate/ValidateInfobox',
   'WS.Data/Source/Memory',
   'css!Controls-demo/Input/resources/VdomInputs',
   'Controls/Validate/Validators/IsINN',
   'Controls/Validate/Validators/IsEmail'
], function(Control, template, Memory) {
   'use strict';
   var VdomDemoText = Control.extend({
      _template: template,
      _value: '',
      _value2: '',
      _items: null,
      _placeholder: 'Input text',
      _setValue: function(e, record) {
         this._example = record.get('example');
      },
      _openPanel: function() {
         this._children.opener.open();
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
