define('Controls-demo/DragNDrop/DemoWithApplication', [
   'Core/Control',
   'wml!Controls-demo/DragNDrop/DemoWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
