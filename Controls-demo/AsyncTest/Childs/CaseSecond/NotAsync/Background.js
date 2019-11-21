define('Controls-demo/AsyncTest/Childs/CaseSecond/NotAsync/Background',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/Childs/CaseSecond/NotAsync/Background',
   ], function (Control, template) {
      'use strict';

      var backgroundModule = Control.extend({
         _template: template,

      });

      return backgroundModule;
   });
