define('Controls-demo/AsyncTest/Childs/CaseSecond/Async/Background',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/Childs/CaseSecond/Async/Background',
   ], function (Control, template) {
      'use strict';

      var backgroundModule = Control.extend({
         _template: template,

         _beforeMount: function (options) {
            return new Promise(function (resolve) {
               setTimeout(function () {
                  resolve();
               }, options.delay);
            });
         },

      });

      return backgroundModule;
   });
