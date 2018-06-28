define('Controls-demo/Input/Number/Number', [
   'Core/Control',
   'tmpl!Controls-demo/Input/Number/Number',
   'WS.Data/Source/Memory'
], function(Control, template) {

   'use strict';

   var VdomDemoNumber = Control.extend({
      _template: template,
      _placeholder: '',
      _text1: '',
      _tagStyle: 'primary',
      _integersLength: 5,
      _precision: 2,
      _onlyPositive: true,
      _showEmptyDecimals: false,
      _readOnly: false,
      _eventResult: '',
      _selectOnClick: false,

      _eventHandler: function(e, value) {
         this._eventResult = e.type + ': ' + value;
      }
   });

   return VdomDemoNumber;
});
