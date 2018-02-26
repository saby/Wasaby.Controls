define('Controls-demo/Switch/SwitchDemo', [
   'Core/Control',
   'tmpl!Controls-demo/Switch/SwitchDemo'
], function (Control,
             template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});