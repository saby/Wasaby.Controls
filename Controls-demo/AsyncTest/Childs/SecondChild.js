define('Controls-demo/AsyncTest/Childs/SecondChild',
   [
      'Core/Control',
      'Env/Env',
      'wml!Controls-demo/AsyncTest/Childs/SecondChild'
   ], function (Control, Env, template) {
      'use strict';

      var secondChildModule = Control.extend({
         _template: template,
         _multipleControls: 5,
         _multipleChildControls: 2,

         _beforeMount: function () {
            return new Promise(function (resolve) {
               setTimeout(function () {
                  Env.IoC.resolve('ILogger').info('Second resolve');
                  resolve();
               }, 2000);
            });
         }
      });

      return secondChildModule;
   });
