define('Controls-demo/Popup/TestMaximizedStack',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/TestMaximizedStack'
   ],
   function (Control, template) {
      'use strict';

      var TestMaximizedStack = Control.extend({
         _template: template,
      });

      return TestMaximizedStack;
   }
);