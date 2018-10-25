define(
   'Controls-demo/Indicator/ProgressBar/ProgressBar',
   [
      'Core/Control',
      'wml!Controls-demo/Indicator/ProgressBar/ProgressBar',

      'css!Controls-demo/Indicator/ProgressBar/ProgressBar'
   ],
   function(
      Control,
      template
   ) {
      'use strict';

      return Control.extend({
         _template: template,

         _totalValue: 100,

         _currentValue: 69,

         _smoothFill: true
      });
   }
);
