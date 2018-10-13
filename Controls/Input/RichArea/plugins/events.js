define('Controls/Input/RichArea/plugins/events', [], function() {

   /**
    * Модуль для добавления/удаления обработчиков в БТРе
    */

   var EventPlugin = {
      /**
       * Function bind events to editor
       * @param self
       */
      bindEvents: function(self) {
         var editor = self._editor;

         //Subscribe for paste events
         editor.on('onBeforePaste', self._handlers.beforePasteCallback);

         //Subscribe for key events
         editor.on('input', self._handlers.inputHandler);
         editor.on('keyup', self._handlers.inputHandler);
      },
      /**
       * Function remove events from editor
       * @param self
       */
      offEvents: function(self) {
         var
            tinyEvents = [
               'onBeforePaste',
               'input',
               'keyup'],
            editor = self._editor;

         tinyEvents.forEach(function(eventName) {
            editor.off(eventName);
         });
      }
   };

   return EventPlugin;
});
