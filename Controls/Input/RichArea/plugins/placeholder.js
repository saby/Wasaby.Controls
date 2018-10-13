define('Controls/Input/RichArea/plugins/placeholder', [], function () {

   /**
    * Модуль-хэлпер для плэйсхолдера
    */

   var PlaceholderPlugin = {
      /**
       * Function checks placeholder is required or not
       * @param text
       */
      isPlaceholderActive: function(value) {
         if (!value.length &&
            (value.indexOf('</li>') < 0 &&
               value.indexOf('<p>&nbsp;') < 0 &&
               value.indexOf('<p><br>&nbsp;') < 0 &&
               value.indexOf('<blockquote>') < 0)) {
            return true;
         } else {
            return false;
         }
      }
   };

   return PlaceholderPlugin;
});
