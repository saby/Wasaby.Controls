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
         SELECTED: true,
         PARTIALLY_SELECTED: null
      };

   var _private = {
      isAllSelection: function(selectedKeys, excludedKeys, items, strategy) {
         if (strategy === 'allData') {
            return selectedKeys[0] === null || selectedKeys.length === items.getCount() && !excludedKeys.length;
         } else {
            return selectedKeys[0] === null;
         }
      },

      getCount: function(selectedKeys, excludedKeys, items, strategy) {
         if (strategy === 'allData') {
            return _private.isAllSelection(selectedKeys, excludedKeys, items, strategy) ? 'all' : selectedKeys.length;
         } else {
            if (_private.isAllSelection(selectedKeys, excludedKeys, items, strategy)) {
               if (excludedKeys.length) {
                  return 'part';
               } else {
                  return 'all';
               }
            } else {
               return selectedKeys.length;
            }
         }
      }
   };

   var Selection = cExtend.extend({
      _selectedKeys: null,
      _excludedKeys: null,
      _items: null,

      //allData - все данные подгружены, можем не угадывать при расчёте count и отрисовке чекбоксов. partialData - не все данные подгружены.
      _strategy: '',

      constructor: function(options) {
         this._selectedKeys = cClone(options.selectedKeys) || [];

         this._items = cClone(options.items);
         this._strategy = cClone(options.strategy);

         //excluded keys имеют смысл только когда выделено все, поэтому ситуацию, когда переданы оба массива считаем ошибочной //TODO возможно надо кинуть здесь исключение
         if (_private.isAllSelection(this._selectedKeys, this._excludedKeys, this._items, this._strategy)) {
            this._excludedKeys = cClone(options.excludedKeys) || [];
         } else {
            this._excludedKeys = [];
         }

         Selection.superclass.constructor.apply(this, arguments);
      },

      select: function(keys) {
         if (_private.isAllSelection(this._selectedKeys, this._excludedKeys, this._items, this._strategy)) {
            ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, keys);
         } else {
            ArraySimpleValuesUtil.addSubArray(this._selectedKeys, keys);
         }
      },

      unselect: function(keys) {
         if (_private.isAllSelection(this._selectedKeys, this._excludedKeys, this._items, this._strategy)) {
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
         if (_private.isAllSelection(this._selectedKeys, this._excludedKeys, this._items, this._strategy)) {
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

      //TODO: на самом деле не очень понятно где это должно быть. Вроде как в модели, но тогда как она будет чекать isAllSelection?
      //TODO: если прокидывать count и какое-то значение в духе selectedAll: true|false, то всё будет проще. Можно даже будет убрать кучу вызовов isAllSelection, т.к. можно будет считать его один раз: при изменениях выделения
      getSelectionStatus: function(key) {
         if (_private.isAllSelection(this._selectedKeys, this._excludedKeys, this._items, this._strategy)  && this._excludedKeys.indexOf(key) === -1) {
            return SELECTION_STATUS.SELECTED;
         } else if (this._selectedKeys.indexOf(key) !== -1) {
            return SELECTION_STATUS.SELECTED;
         } else {
            return SELECTION_STATUS.NOT_SELECTED;
         }
      },

      getCount: function() {
         return _private.getCount(this._selectedKeys, this._excludedKeys, this._items, this._strategy);
      }
   });

   Selection.SELECTION_STATUS = SELECTION_STATUS;

   return Selection;
});
