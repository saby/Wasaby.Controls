define('Controls/Container/MultiSelector', [
   'Core/Control',
   'tmpl!Controls/Container/MultiSelector/MultiSelector',
   'Controls/Container/MultiSelector/SelectionContextField',
   'Controls/Controllers/Multiselect/Selection',
   'Controls/Container/Data/ContextOptions'
], function(
   Control,
   template,
   SelectionContextField,
   Selection,
   DataContext
) {
   'use strict';

   var MultiSelector = Control.extend({
      _template: template,
      _multiselection: null,
      _items: null,

      _beforeMount: function(newOptions, context) {
         this._items = context.dataOptions.items;
         this._createMultiselection(newOptions, context);
         this._updateSelectionContext();
      },

      _beforeUpdate: function(newOptions, context) {
         if (this._items !== context.dataOptions.items) {
            this._items = context.dataOptions.items;
            this._multiselection.setItems(context.dataOptions.items);
         }
      },

      getSelection: function() {
         return this._multiselection.getSelection();
      },

      _onCheckBoxClickHandler: function(event, key, status) {
         if (status === true || status === null) {
            this._multiselection.unselect([key]);
         } else {
            this._multiselection.select([key]);
         }
         this._notify('selectionChange', [this._multiselection.getSelection()]);

         this._updateSelectionContext();
      },

      _selectedTypeChangedHandler: function(event, typeName) {
         this._multiselection[typeName]();
         this._notify('selectionChange', [this._multiselection.getSelection()]);

         this._updateSelectionContext();
      },

      _afterItemsRemoveHandler: function(event, keys) {
         this._multiselection.unselect(keys);
         this._notify('selectionChange', [this._multiselection.getSelection()]);

         this._updateSelectionContext();
      },

      _updateSelectionContext: function() {
         var currentSelection = this._multiselection.getSelection();

         this._selectionContext = new SelectionContextField(
            currentSelection.selected,
            currentSelection.excluded,
            this._multiselection.getCount(),
            this._multiselection
         );

         this._forceUpdate();
      },

      _createMultiselection: function(options, context) {
         this._multiselection = new Selection({
            selectedKeys: options.selectedKeys || [],
            excludedKeys: options.excludedKeys || [],
            items: context.dataOptions.items,
            strategy: options.strategy
         });
      },

      _getChildContext: function() {
         return {
            selection: this._selectionContext
         };
      }
   });

   MultiSelector.contextTypes = function() {
      return {
         dataOptions: DataContext
      };
   };

   return MultiSelector;
});
