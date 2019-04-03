define('Controls-demo/Popup/Opener/NotificationApplication', [
   'Core/Control',
   'wml!Controls-demo/Popup/Opener/NotificationApplication'
], function(Control, template) {
   'use strict';

   var DemoInfoBox = Control.extend(
      {
         _template: template
      });
   return DemoInfoBox;
});