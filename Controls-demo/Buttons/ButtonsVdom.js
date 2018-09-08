define('Controls-demo/Buttons/ButtonsVdom', [
   'Core/Control',
   'wml!Controls-demo/Buttons/ButtonsVdom',
   'css!Controls-demo/Buttons/ButtonsVdom',
   'Controls/Button'
], function (Control,
             template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template,

         clickHandler: function () {
            console.log('click to button');
         }
      });
   return ModuleClass;
});