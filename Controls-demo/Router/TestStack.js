define('Controls-demo/Router/TestStack',
   [
      'Core/Control',
      'wml!Controls-demo/Router/TestStack'
   ],
   function (Control, template) {
      'use strict';

      var TestDialog = Control.extend({
         _template: template
      });

      return TestDialog;
   }
);