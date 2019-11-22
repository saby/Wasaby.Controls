define('Controls-demo/AsyncTest/Childs/CaseSecond/NotAsync/Element',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/Childs/CaseSecond/NotAsync/Element',
   ], function (Control, template) {
      'use strict';

      var elementModule = Control.extend({
         _template: template,

      });

      return elementModule;
   });
