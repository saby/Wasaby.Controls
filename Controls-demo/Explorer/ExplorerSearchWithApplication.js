define('Controls-demo/Explorer/ExplorerSearchWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Explorer/ExplorerSearchWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
