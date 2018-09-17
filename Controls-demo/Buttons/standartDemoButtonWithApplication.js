define('Controls-demo/Buttons/standartDemoButtonWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Buttons/standartDemoButtonWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
