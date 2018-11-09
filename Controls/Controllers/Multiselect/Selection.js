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

   /**
    * @class Controls/Controllers/Multiselect/Selection
    * @extends Core/core-simpleExtend
    * @author Зайцев А.С.
    * @private
    */

   /**
    * @name Controls/Controllers/Multiselect/Selection#selectedKeys
    * @cfg {Array} Array of selected items' keys.
    * @variant [null] Everything selected.
    * @variant [] Nothing selected.
    */

   /**
    * @name Controls/Controllers/Multiselect/Selection#excludedKeys
    * @cfg {Array} Array of keys for items that should be excluded from the selection.
    */

   /**
    * @name Controls/Controllers/Multiselect/Selection#keyProperty
    * @cfg {String|Number} Name of the item property that uniquely identifies collection item.
    */

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
         this._options = options;
         this._selectedKeys = cClone(options.selectedKeys);
         this._excludedKeys = cClone(options.excludedKeys);

         this._items = cClone(options.items);

         Selection.superclass.constructor.apply(this, arguments);
      },

      /**
       * Add keys to selection.
       * @param {Array} keys Keys to add to selection.
       */
      select: function(keys) {
         this._selectedKeys = this._selectedKeys.slice();
         this._excludedKeys = this._excludedKeys.slice();

         if (this._isAllSelection(this._getParams())) {
            ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, keys);
         } else {
            ArraySimpleValuesUtil.addSubArray(this._selectedKeys, keys);
         }
      },

      /**
       * Remove keys from selection.
       * @param {Array} keys Keys to remove from selection.
       */
      unselect: function(keys) {
         this._selectedKeys = this._selectedKeys.slice();
         this._excludedKeys = this._excludedKeys.slice();

         if (this._isAllSelection(this._getParams())) {
            ArraySimpleValuesUtil.addSubArray(this._excludedKeys, keys);
         } else {
            ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, keys);
         }
      },

      /**
       * Select all items.
       * @remark Sets selectedKeys to [null].
       */
      selectAll: function() {
         this._selectedKeys = ALLSELECTION_VALUE;
         this._excludedKeys = [];
      },

      /**
       * Remove selection from all items.
       */
      unselectAll: function() {
         this._selectedKeys = [];
         this._excludedKeys = [];
      },

      /**
       * Invert selection.
       */
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

      /**
       * Returns selection.
       * @returns {{selected: Array, excluded: Array}}
       */
      getSelection: function() {
         return {
            selected: this._selectedKeys,
            excluded: this._excludedKeys
         };
      },

      /**
       * Set items which will be used to calculate selectedKeys for render.
       * @param {WS.Data/Collection/RecordSet} items
       */
      setItems: function(items) {
         this._items = cClone(items);
      },

      /**
       * Returns the number of selected items.
       * @returns {number}
       */
      getCount: function() {
         if (this._isAllSelection({
            selectedKeys: this._selectedKeys,
            excludedKeys: this._excludedKeys,
            items: this._items
         })) {
            return this._items.getCount() - this._excludedKeys.length;
         }
         return this._selectedKeys.length;
      },

      /**
       * Transforms selection to single array of selectedKeys and returns it. Used for rendering checkboxes in lists.
       * @returns {Array}
       */
      getSelectedKeysForRender: function() {
         var
            res = [],
            self = this,
            itemId;

         this._items.forEach(function(item) {
            itemId = item.get(self._options.keyProperty);
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
