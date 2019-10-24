define('Controls-demo/AsyncTest/Childs/Simple/ThirdNested',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/Childs/Simple/ThirdNested'
   ], function (Control, template) {
      'use strict';

      var simpleThirdNestedChildModule = Control.extend({
         _template: template,

         _beforeMount: function (options) {
            return new Promise(function (resolve) {
               setTimeout(function () {
                  resolve();
               }, options.delay);
            });
         }
      });

      return simpleThirdNestedChildModule;
   });
