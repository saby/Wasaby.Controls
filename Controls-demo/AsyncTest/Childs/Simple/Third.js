define('Controls-demo/AsyncTest/Childs/Simple/Third',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/Childs/Simple/Third'
   ], function (Control, template) {
      'use strict';

      var simpleThirdChildModule = Control.extend({
         _template: template,

         _beforeMount: function (options) {
            return new Promise(function (resolve) {
               setTimeout(function () {
                  resolve();
               }, options.delay);
            });
         }
      });

      return simpleThirdChildModule;
   });
