define('js!WSControls/TextBoxes/resources/CalcInputText', [],
   function() {

      'use strict';

      return {
         /**
          * Получить разбиение по введенной строке.
          * @param oldText строка до ввода.
          * @param newText строка после ввода.
          * @param caretPosition позиция каретки после ввода.
          * @param selectionLength длина выделения до ввода.
          * @returns {array} [Строка до введенной, введенная строка, Строка после введенной]
          */
         getSplitInputText: function(oldText, newText, caretPosition, selectionLength) {
            var inputText, beforeInputText, afterInputText;

            afterInputText = newText.substring(caretPosition);
            beforeInputText = oldText.substring(0, oldText.length - afterInputText.length - selectionLength);
            inputText = newText.substring(beforeInputText.length, newText.length - afterInputText.length);

            return {
               beforeInputText: beforeInputText,
               inputText: inputText,
               afterInputText: afterInputText
            };
         }
      }
   }
);