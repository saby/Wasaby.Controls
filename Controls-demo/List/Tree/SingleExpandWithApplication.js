define('Controls-demo/List/Tree/SingleExpandWithApplication', [
   'Core/Control',
   'wml!Controls-demo/List/Tree/SingleExpandWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
