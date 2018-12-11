define('Controls/Utils/splitIntoTriads',
   [
      'Controls/Utils/RegExp'
   ],
   function(RegExpUtil) {
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
       * @param {String} value String representation of a number.
       */
      return function(value) {
         var part = value.match(RegExpUtil.partOfNumber).slice(1, 5);

         if (part[1]) {
            /**
             * We divide the integer part into triads.
             */
            part[1] = Array.prototype.reduceRight.call(part[1], _private.reducerRight);

            return part.join('');
         }

         return value;
      };
   });
