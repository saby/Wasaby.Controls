define('Controls-demo/Input/Dropdown/DropdownApplication', [
   'Core/Control',
   'wml!Controls-demo/Input/Dropdown/DropdownApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
