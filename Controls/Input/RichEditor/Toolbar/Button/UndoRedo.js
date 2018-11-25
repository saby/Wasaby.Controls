define('Controls/Input/RichEditor/Toolbar/Button/UndoRedo', [
   'Core/Control',
   'wml!Controls/Input/RichEditor/Toolbar/Button/UndoRedo/UndoRedo'
], function(Control, template) {
   /**
    * Component Toolbar/Button/UndoRedo
    * Button for undo/redo actions from rich editor
    * @class Controls/Input/RichEditor/Toolbar/Button/UndoRedo
    * @extends Core/Control
    * @control
    * @author Волоцкой В.Д.
    */

   var CONSTANTS = {
      UNDO: 'undo',
      REDO: 'redo'
   };

   return Control.extend({
      _template: template,
      _readOnly: null,

      _beforeMount: function(options) {
         this._command = options.command;
      },

      _afterMount: function() {
         this._notify('register', ['undoRedoChanged', this, this._undoRedoChangedHandler], { bubbling: true });
      },

      _undoRedoChangedHandler: function(undoRedoState) {
         if (this._command === CONSTANTS.UNDO) {
            this._readOnly = !undoRedoState.hasUndo;
         } else {
            this._readOnly = !undoRedoState.hasRedo;
         }
         this._forceUpdate();
      },

      _clickHandler: function() {
         this._notify('execCommand', [[{ command: this._command }]], { bubbling: true });
      },

      _beforeUnmount: function() {
         this._notify('unregister', ['undoRedoChanged', this], { bubbling: true });
      }
   });
});
