define('Controls-demo/List/ItemActionsCustomWI', [
   'Core/Control',
   'wml!Controls-demo/List/ItemActions/ItemActionsCustomWI'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
