define('Controls/Input/RichArea/helpers/events', [
], function() {
   /**
    * Module for add event listeners for tinyMCE instance
    */

   var EventHelper = {

      /**
       * Function bind events to editor
       * @param self
       */
      bindEvents: function(self) {
         var editor = self._editor;

         // Subscribe for paste events
         editor.on('onBeforePaste', self._handlers.beforePasteCallback);

         // Subscribe for key events
         editor.on('input', self._handlers.inputHandler);
         editor.on('keyup', self._handlers.inputHandler);
         editor.on('keypress', self._handlers.inputHandler);
         editor.on('keydown', self._handlers.inputHandler);

         // Subscribe for editor events
         editor.on('undo', self._handlers.inputHandler);
         editor.on('redo', self._handlers.inputHandler);
         editor.on('undo redo TypingUndo BeforeAddUndo AddUndo ClearUndos', self._handlers.undoRedoChangedCallback);

         // Subscribe for selection events
         editor.on('NodeChange', self._handlers.selectionChangedCallback);
         editor.on('SelectionChange', self._handlers.formatChangedCallback);
         editor.on('SelectionChange', self._handlers.selectionChangedCallback);
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
               'keyup',
               'keydown',
               'keypress',
               'undo',
               'redo',
               'TypingUndo',
               'BeforeAddUndo',
               'AddUndo',
               'ClearUndos',
               'SelectionChange',
               'NodeChange'
            ],
            editor = self._editor;

         tinyEvents.forEach(function(eventName) {
            editor.off(eventName);
         });
      }
   };

   return EventHelper;
});
