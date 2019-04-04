define('Controls-demo/Explorer/ExplorerSearchWithApplocation', [
   'Core/Control',
   'wml!Controls-demo/Explorer/ExplorerSearchWithApplocation'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
