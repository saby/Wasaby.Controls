define('Controls/Container/MassSelector', [
   'Core/Control',
   'tmpl!Controls/Container/MassSelector/MassSelector',
   'Controls/Container/MassSelector/SelectionContextField',
   'Controls/Controllers/Multiselect/Selection'
], function(Control, template, SelectionContextField, Selection) {
   'use strict';

   //TODO: нужно стопить события от List/MassSelector

   return Control.extend({
      _template: template,
      _multiselection: null,

      _beforeMount: function(newOptions) {
         this._updateSelectionContext = this._updateSelectionContext.bind(this);

         //TODO: надо таки положить items
         this._multiselection = new Selection({
            selectedKeys: newOptions.selectedKeys,
            excludedKeys: newOptions.excludedKeys,
            items: newOptions.items,
            strategy: newOptions.strategy
         });

         this._multiselection.select(newOptions.selectedKeys || []);
         this._multiselection.unselect(newOptions.excludedKeys || []);

         this._updateSelectionContext();
      },

      //TODO: вроде можно удалить, т.к. используется только в Петиной демке ПМО. А там можно решить всё через selectionChangeHandler
      //TODO: и надо selectionChangeHandler переделать на событие, если получится сделать так, чтобы оно в _beforeMount не стреляло
      getSelection: function() {
         return this._multiselection.getSelection();
      },

      _onCheckBoxClickHandler: function(event, key, status) {
         if (!!status) {
            this._multiselection.unselect([key]);
         } else {
            this._multiselection.select([key]);
         }

         this._updateSelectionContext();
      },

      _selectedTypeChangedHandler: function(event, typeName) {
         this._multiselection[typeName]();

         this._updateSelectionContext();
      },

      _afterItemsRemoveHandler: function(event, keys) {
         this._multiselection.unselect(keys);

         this._updateSelectionContext();
      },

      _updateSelectionContext: function() {
         var currentSelection = this._multiselection.getSelection();

         this._selectionContext = new SelectionContextField(
            currentSelection.selected,
            currentSelection.excluded,
            this._multiselection.getCount()
         );

         //TODO: в _beforeMount тут нет this._options
         if (this._options.selectionChangeHandler) {
            this._options.selectionChangeHandler(currentSelection);
         }
         this._forceUpdate();
      },

      _getChildContext: function() {
         return {
            selection: this._selectionContext
         };
      }
   });
});
