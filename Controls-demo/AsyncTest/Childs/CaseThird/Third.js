define('Controls-demo/AsyncTest/Childs/CaseThird/Third',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/Childs/CaseThird/Third'
   ], function (Control, template) {
      'use strict';

      var caseThirdThirdModule = Control.extend({
         _template: template,

         _beforeMount: function (options) {
            return new Promise(function (resolve) {
               setTimeout(function () {
                  resolve();
               }, options.delay);
            });
         },

      });

      return caseThirdThirdModule;
   });
