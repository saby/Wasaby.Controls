

      

      export = {

         /**
          * Хелпер для вставки текста в поле ввода. В нём происходит вставка и выставляется позиция каретки dom-элемета
          * @param inputRender экземпляр контрола InputRender
          * @param domInputElement инпут (dom-элемент)
          * @param textToPaste текст для вставки в поле
          * @param [selection] the selection in the field
          */
         pasteHelper: function(inputRender, domInputElement, textToPaste, selection) {
            var selectionStart = selection ? selection.start : domInputElement.selectionStart;
            var selectionEnd = selection ? selection.end : domInputElement.selectionEnd;

            return inputRender.paste(textToPaste, selectionStart, selectionEnd);
         }
      };
   
