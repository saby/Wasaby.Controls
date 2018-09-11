define('Controls-demo/Switch/standartDemoSwitchWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Switch/standartDemoSwitchWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
