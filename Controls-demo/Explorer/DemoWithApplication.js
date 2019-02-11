define('Controls-demo/Explorer/DemoWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Explorer/DemoWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
