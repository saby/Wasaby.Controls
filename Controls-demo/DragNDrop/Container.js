define('Controls-demo/DragNDrop/Container', [
   'Core/Control',
   'tmpl!Controls-demo/DragNDrop/Container/Container',
   'css!Controls-demo/DragNDrop/Container/Container'
], function(BaseControl, template) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template
   });
   return ModuleClass;
});
