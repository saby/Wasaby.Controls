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
               caretPosition = inputRender.paste(textToPaste) + textToPaste.length;

            //https://online.sbis.ru/opendoc.html?guid=131cface-d0e8-4c4d-a983-9c10ac233433
            setTimeout(function() {
               //Вызываем метод setSelectionRange, чтобы не сбилась позиция каретки
               domInputElement.setSelectionRange(caretPosition, caretPosition);
            }, 1);
         }
      };
   }
);