define('Controls-demo/Switch/DoubleSwitchDemo', [
   'Core/Control',
   'tmpl!Controls-demo/Switch/DoubleSwitchDemo'
], function (Control,
             template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});