define('Controls-demo/Checkbox/standartDemoCheckboxWithApplication', [
   'Core/Control',
   'tmpl!Controls-demo/Checkbox/standartDemoCheckboxWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
