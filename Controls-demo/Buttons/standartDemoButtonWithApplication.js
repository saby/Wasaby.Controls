define('Controls-demo/Buttons/standartDemoButtonWithApplication', [
   'Core/Control',
   'tmpl!Controls-demo/Buttons/standartDemoButtonWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
