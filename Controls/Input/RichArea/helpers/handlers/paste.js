define('Controls/Input/RichArea/helpers/handlers/paste', [
   'Controls/Input/RichArea/helpers/youtube'
], function(youtubePlugin) {
   /**
    * Module with paste handlers
    */

   var PasteHandlersPlugin = {
      beforePasteCallback: function(event) {
         if (youtubePlugin.addYouTubeVideo(this, event.content)) {
            return false;
         }
      }
   };

   return PasteHandlersPlugin;
});
