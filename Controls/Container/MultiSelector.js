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
         var self = this;
         this._items = context.dataOptions.items;
         this._createMultiselection(newOptions, context);
         this._updateSelectionContext();
         this._items.subscribe('onCollectionChange', function() {
            self._updateSelectionContext();
         });
      },

      _beforeUpdate: function(newOptions, context) {
         var self = this;
         if (this._items !== context.dataOptions.items) {
            this._items = context.dataOptions.items;
            this._multiselection.setItems(context.dataOptions.items);
            this._updateSelectionContext();
            this._items.subscribe('onCollectionChange', function() {
               self._updateSelectionContext();
            });
         }
      },

      getSelection: function() {
         return this._multiselection.getSelection();
      },

      _onListSelectionChange: function(event, keys, added, removed) {
         this._multiselection.unselect(removed);
         this._multiselection.select(added);

         this._updateSelectionContext();
      },

      _selectedTypeChangedHandler: function(event, typeName) {
         this._multiselection[typeName]();

         this._updateSelectionContext();
      },

      _updateSelectionContext: function() {
         var currentSelection = this._multiselection.getSelection();

         this._selectionContext = new SelectionContextField(
            currentSelection.selected,
            currentSelection.excluded,
            this._multiselection.getSelectedKeysForRender(),
            this._multiselection.getCount()
         );

         if (this._options.selectionChangeHandler) {
            this._options.selectionChangeHandler(currentSelection);
         }
         this._forceUpdate();
      },

      _createMultiselection: function(options, context) {
         this._multiselection = new Selection({
            selectedKeys: options.selectedKeys || [],
            excludedKeys: options.excludedKeys || [],
            items: context.dataOptions.items
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
