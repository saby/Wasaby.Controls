define('Controls/Input/RichArea/helpers/handlers/editor', [
   'Controls/Input/RichArea/helpers/format'
], function(formatHelper) {
   /**
    * Module with editor handlers
    */

   var EditorHandlersPlugin = {
      undoRedoChangedCallback: function() {
         var
            undoManager = this._editor.undoManager,
            state = {
               hasUndo: undoManager.hasUndo(),
               hasRedo: undoManager.hasRedo()
            };

         if (!this._lastUndoRedoState || this._lastUndoRedoState.hasRedo !== state.hasRedo || this._lastUndoRedoState.hasUndo !== state.hasUndo) {
            this._lastUndoRedoState = state;
            this._notify('undoRedoChanged', [state]);
         }
      },
      formatChangedCallback: function() {
         this._notify('formatChanged', [formatHelper.getCurrentFormats(this)]);
      },

      selectionChangedCallback: function() {
         var selection = this._editor.selection;
         this._notify('selectionChanged', [selection, selection.getNode()]);
      }
   };

   return EditorHandlersPlugin;
});
