define('Controls-demo/AsyncTest/Childs/CaseThird/First',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/Childs/CaseThird/First'
   ], function (Control, template) {
      'use strict';

      var caseThirdFirstModule = Control.extend({
         _template: template,

         _beforeMount: function (options) {
            return new Promise(function (resolve) {
               setTimeout(function () {
                  resolve();
               }, options.delay);
            });
         },

      });

      return caseThirdFirstModule;
   });
