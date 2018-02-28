define('Controls-demo/Input/Number', [
   'Core/Control',
   'tmpl!Controls-demo/Input/Number',
   'WS.Data/Source/Memory'
], function(Control, template) {

   'use strict';

   var VdomDemoNumber = Control.extend({
      _template: template,
      _text1: '',
      _tagStyle: '',
      _integersLength: '',
      _precision: '',
      _onlyPositive: '',
      _enabled: true
   });

   return VdomDemoNumber;
});
