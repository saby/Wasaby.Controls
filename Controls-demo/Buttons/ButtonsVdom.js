define('Controls-demo/Buttons/ButtonsVdom', [
   'Core/Control',
   'wml!Controls-demo/Buttons/ButtonsVdom',
   'css!Controls-demo/Buttons/ButtonsVdom',
   'Controls/buttons'
],
function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });
   return ModuleClass;
});
