define('Controls-demo/Search/ContainerApplication', [
   'Core/Control',
   'wml!Controls-demo/Search/ContainerApplication'
], function(Control, template) {
   'use strict';
   
   var ModuleClass = Control.extend({
      _template: template
   });
   
   return ModuleClass;
});
