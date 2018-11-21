define('Controls/Utils/splitIntoTriads', [], function() {

   'use strict';
   
   var _private = {
      NUMBER_DIGITS_TRIAD: 3,

      reducerRight: function(value, current, index, arr) {
         var processedElements = arr.length - index - 1;

         if (processedElements % _private.NUMBER_DIGITS_TRIAD === 0) {
            value = ' ' + value;
         }

         return current + value;
      }
   };

   /**
    * @param {String} value
    */
   return function(value) {
      return Array.prototype.reduceRight.call(value, _private.reducerRight);
   };
});
