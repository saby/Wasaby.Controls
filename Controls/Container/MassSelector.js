define('Controls/Container/MassSelector', [
   'Core/Control',
   'tmpl!Controls/Container/MassSelector/MassSelector',
   'Controls/Container/MassSelector/SelectionContextField',
   'Controls/Container/MassSelector/CallbacksContextField',
   'Controls/Controllers/Multiselect/Selection'
], function(Control, template, SelectionContextField, CallbacksContextField, Selection) {
   'use strict';

   //TODO: нужно стопить события от List/MassSelector

   return Control.extend({
      _template: template,
      _multiselection: null,

      _beforeMount: function(newOptions) {
         this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
         this._updateSelectionContext = this._updateSelectionContext.bind(this);

         this._massSelectorCallbacks = new CallbacksContextField(this._itemsReadyCallback);

         //TODO: после избавления от itemsReadyCallback нужно будет переписать это место.
         this._selectionContext = new SelectionContextField(
            newOptions.selected,
            newOptions.excluded,
            0
         );
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

      _itemsReadyCallback: function(items) {
         if (this._multiselection) {
            this._multiselection.setItems(items);
         } else {
            this._multiselection = new Selection({
               selectedKeys: this._options.selectedKeys,
               excludedKeys: this._options.excludedKeys,
               items: items,
               strategy: this._options.strategy
            });
         }

         this._multiselection.select(this._options.selectedKeys || []);
         this._multiselection.unselect(this._options.excludedKeys || []);

         this._updateSelectionContext();
      },

      _updateSelectionContext: function() {
         var currentSelection = this._multiselection.getSelection();

         this._selectionContext = new SelectionContextField(
            currentSelection.selected,
            currentSelection.excluded,
            this._multiselection.getCount()
         );
         if (this._options.selectionChangeHandler) {
            this._options.selectionChangeHandler(currentSelection);
         }
         this._forceUpdate();
      },

      _getChildContext: function() {
         return {
            selection: this._selectionContext,
            massSelectorCallbacks: this._massSelectorCallbacks
         };
      }
   });
});
