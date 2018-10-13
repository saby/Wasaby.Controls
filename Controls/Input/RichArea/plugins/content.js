define('Controls/Input/RichArea/plugins/content', [
   'SBIS3.CONTROLS/Utils/RichTextAreaUtil/RichTextAreaUtil',
], function(RichUtil) {

   /**
    * Модуль для работы с содержимым БТР
    */

   var ContentPlugin = {
      /**
       * Function put html into editor
       * @param self - context
       * @param html
       */
      insertHtml: function(self, html) {
         html = ContentPlugin.prepareContent(html);

         self._editor.insertContent(html);
      },
      /**
       * Function return prepared content
       * @param {String} text
       * @returns {String}
       */
      prepareContent: function(text) {
         return RichUtil.unDecorateLinks(text);
      }
   };

   return ContentPlugin;
});
