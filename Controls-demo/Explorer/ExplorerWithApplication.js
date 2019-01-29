define('Controls-demo/Explorer/ExplorerWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Explorer/ExplorerWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
