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

      TestMaximizedStack.getDefaultOptions = function() {
         return {
            minimizedWidth: 500,
            minWidth: 800,
            maxWidth: 1200
         }
      };

      return TestMaximizedStack;
   }
);