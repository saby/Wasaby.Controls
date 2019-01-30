define('Controls-demo/Toolbar/ToolbarWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Toolbar/ToolbarWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
