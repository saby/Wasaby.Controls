define('Controls/List/MassSelector', [
   'Core/Control',
   'tmpl!Controls/List/MassSelector/MassSelector',
   'Controls/Container/MassSelector/SelectionContextField',
   'Controls/Container/MassSelector/CallbacksContextField'
], function(Control, template, SelectionContextField, CallbacksContextField) {
   'use strict';

   var MassSelector = Control.extend({
      _template: template,

      _beforeMount: function() {
         this._itemsReadyCallback = this._itemsReady.bind(this);
         this._selectionCallback = this._selectionCallback.bind(this);
      },

      _onCheckBoxClickHandler: function(event, key, status) {
         this._notify('listCheckBoxClick', [key, status], {
            bubbling: true
         });
      },

      _onAfterItemsRemoveHandler: function(event, keys) {
         this._notify('listAfterItemsRemove', [keys], {
            bubbling: true
         });
      },

      _itemsReady: function(items) {
         //TODO: надо уточнить у Зуева почему тут _contextObj, а не _context. В доке написано _context.
         this._contextObj.massSelectorCallbacks.itemsReadyCallback(items);
      },

      _selectionCallback: function(SelectionConstructor) {
         this._contextObj.massSelectorCallbacks.selectionCallback(SelectionConstructor);
      }
   });

   MassSelector.contextTypes = function contextTypes() {
      return {
         selection: SelectionContextField,
         massSelectorCallbacks: CallbacksContextField
      };
   };

   return MassSelector;
});
