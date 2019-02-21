define('Controls-demo/ProcessStateIndicator/IndexApp', [
   'Core/Control',
   'wml!Controls-demo/ProcessStateIndicator/IndexApp'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
