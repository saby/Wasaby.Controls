define('Controls-demo/Buttons/ButtonsVdom', [
   'Core/Control',
   'tmpl!Controls-demo/Buttons/ButtonsVdom',
   'Controls/Button'
], function (Control,
             template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});