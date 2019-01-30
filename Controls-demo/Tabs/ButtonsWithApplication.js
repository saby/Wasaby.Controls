define('Controls-demo/Tabs/ButtonsWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Tabs/ButtonsWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
