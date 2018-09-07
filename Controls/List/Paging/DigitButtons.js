/**
 * Created by kraynovdo on 01.11.2017.
 */
define('Controls/List/Paging/DigitButtons', [
   'Core/Control',
   'wml!Controls/List/Paging/DigitButtons',
   'css!Controls/List/Paging/DigitButtons'
], function(BaseControl, template) {
   'use strict';
   var SUR_ELEMENTS_STEP = 3, _private, ModuleClass;


   _private = {

      //получаем граничные цифры, окружающие выбранный элемент, по условия +-3 в обе стороны (4 5 6 [7] 8 9 10)
      getSurroundElemens: function(digitsCount, currentDigit) {
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
            first: first,
            last: last
         };
      },
      getDrawnDigits: function(digitsCount, currentDigit) {
         var
            surElements,
            drawnDigits = [];

         if (digitsCount) {

            surElements = _private.getSurroundElemens(digitsCount, currentDigit);

            if (surElements.first > 1) {
               //если левая граничная цифра больше единицы, то единицу точно рисуем
               drawnDigits.push(1);

               //если левая граничная цифра больше 3, надо рисовать многоточие (1 ... 4 5 6 [7])
               if (surElements.first > 3) {
                  drawnDigits.push('...');
               } else if (surElements.first == 3) {//а если 3, то надо рисовать двойку по правилу исключения, что многоточием не может заменяться одна цифра
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
               } else if (surElements.last < digitsCount - 1) {
                  drawnDigits.push(digitsCount - 1);
               }
               drawnDigits.push(digitsCount);
            }
         }
         return drawnDigits;
      }
   };

   ModuleClass = BaseControl.extend({
      _selectedKey: null,
      _template: template,
      _digits: null,

      _beforeMount: function(newOptions) {
         this._digits = _private.getDrawnDigits(newOptions.count, newOptions.selectedKey);
      },

      _beforeUpdate: function(newOptions) {
         if (newOptions.count != this._options.count || newOptions.selectedKey != this._options.selectedKey) {
            this._digits = _private.getDrawnDigits(newOptions.count, newOptions.selectedKey);
         }
      },

      __digitClick: function(e, digit) {
         this._notify('onDigitClick', [digit]);
      }

   });

   //for unit test
   ModuleClass._private = _private;

   //

   return ModuleClass;
});
