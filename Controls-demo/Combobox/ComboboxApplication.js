define('Controls-demo/Combobox/ComboboxApplication', [
   'Core/Control',
   'wml!Controls-demo/Combobox/ComboboxApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
