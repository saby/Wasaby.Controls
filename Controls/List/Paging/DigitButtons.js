/**
 * Created by kraynovdo on 01.11.2017.
 */
define('js!Controls/List/Paging/DigitButtons', [
   'Core/Control',
   'tmpl!Controls/List/Paging/DigitButtons'
], function(BaseControl, template) {
   'use strict';
   var SUR_ELEMENTS_STEP = 3;
   var
      ModuleClass = BaseControl.extend({
         _template: template,
         __calcSurroundElemens: function(digitsCount, currentDigit) {
            var first, last;
            first = currentDigit - SUR_ELEMENTS_STEP;
            last = currentDigit + SUR_ELEMENTS_STEP;

            if (first < 1) {
               first = 1;
            }
            if (last > digitsCount) {
               last = digitsCount;
            }
            return {
               first : first,
               last: last
            }
         },

         __initDrawedDigits: function(digitsCount, currentDigit, full) {

            var
               surElements,
               needLeftDot = false,
               needRightDot = false,
               drawedDigits = [];

            if (digitsCount) {

               surElements = this.__calcSurroundElemens(digitsCount, currentDigit);

               if (full) {
                  if (surElements.first - 2 > 1) {
                     needLeftDot = true;
                  }
                  if (surElements.last + 2 < digitsCount) {
                     needRightDot = true;
                  }
               }

               for (var i = 1; i <= digitsCount; i++) {
                  if (i == 1) {
                     drawedDigits.push(i);
                     if (needLeftDot) {
                        drawedDigits.push('...');
                     }
                  }
                  else if (i == digitsCount) {
                     if (needRightDot) {
                        drawedDigits.push('...');
                     }
                     drawedDigits.push(i);
                  }
                  else if (((i >= surElements.first) || !needLeftDot) && ((i <= surElements.last) || !needRightDot)) {
                     drawedDigits.push(i);
                  }
               }
            }
            return drawedDigits;
         }

      });

   return ModuleClass;
});