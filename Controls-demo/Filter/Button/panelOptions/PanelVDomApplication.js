define('Controls-demo/Filter/Button/panelOptions/PanelVDomApplication', [
   'Core/Control',
   'tmpl!Controls-demo/Filter/Button/panelOptions/PanelVDomApplication'
], function(Control, template) {
   'use strict';
   
   var ModuleClass = Control.extend({
      _template: template
   });
   
   return ModuleClass;
});
