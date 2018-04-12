define('Controls-demo/Input/Number', [
   'Core/Control',
   'tmpl!Controls-demo/Input/Number',
   'WS.Data/Source/Memory'
], function(Control, template) {

   'use strict';

   var VdomDemoNumber = Control.extend({
      _template: template,
      _placeholder: '',
      _text1: '',
      _tagStyle: '',
      _integersLength: 5,
      _precision: 2,
      _onlyPositive: false,
      _showEmptyDecimals: false,
      _enabled: true
   });

   return VdomDemoNumber;
});
