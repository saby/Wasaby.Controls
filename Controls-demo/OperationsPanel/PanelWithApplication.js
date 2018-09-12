define('Controls-demo/OperationsPanel/PanelWithApplication', [
   'Core/Control',
   'wml!Controls-demo/OperationsPanel/PanelWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
