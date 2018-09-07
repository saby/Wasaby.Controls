define('Controls/Container/MultiSelector', [
   'Core/Control',
   'wml!Controls/Container/MultiSelector/MultiSelector',
   'Controls/Container/MultiSelector/SelectionContextField',
   'Controls/Controllers/Multiselect/Selection',
   'Controls/Container/Data/ContextOptions',
   'Controls/Utils/ArraySimpleValuesUtil',
   'WS.Data/Collection/IBind'
], function(
   Control,
   template,
   SelectionContextField,
   Selection,
   DataContext,
   ArraySimpleValuesUtil,
   IBind
) {
   'use strict';

   var _private = {
      notifyAndUpdateContext: function(self, oldSelection) {
         var
            newSelection = self._multiselection.getSelection(),
            selectedKeysDiff = ArraySimpleValuesUtil.getArrayDifference(oldSelection.selected, newSelection.selected),
            excludedKeysDiff = ArraySimpleValuesUtil.getArrayDifference(oldSelection.excluded, newSelection.excluded);

         if (selectedKeysDiff.added.length || selectedKeysDiff.removed.length) {
            self._notify('selectedKeysChanged', [newSelection.selected, selectedKeysDiff.added, selectedKeysDiff.removed]);
         }

         if (excludedKeysDiff.added.length || excludedKeysDiff.removed.length) {
            self._notify('excludedKeysChanged', [newSelection.excluded, excludedKeysDiff.added, excludedKeysDiff.removed]);
         }

         self._updateSelectionContext();
      },

      getItemsKeys: function(items) {
         var keys = [];
         items.forEach(function(item) {
            keys.push(item.getId());
         });
         return keys;
      }
   };

   /**
    * Container for content that can work with multiselection.
    * Puts selection in child context.
    *
    * @class Controls/Container/MultiSelector
    * @extends Core/Control
    * @mixes Controls/interface/IPromisedSelectable
    * @control
    * @author Зайцев А.С.
    * @public
    */

   var MultiSelector = Control.extend(/** @lends Controls/Container/MultiSelector.prototype */{
      _template: template,
      _multiselection: null,
      _items: null,

      _beforeMount: function(newOptions, context) {
         this._items = context.dataOptions.items;
         this._createMultiselection(newOptions, context);
         this._updateSelectionContext();
      },

      _afterMount: function() {
         this._items.subscribe('onCollectionChange', this._onCollectionChange.bind(this));
      },

      _beforeUpdate: function(newOptions, context) {
         if (this._items !== context.dataOptions.items) {
            this._items = context.dataOptions.items;
            this._multiselection.setItems(context.dataOptions.items);
            this._updateSelectionContext();
            this._items.subscribe('onCollectionChange', this._onCollectionChange.bind(this));
         }

         if (newOptions.selectedKeys !== this._options.selectedKeys || newOptions.excludedKeys !== this._options.excludedKeys) {
            this._multiselection.unselectAll();
            this._multiselection.select(newOptions.selectedKeys);
            this._multiselection.unselect(newOptions.excludedKeys);
            this._updateSelectionContext();
         }
      },

      getSelection: function() {
         return this._multiselection.getSelection();
      },

      _onListSelectionChange: function(event, keys, added, removed) {
         var oldSelection = this._multiselection.getSelection();

         this._multiselection.unselect(removed);
         this._multiselection.select(added);

         _private.notifyAndUpdateContext(this, oldSelection);
      },

      _selectedTypeChangedHandler: function(event, typeName) {
         var oldSelection = this._multiselection.getSelection();

         this._multiselection[typeName]();

         _private.notifyAndUpdateContext(this, oldSelection);
      },

      _updateSelectionContext: function() {
         var currentSelection = this._multiselection.getSelection();

         this._selectionContext = new SelectionContextField(
            currentSelection.selected,
            currentSelection.excluded,
            this._multiselection.getSelectedKeysForRender(),
            this._multiselection.getCount()
         );

         this._forceUpdate();
      },

      _createMultiselection: function(options, context) {
         this._multiselection = new Selection({
            selectedKeys: options.selectedKeys,
            excludedKeys: options.excludedKeys,
            items: context.dataOptions.items
         });
      },

      _getChildContext: function() {
         return {
            selection: this._selectionContext
         };
      },

      _onCollectionChange: function(event, action, newItems, newItemsIndex, removedItems) {
         var oldSelection = this._multiselection.getSelection();

         if (action === IBind.ACTION_REMOVE) {
            this._multiselection.unselect(_private.getItemsKeys(removedItems));
         }

         _private.notifyAndUpdateContext(this, oldSelection);
      }
   });

   MultiSelector.contextTypes = function() {
      return {
         dataOptions: DataContext
      };
   };

   MultiSelector.getDefaultOptions = function() {
      return {
         selectedKeys: [],
         excludedKeys: []
      };
   };

   return MultiSelector;
});
