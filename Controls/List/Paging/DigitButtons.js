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



         __calcSurrondElemens: function() {

         },

         __initDrawedDigits: function(digitsCount, currentDigit, full) {

            var
               surFirstElem, surLastElem,
               needLeftDot = false,
               needRightDot = false,
               drawedDigits = [];

            if (digitsCount) {
               surFirstElem = currentDigit - SUR_ELEMENTS_STEP;
               surLastElem = currentDigit + SUR_ELEMENTS_STEP;

               if (surFirstElem < 1) {
                  surFirstElem = 1;
               }
               if (surLastElem > digitsCount) {
                  surLastElem = digitsCount;
               }

               if (full) {
                  if (surFirstElem - 1 > 1) {
                     needLeftDot = true;
                  }
                  if (surLastElem + 1 < digitsCount) {
                     needRightDot = true;
                  }
               }

               var counter = 1;

               for (var i = 1; i <= digitsCount; i++) {
                  if (i < )
               }




               projection.each(function (item) {
                  var curId = parseInt(item.getContents().getId(), 10);
                  if (!full) {
                     if (curId >= surFirstElem && curId <= surLastElem) {
                        records.push(item);
                     }
                  }
                  else if (full) {
                     if (counter == 1 || counter == digitsCount) {
                        records.push(item);
                     }
                     else {
                        if (needLeftDot && counter == 2) {
                           records.push('...');
                        }
                        if (needRightDot && counter == digitsCount - 1) {
                           records.push('...');
                        }
                        if (curId >= surFirstElem && curId <= surLastElem) {
                           records.push(item);
                        }
                     }
                  }
                  counter++;
               });
            }
            return records;
         }

      });

   return ModuleClass;
});