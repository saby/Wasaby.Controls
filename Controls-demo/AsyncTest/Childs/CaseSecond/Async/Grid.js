define('Controls-demo/AsyncTest/Childs/CaseSecond/Async/Grid',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/Childs/CaseSecond/Async/Grid',
   ], function (Control, template) {
      'use strict';

      var gridModule = Control.extend({
         _template: template,

         _beforeMount: function (options) {
            return new Promise(function (resolve) {
               setTimeout(function () {
                  resolve();
               }, options.delay);
            });
         },

      });

      return gridModule;
   });
