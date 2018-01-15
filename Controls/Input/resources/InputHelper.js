define('Controls/Input/resources/InputHelper',
   [],
   function() {

      'use strict';

      return {
         /**
          * Хелпер для вставки текста в поле ввода. В нём происходит вставка и выставляется позиция каретки dom-элемета
          * @param inputRender экземпляр контрола InputRender
          * @param domInputElement инпут (dom-элемент)
          * @param textToPaste текст для вставки в поле
          */
         pasteHelper: function(inputRender, domInputElement, textToPaste) {
            var
               caretPosition = inputRender.paste(textToPaste);

            //Вызываем метод setSelectionRange, чтобы не сбилась позиция каретки
            domInputElement.setSelectionRange(caretPosition, caretPosition);
         }
      };
   }
);