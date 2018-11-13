define('Controls/Input/RichArea/helpers/paste', [
   'Controls/Input/RichArea/helpers/editor'
], function(editorHelper) {
   /**
    * Module which provides work with paste in rich editor
    */

   var PasteHelper = {

      /**
       * Function clear content for pasting
       * @param {string} content html-текст
       * @return {string}
       */
      clearPasteContent: function(content) {
         if (!content) {
            return '';
         }
         var i = content.indexOf('<!--StartFragment-->');
         if (i !== -1) {
            // Это фрагмент текста из MS Word - оставитьтолько непосредственно значимый фрагмент текста
            var j = content.indexOf('<!--EndFragment-->');
            content = content.substring(i + 20, j !== -1 ? j : content.length).trim();
         } else {
            // Вычищаем все ненужные теги, т.к. они в конечном счёте превращаютя в <p>
            content = content.replace(/<!DOCTYPE[^>]*>|<html[^>]*>|<body[^>]*>|<\x2Fhtml>|<\x2Fbody>/gi, '').trim();
         }
         return content;
      },

      /**
       * Function paste content into current cursor position
       * @param self
       * @param content
       */
      paste: function(self, content) {
         content = this.clearPasteContent(content);

         var
            editor = self._editor,
            pasteHelper = editor.plugins.paste;

         // Tinymce paste helper doesn't work in Internet Explorer
         if (pasteHelper) {
            pasteHelper.clipboard.pasteHtml(content, false);
         } else {
            var eventResult = editor.fire('PastePreProcess', { content: content });
            editorHelper.insertHtml(self, eventResult.content);
         }

         self._handlers.inputHandler();
      }
   };

   return PasteHelper;
});
