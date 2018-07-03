/* global define */
define('Controls/Controllers/Multiselect/Selection', [
   'Core/core-simpleExtend',
   'Core/core-clone',
   'Controls/Utils/ArraySimpleValuesUtil',

   //TODO: подгружать асинхронно
   'Controls/Controllers/Multiselect/Strategy/Simple/Base'
], function(
   cExtend,
   cClone,
   ArraySimpleValuesUtil,
   BaseStrategy
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

      //allData - все данные подгружены, можем не угадывать при расчёте count и отрисовке чекбоксов. partialData - не все данные подгружены.
      _strategy: '',

      constructor: function(options) {
         this._selectedKeys = cClone(options.selectedKeys);
         this._excludedKeys = cClone(options.excludedKeys);

         //TODO: нужно кидать исключение, если нет items
         this._items = cClone(options.items);

         //Для плоского списка стратегии allData и partialData не различаются ничем
         this._strategy = new BaseStrategy(options);

         //excluded keys имеют смысл только когда выделено все, поэтому ситуацию, когда переданы оба массива считаем ошибочной
         if (options.excludedKeys.length && !this._strategy.isAllSelection(this._getParams())) {
            //TODO возможно надо кинуть здесь исключение
         }

         Selection.superclass.constructor.apply(this, arguments);
      },

      select: function(keys) {
         this._selectedKeys = this._selectedKeys.slice();
         this._excludedKeys = this._excludedKeys.slice();

         if (this._strategy.isAllSelection(this._getParams())) {
            ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, keys);
         } else {
            ArraySimpleValuesUtil.addSubArray(this._selectedKeys, keys);
         }
      },

      unselect: function(keys) {
         this._selectedKeys = this._selectedKeys.slice();
         this._excludedKeys = this._excludedKeys.slice();

         if (this._strategy.isAllSelection(this._getParams())) {
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

         if (this._strategy.isAllSelection(this._getParams())) {
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

      getSelectionStatus: function(key) {
         if (this._excludedKeys.indexOf(key) === -1 && this._strategy.isAllSelection(this._getParams())) {
            return SELECTION_STATUS.SELECTED;
         } else if (this._selectedKeys.indexOf(key) !== -1) {
            return SELECTION_STATUS.SELECTED;
         } else {
            return SELECTION_STATUS.NOT_SELECTED;
         }
      },

      getCount: function() {
         return this._strategy.getCount(this._selectedKeys, this._excludedKeys, this._items);
      },

      _getParams: function() {
         return {
            selectedKeys: this._selectedKeys,
            excludedKeys: this._excludedKeys,
            items: this._items
         };
      }
   });

   Selection.SELECTION_STATUS = SELECTION_STATUS;

   return Selection;
});
