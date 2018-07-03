define('Controls/List/MassSelector', [
   'Core/Control',
   'tmpl!Controls/List/MassSelector/MassSelector',
   'Controls/Container/MassSelector/SelectionContextField',
   'Core/helpers/Object/isEqual'
], function(
   Control,
   template,
   SelectionContextField,
   isEqual
) {
   'use strict';

   var _private = {
      calculateCheckboxes: function(self) {
         self._calculatedSelectedKeys = [];
         self._calculatedExcludedKeys = [];
         self._calculatedPartiallySelectedKeys = [];
         self._items.forEach(function(item) {
            var status = self._selectionInstance.getSelectionStatus(item.getId());
            if (status === true) {
               self._calculatedSelectedKeys.push(item.getId());
            } else if (status === null) {
               self._calculatedPartiallySelectedKeys.push(item.getId());
            } else {
               self._calculatedExcludedKeys.push(item.getId());
            }
         });
      }
   };

   var MassSelector = Control.extend({
      _template: template,
      _selectedKeys: null,
      _partiallySelectedKeys: null,
      _excludedKeys: null,
      _items: null,
      _selectionInstance: null,
      _calculatedSelectedKeys: null,
      _calculatedExcludedKeys: null,
      _calculatedPartiallySelectedKeys: null,

      _beforeMount: function(newOptions, context) {
         this._selectedKeys = context.selection.selectedKeys;
         this._excludedKeys = context.selection.excludedKeys;
         this._items = context.selection.items;
         this._selectionInstance = context.selection.selectionInstance;
         _private.calculateCheckboxes(this);
      },

      _beforeUpdate: function(newOptions, context) {
         if (this._selectedKeys !== context.selection.selectedKeys || this._excludedKeys !== context.selection.excludedKeys || !isEqual(this._items, context.selection.items)) {
            this._selectedKeys = context.selection.selectedKeys;
            this._excludedKeys = context.selection.excludedKeys;
            this._items = context.selection.items;
            _private.calculateCheckboxes(this);
         }
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
      }
   });

   MassSelector.contextTypes = function contextTypes() {
      return {
         selection: SelectionContextField
      };
   };

   return MassSelector;
});
