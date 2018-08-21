define('Controls-demo/OperationsPanel/PanelWithApplication', [
   'Core/Control',
   'tmpl!Controls-demo/OperationsPanel/PanelWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
