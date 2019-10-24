define('Controls-demo/AsyncTest/Childs/ThirdChild',
   [
      'Core/Control',
      'Env/Env',
      'wml!Controls-demo/AsyncTest/Childs/ThirdChild'
   ], function (Control, Env, template) {
      'use strict';

      var thirdChildModule = Control.extend({
         _template: template,
         _multipleControls: 2,

         _beforeMount: function () {
            return new Promise(function (resolve) {
               setTimeout(function () {
                  Env.IoC.resolve('ILogger').info('Third resolve');
                  resolve();
               }, 700);
            });
         }
      });

      return thirdChildModule;
   });
