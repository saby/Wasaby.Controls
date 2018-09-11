define('Controls-demo/Filter/Button/PanelVDomApplication', [
   'Core/Control',
   'wml!Controls-demo/Filter/Button/PanelVDomApplication'
], function(Control, template) {
   'use strict';
   
   var ModuleClass = Control.extend({
      _template: template
   });
   
   return ModuleClass;
});
