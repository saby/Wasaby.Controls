define('Controls/Input/RichArea/plugins/paste', [], function() {
   /**
    * Модуль для работы со вставкой в БТР
    */

   var PastePlugin = {

      /**
       * Почистить контент из клипборда для его последующей вставки
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
      }
   };

   return PastePlugin;
});
