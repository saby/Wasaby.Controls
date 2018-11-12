define('Controls/Input/RichArea/helpers/placeholder', [], function() {
   /**
    * Module which provides work with TinyMCE's placeholder
    */

   var PlaceholderHelper = {

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
         }
         return false;
      }
   };

   return PlaceholderHelper;
});
