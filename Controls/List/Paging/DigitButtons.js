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
         //получаем граничные цифры, окружающие выбранный элемент, по условия +-3 в обе стороны (4 5 6 [7] 8 9 10)
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

         __initDrawnDigits: function(digitsCount, currentDigit, full) {

            var
               surElements,
               drawnDigits = [];

            if (digitsCount) {

               surElements = this.__calcSurroundElemens(digitsCount, currentDigit);

               if (surElements.first > 1) {
                  //если левая граничная цифра больше единицы, то единицу точно рисуем
                  drawnDigits.push(1);
                  //если левая граничная цифра больше 3, надо рисовать многоточие (1 ... 4 5 6 [7])
                  if (surElements.first > 3) {
                     drawnDigits.push('...');
                  }
                  else if (surElements.first == 3) {//а если 3, то надо рисовать двойку по правилу исключения, что многоточием не может заменяться одна цифра
                     drawnDigits.push(2);
                  }
               }

               //рисуем все граничные цифры
               for (var i = surElements.first; i <= surElements.last; i++) {
                  drawnDigits.push(i);
               }

               //и рисуем правый блок аналогично левому, но в противоположную строну
               if (surElements.last < digitsCount) {
                  if (surElements.last < digitsCount - 2) {
                     drawnDigits.push('...');
                  }
                  else if (surElements.last < digitsCount - 1) {
                     drawnDigits.push(digitsCount - 1);
                  }
                  drawnDigits.push(digitsCount);
               }
            }
            return drawnDigits;
         }

      });

   return ModuleClass;
});