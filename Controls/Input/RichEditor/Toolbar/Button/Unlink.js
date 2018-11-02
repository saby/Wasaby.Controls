define('Controls/Input/RichEditor/Toolbar/Button/Unlink', [
   'Core/Control',
   'wml!Controls/Input/RichEditor/Toolbar/Button/Unlink/Unlink'
], function(Control, template) {
   /**
    * Component Toolbar/Button/Unlink
    * Button for removing link from selected text
    * @class Controls/Input/RichEditor/Toolbar/Button/Link
    * @extends Core/Control
    * @control
    * @author Волоцкой В.Д.
    */

   return Control.extend({
      _template: template,
      _readOnly: true,

      _afterMount: function() {
         this._notify('register', ['selectionChanged', this, this._selectionChangedHandler], { bubbling: true });
      },

      _selectionChangedHandler: function(selection, node) {
         this._readOnly = !(node.tagName === 'a' || !!node.closest('a'));
         this._forceUpdate();
      },

      _clickHandler: function() {
         this._notify('execCommand', [[{ command: 'unlink' }]], { bubbling: true });
      },

      _beforeUnmount: function() {
         this._notify('unregister', ['selectionChanged', this], { bubbling: true });
      }
   });
});
