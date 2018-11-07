define('Controls-demo/List/EditInPlace/ScenariosWithApplication', [
   'Core/Control',
   'wml!Controls-demo/List/EditInPlace/ScenariosWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
