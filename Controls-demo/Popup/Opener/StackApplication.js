define('Controls-demo/Popup/Opener/StackApplication', [
   'Core/Control',
   'wml!Controls-demo/Popup/Opener/StackApplication'
], function(Control, template) {
   'use strict';

   var DemoInfoBox = Control.extend(
      {
         _template: template
      });
   return DemoInfoBox;
});