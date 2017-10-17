define('js!WSControls/TextBoxes/resources/CalcInputValue', [],
   function() {

      'use strict';

      return {
         /**
          * Получить разбиение по введенной строке.
          * @param oldValue строка до ввода.
          * @param newValue строка после ввода.
          * @param caretPosition позиция каретки после ввода.
          * @param selectionLength длина выделения до ввода.
          * @returns {array} [Строка до введенной, введенная строка, Строка после введенной]
          */
         getSplitInputValue: function(oldValue, newValue, caretPosition, selectionLength) {
            var inputValue, beforeInputValue, afterInputValue;

            afterInputValue = newValue.substring(caretPosition);
            beforeInputValue = oldValue.substring(0, oldValue.length - afterInputValue.length - selectionLength);
            inputValue = newValue.substring(beforeInputValue.length, newValue.length - afterInputValue.length);

            return {
               beforeInputValue: beforeInputValue,
               inputValue: inputValue,
               afterInputValue: afterInputValue
            };
         }
      }
   }
);