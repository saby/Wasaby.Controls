define('Controls-demo/AsyncTest/Childs/Simple/First',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/Childs/Simple/First'
   ], function (Control, template) {
      'use strict';

      var simpleFirstChildModule = Control.extend({
         _template: template,

         _beforeMount: function (options) {
            return new Promise(function (resolve) {
               setTimeout(function () {
                  resolve();
               }, options.delay);
            });
         },

      });

      return simpleFirstChildModule;
   });
