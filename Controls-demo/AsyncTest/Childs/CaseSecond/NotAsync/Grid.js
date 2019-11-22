define('Controls-demo/AsyncTest/Childs/CaseSecond/NotAsync/Grid',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/Childs/CaseSecond/NotAsync/Grid',
   ], function (Control, template) {
      'use strict';

      var gridModule = Control.extend({
         _template: template,

      });

      return gridModule;
   });
