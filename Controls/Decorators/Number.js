define('Controls/Decorators/Number', [],
   function() {

      'use strict';

      /**
       * Divide the number into triads.
       *
       * @name Controls/Decorators/Number#number
       * @cfg {Number} Number to divide into triads.
       *
       * @name Controls/Decorators/Number#fractionSize
       * @cfg {Number} Number of decimal places. Range from 0 to 20.
       */
      return function(number, fractionSize) {
         number = parseFloat(number);

         return number.toFixed(fractionSize).replace(/(?=(\d{3})+\.)/g, ' ');
      };
   }
);
