define('Controls-demo/InfoBox/Opener/InfoBoxApplication', [
   'Core/Control',
   'wml!Controls-demo/InfoBox/Opener/InfoBoxApplication'
], function(Control, template) {
   'use strict';

   var DemoInfoBox = Control.extend(
      {
         _template: template
      });
   return DemoInfoBox;
});
