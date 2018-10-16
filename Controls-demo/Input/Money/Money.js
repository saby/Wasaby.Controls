define('Controls-demo/Input/Money/Money',
   [
      'Core/Control',
      'wml!Controls-demo/Input/Money/Money'
   ],

   function(Control, template) {

      'use strict';

      var Money = Control.extend({
         _template: template,

         _value: '0.00'
      });

      return Money;
   }
);
