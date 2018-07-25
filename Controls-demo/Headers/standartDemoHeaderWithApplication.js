define('Controls-demo/Headers/standartDemoHeaderWithApplication', [
   'Core/Control',
   'tmpl!Controls-demo/Headers/standartDemoHeaderWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});