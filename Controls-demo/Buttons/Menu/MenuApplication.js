define('Controls-demo/Buttons/Menu/MenuApplication', [
   'Core/Control',
   'wml!Controls-demo/Buttons/Menu/MenuApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
