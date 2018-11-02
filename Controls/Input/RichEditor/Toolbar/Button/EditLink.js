define('Controls/Input/RichEditor/Toolbar/Button/EditLink', [
   'Core/Control',
   'wml!Controls/Input/RichEditor/Toolbar/Button/EditLink/EditLink'
], function(Control, template) {
   /**
    * Component Toolbar/Button/EditLink
    * Button for inserting link into rich editor
    * @class Controls/Input/RichEditor/Toolbar/Button/EditLink
    * @extends Core/Control
    * @control
    * @author Волоцкой В.Д.
    */

   var _private = {

      /**
       * Function open dialog for edit link
       * @param self
       * @param event
       */
      openEditDialog: function(self, event) {
         var
            caption = self._currentSelection.getContent({ format: 'text' }) || '',
            link = self._currentSelection.getNode()
               .getAttribute('href') || '';


         self._children.opener.open({
            target: event.currentTarget,
            closeByExternalClick: true,
            template: 'Controls/Input/RichEditor/Toolbar/Button/EditLink/Dialog',
            templateOptions: {
               link: link,
               caption: caption
            },
            corner: {
               vertical: 'bottom',
               horizontal: 'right'
            },
            horizontalAlign: 'left',
            eventHandlers: {
               onResult: function(link, caption) {
                  self._notify('_insertLink', [link, caption], { bubbling: true });
               }
            }
         });
      }
   };

   return Control.extend({
      _template: template,
      _currentSelection: null,

      _afterMount: function() {
         this._notify('register', ['selectionChanged', this, this._selectionChangedHandler], { bubbling: true });
      },

      _beforeUnmount: function() {
         this._notify('unregister', ['selectionChanged', this]);
      },

      _selectionChangedHandler: function(selection) {
         this._currentSelection = selection;
      },

      _clickHandler: function(event) {
         _private.openEditDialog(this, event);
      }
   });
});
