import cExtend = require('Core/core-simpleExtend');
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');

/**
 * @class Controls/_operations/MultiSelector/Selection
 * @extends Core/core-simpleExtend
 * @author Авраменко А.С.
 * @private
 */

/**
 * @name Controls/_operations/MultiSelector/Selection#selectedKeys
 * @cfg {Array} Array of selected items' keys.
 * @variant [null] Everything selected.
 * @variant [] Nothing selected.
 */

/**
 * @name Controls/_operations/MultiSelector/Selection#excludedKeys
 * @cfg {Array} Array of keys for items that should be excluded from the selection.
 */

/**
 * @name Controls/_operations/MultiSelector/Selection#keyProperty
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
   _limit: 0,

   constructor: function(options) {
      this._options = options;
      this._selectedKeys = options.selectedKeys;
      this._excludedKeys = options.excludedKeys;

      this._items = options.items;

      Selection.superclass.constructor.apply(this, arguments);
   },

   /**
    * Add keys to selection.
    * @param {Array} keys Keys to add to selection.
    */
   select: function(keys) {
      this._selectedKeys = this._selectedKeys.slice();
      this._excludedKeys = this._excludedKeys.slice();
      if (this._limit && keys.length === 1 && !this._excludedKeys.includes(keys[0])) {
         this._increaseLimit(keys);
      }
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
    * Delete keys from anywhere.
    * @param {Array} keys Keys to remove.
    */
   remove: function(keys) {
      this._selectedKeys = this._selectedKeys.slice();
      this._excludedKeys = this._excludedKeys.slice();

      ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, keys);
      ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, keys);
   },

   /**
    * Select all items.
    * @remark Sets selectedKeys to [null].
    */
   selectAll: function() {
      this._selectedKeys = ALLSELECTION_VALUE;

      // При выборе "Отметить все" лимит не передается, а предыдущий установленный сбрасывается раньше вызова selectAll,
      // в этом случае массив с исключениями всегда будут очищаться.
      if (!this._limit) {
         this._excludedKeys = [];
      }
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
         swap = this._excludedKeys;
         this.unselectAll();
         this.select(swap);
      } else {
         swap = this._selectedKeys;
         this.selectAll();
         this.unselect(swap);
      }
   },

   /**
    * Sets limit.
    * @param {Number} value
    */
   setLimit: function(value: Number): void {
      this._limit = value;
   },

   /**
    * Increases the limit on the number of selected items, placing all other unselected in excluded list
    * Увеличивает лимит на количество выбранных записей, все предыдущие невыбранные записи при этом попадают в исключение
    * @param {Array} keys
    * @private
    */
   _increaseLimit: function(keys: any[]): void {
      const self = this;
      const limit = self._limit ? self._limit - this._excludedKeys.length : 0;
      let count = 0;
      const slicedKeys: any[] = keys.slice();
      this._items.forEach((item) => {
         const status = self._getSelectionStatus(item);
         const key = item.get(self._options.keyProperty);
         if (status !== false && count < limit) {
            count++;
         } else if (count >= limit && slicedKeys.length) {
            count++;
            self._limit++;
            if (slicedKeys.includes(key)) {
               slicedKeys.splice(slicedKeys.indexOf(key), 1)
            } else {
               self._excludedKeys.push(key);
            }
         }
      });
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
    * @param {Types/collection:RecordSet} items
    */
   setItems: function(items) {
      this._items = items;
   },

   /**
    * Returns the number of selected items.
    * @returns {number}
    */
   getCount: function() {
      let itemsCount = null;

      if (this._isAllSelection(this._getParams())) {
         if (this._limit) {
            itemsCount = this._limit - this._excludedKeys.length;
         }
         if (this._isAllItemsLoaded() && (!this._limit || this._items.getCount() <= this._limit)) {
            itemsCount = this._items.getCount() - this._excludedKeys.length;
         }
      } else {
         itemsCount = this._selectedKeys.length;
      }

      return itemsCount;
   },

   /**
    * Transforms selection to single array of selectedKeys and returns it. Used for rendering checkboxes in lists.
    * @returns {Object}
    */
   getSelectedKeysForRender: function() {
      const res = {};
      const self = this;
      const limit = self._limit ? self._limit - this._excludedKeys.length : 0;
      let status;
      let count = 0;

      this._items.forEach((item) => {
         status = self._getSelectionStatus(item);
         if (status !== false && (!limit || count < limit)) {
            count++;
            res[item.get(self._options.keyProperty)] = status;
         }
      });

      return res;
   },

   setListModel: function(listModel) {
      this._options.listModel = listModel;
   },


   _getSelectionStatus: function(item) {
      var itemId = item.get(this._options.keyProperty);
      return this._selectedKeys[0] === null && this._excludedKeys.indexOf(itemId) === -1 || this._selectedKeys.indexOf(itemId) !== -1;
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
   },

   _isAllItemsLoaded: function() {
      let
         itemsCount = this._items.getCount(),
         more = this._items.getMetaData().more,
         hasMore = typeof more === 'number' ? more > itemsCount : more;

      return !hasMore || (this._limit && itemsCount >= this._limit);
   }
});

Selection.SELECTION_STATUS = SELECTION_STATUS;

export default Selection;
