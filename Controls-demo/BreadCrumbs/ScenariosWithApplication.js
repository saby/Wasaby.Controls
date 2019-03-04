define('Controls-demo/BreadCrumbs/ScenariosWithApplication', [
   'Core/Control',
   'wml!Controls-demo/BreadCrumbs/ScenariosWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });
   return ModuleClass;
});
