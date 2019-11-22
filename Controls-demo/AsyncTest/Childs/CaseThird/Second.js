define('Controls-demo/AsyncTest/Childs/CaseThird/Second',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/Childs/CaseThird/Second'
   ], function (Control, template) {
      'use strict';

      var caseThirdSecondModule = Control.extend({
         _template: template,

         _beforeMount: function (options) {
            return new Promise(function (resolve) {
               setTimeout(function () {
                  resolve();
               }, options.delay);
            });
         },

      });

      return caseThirdSecondModule;
   });
