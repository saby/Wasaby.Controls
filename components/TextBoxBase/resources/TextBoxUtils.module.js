define('js!SBIS3.CONTROLS.TextBoxUtils', ['Core/constants'], function(constants){
   return {
      getTextFromDropEvent: function(event) {
         return event.originalEvent.dataTransfer.getData('text');
      },
      getTextFromPasteEvent: function(event) {
         return event.originalEvent.clipboardData ? event.originalEvent.clipboardData.getData('text') : window.clipboardData.getData('text');
      },

      // методы getCaretPosition и setCaretPosition понадобятся при переводе всех Полей ввода на использование одного механизма получения каретки
      getCaretPosition : function(element){
         var caretOffset = 0;
         if (typeof window.getSelection != "undefined") {
            var range = window.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
         } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
            var textRange = document.selection.createRange();
            var preCaretTextRange = document.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
         }

         return [caretOffset,caretOffset];
      },

      setCaretPosition : function(field, pos, pos2){
         pos2 = pos2 || pos;
         var charCount = 0,
             selTextNode = 0,
             posInNode = pos,
             textNodeLengh;

         if (constants.browser.isIE  &&  constants.browser.IEVersion < 12) { //в Edge (ie12) не работает createTextRange
            var rng = document.body.createTextRange();
            rng.moveToElementText(field.parentNode);
            rng.move('character', pos);
            rng.select();
         } else {
            var selection = window.getSelection();
            //Оборачиваем вызов selection.collapse в try из за нативной баги FireFox(https://bugzilla.mozilla.org/show_bug.cgi?id=773137)
            try {
               // при установке каретки в contentEditable блок необходимо найти текстовый узел в который поставится каретка
               // и рассчитать позицию каретки относительно найденного узла
               do {
                  if(field.childNodes[selTextNode].nodeType === 3){
                     textNodeLengh = field.childNodes[selTextNode].length;
                     charCount += textNodeLengh;
                     if(charCount < pos) {
                        posInNode -= textNodeLengh;
                     }
                  }
                  i++
               }
               while(charCount < pos && field.childNodes[selTextNode]);

               selection.collapse(field.childNodes[i - 1], posInNode);
            } catch (e) {
            }
         }
      }
   }
});