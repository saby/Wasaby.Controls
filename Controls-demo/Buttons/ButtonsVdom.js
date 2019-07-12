define('Controls-demo/Buttons/ButtonsVdom', [
   'Env/Env',
   'Core/Control',
   'wml!Controls-demo/Buttons/ButtonsVdom',
   'css!Controls-demo/Buttons/ButtonsVdom',
   'Controls/buttons'
], function (Env, Control,
             template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template,

         clickHandler: function () {
            Env.IoC.resolve('ILogger').info('click to button');
         }
      });
   return ModuleClass;
});