define('Controls-demo/FilterSearch/FilterSearchApplication', [
   'Core/Control',
   'wml!Controls-demo/FilterSearch/FilterSearchApplication'
], function(Control, template) {
   'use strict';
   
   var ModuleClass = Control.extend({
      _template: template
   });
   
   return ModuleClass;
});
