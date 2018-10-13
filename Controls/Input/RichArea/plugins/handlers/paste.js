define('Controls/Input/RichArea/plugins/handlers/paste', [
   'Controls/Input/RichArea/plugins/youtube',
], function(youtubePlugin) {
   /**
    * Модуль содержащий обработчики вставки в БТР
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
