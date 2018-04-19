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

   var ALLSELECTION_VALUE = [null],
      SELECTION_STATUS = {
         NOT_SELECTED: 0,
         SELECTED: 1
      };

   var _private = {
      isAllSelection: function(selectedKeys) {
         return !!selectedKeys && !!selectedKeys.length && selectedKeys[0] === null;
      }
   };

   var Selection = cExtend.extend({
      _selectedKeys: null,
      _excludedKeys: null,

      constructor: function(options) {
         this._options = options;
         this._selectedKeys = options.selectedKeys || [];
         this._excludedKeys = options.excludedKeys || [];

         //excluded keys имеют смысл только когда выделено все, поэтому ситуацию, когда переданы оба массива считаем ошибочной //TODO возможно надо кинуть здесь исключение
         if (_private.isAllSelection(this._selectedKeys)) {
            this._excludedKeys = options.excludedKeys || [];
         } else {
            this._excludedKeys = [];
         }

         Selection.superclass.constructor.apply(this, arguments);
      },

      select: function(keys) {
         if (_private.isAllSelection(this._selectedKeys)) {
            ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, keys);
         } else {
            ArraySimpleValuesUtil.addSubArray(this._selectedKeys, keys);
         }
      },

      unselect: function(keys) {
         if (_private.isAllSelection(this._selectedKeys)) {
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
         if (_private.isAllSelection(this._selectedKeys)) {
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

      getSelectionStatus: function(id) {
         var status = SELECTION_STATUS.NOT_SELECTED;
         if (_private.isAllSelection(this._selectedKeys)) {
            if (ArraySimpleValuesUtil.invertTypeIndexOf(this._excludedKeys, id) === -1) {
               status = SELECTION_STATUS.SELECTED;
            }
         } else {
            if (ArraySimpleValuesUtil.invertTypeIndexOf(this._selectedKeys, id) > -1) {
               status = SELECTION_STATUS.SELECTED;
            }
         }
         return status;
      },

      destroy: function() {
         this._options = null;
      }
   });

   //для тестов
   Selection._private = _private;

   return Selection;
});
