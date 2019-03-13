define('Controls-demo/List/Swipe/ScenariosWithApplication', [
   'Core/Control',
   'wml!Controls-demo/List/Swipe/ScenariosWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
