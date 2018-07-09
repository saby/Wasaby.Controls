/* global define */
define('Controls/Controllers/Multiselect/Selection', [
   'Core/core-simpleExtend',
   'Core/core-clone',
   'Controls/Utils/ArraySimpleValuesUtil'
], function(
   cExtend,
   cClone,
   ArraySimpleValuesUtil
) {
   'use strict';

   var
      ALLSELECTION_VALUE = [null],
      SELECTION_STATUS = {
         NOT_SELECTED: false,
         SELECTED: true
      };

   var Selection = cExtend.extend({
      _selectedKeys: null,
      _excludedKeys: null,
      _items: null,

      constructor: function(options) {
         this._selectedKeys = cClone(options.selectedKeys);
         this._excludedKeys = cClone(options.excludedKeys);

         //TODO: нужно кидать исключение, если нет items
         this._items = cClone(options.items);

         //excluded keys имеют смысл только когда выделено все, поэтому ситуацию, когда переданы оба массива считаем ошибочной
         if (options.excludedKeys.length && !this._isAllSelection(this._getParams())) {
            //TODO возможно надо кинуть здесь исключение
         }

         Selection.superclass.constructor.apply(this, arguments);
      },

      select: function(keys) {
         this._selectedKeys = this._selectedKeys.slice();
         this._excludedKeys = this._excludedKeys.slice();

         if (this._isAllSelection(this._getParams())) {
            ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, keys);
         } else {
            ArraySimpleValuesUtil.addSubArray(this._selectedKeys, keys);
         }
      },

      unselect: function(keys) {
         this._selectedKeys = this._selectedKeys.slice();
         this._excludedKeys = this._excludedKeys.slice();

         if (this._isAllSelection(this._getParams())) {
            ArraySimpleValuesUtil.addSubArray(this._excludedKeys, keys);
         } else {
            ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, keys);
         }
      },

      selectAll: function() {
         this._selectedKeys = ALLSELECTION_VALUE;
         this._excludedKeys = [];
      },

      unselectAll: function() {
         this._selectedKeys = [];
         this._excludedKeys = [];
      },

      toggleAll: function() {
         var swap;

         if (this._isAllSelection(this._getParams())) {
            swap = cClone(this._excludedKeys);
            this.unselectAll();
            this.select(swap);
         } else {
            swap = cClone(this._selectedKeys);
            this.selectAll();
            this.unselect(swap);
         }
      },

      getSelection: function() {
         return {
            selected: this._selectedKeys,
            excluded: this._excludedKeys
         };
      },

      setItems: function(items) {
         this._items = cClone(items);
      },

      getCount: function() {
         if (this._isAllSelection({
            selectedKeys: this._selectedKeys,
            excludedKeys: this._excludedKeys,
            items: this._items
         })) {
            return this._items.getCount() - this._excludedKeys.length;
         } else {
            return this._selectedKeys.length;
         }
      },

      getSelectedKeysForRender: function() {
         var
            res = [],
            self = this,
            itemId;

         this._items.forEach(function(item) {
            itemId = item.getId();
            if (self._selectedKeys[0] === null && self._excludedKeys.indexOf(itemId) === -1 || self._selectedKeys.indexOf(itemId) !== -1) {
               res.push(itemId);
            }
         });

         return res;
      },

      _getParams: function() {
         return {
            selectedKeys: this._selectedKeys,
            excludedKeys: this._excludedKeys,
            items: this._items
         };
      },

      _isAllSelection: function(options) {
         var
            selectedKeys = options.selectedKeys;

         return selectedKeys[0] === null;
      }
   });

   Selection.SELECTION_STATUS = SELECTION_STATUS;

   return Selection;
});
