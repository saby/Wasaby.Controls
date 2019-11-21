define('Controls-demo/AsyncTest/Childs/FirstChild',
   [
      'Core/Control',
      'Env/Env',
      'wml!Controls-demo/AsyncTest/Childs/FirstChild'
   ], function (Control, Env, template) {
      'use strict';

      var firstChildModule = Control.extend({
         _template: template,
         _multipleControls: 5,
         _beforeMount: function () {
            return new Promise(function (resolve) {
               setTimeout(function () {
                  Env.IoC.resolve('ILogger').info('First resolve');
                  resolve();
               }, 3000);
            });
         }
      });

      return firstChildModule;
   });
