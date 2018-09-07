define('Controls-demo/Input/MaskTest/MaskTest', [
   'Core/Control',
   'wml!Controls-demo/Input/MaskTest/MaskTest',
   'WS.Data/Source/Memory'
], function(Control, template) {

   'use strict';

   var MaskTest = Control.extend({
      _template: template

   });

   return MaskTest;
});