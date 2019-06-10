define('Controls-demo/Popup/popupPageApplication', [
   'Core/Control',
   'wml!Controls-demo/Popup/popupPageApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
