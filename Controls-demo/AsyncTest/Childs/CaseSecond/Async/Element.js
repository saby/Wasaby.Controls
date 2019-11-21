define('Controls-demo/AsyncTest/Childs/CaseSecond/Async/Element',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/Childs/CaseSecond/Async/Element',
   ], function (Control, template) {
      'use strict';

      var elementModule = Control.extend({
         _template: template,

         _beforeMount: function (options) {
            return new Promise(function (resolve) {
               setTimeout(function () {
                  resolve();
               }, options.delay);
            });
         },

      });

      return elementModule;
   });
