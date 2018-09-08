define('Controls-demo/Filter/ContainerApplication', [
   'Core/Control',
   'wml!Controls-demo/Filter/ContainerApplication'
], function(Control, template) {
   'use strict';
   
   var ModuleClass = Control.extend({
      _template: template
   });
   
   return ModuleClass;
});
