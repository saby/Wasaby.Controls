define('Controls-demo/List/Tree/EditArrowWI', [
   'Core/Control',
   'wml!Controls-demo/List/Tree/EditArrow/EditArrowWI'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
