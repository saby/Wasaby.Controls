/* global define */
define('Controls/Controllers/Multiselect/Selection', [
   'Core/core-simpleExtend',
   'Core/core-clone',
   'Controls/Utils/ArraySimpleValuesUtil'
], function (
   cExtend,
   cClone,
   ArraySimpleValuesUtil
) {
   'use strict';

   var ALLSELECTION_VALUE = [null];

   var _private = {
      isAllSelection: function(selectedKeys) {
         return !!selectedKeys && !!selectedKeys.length && selectedKeys[0] === null;
      }
   };

   var Selection = cExtend.extend(/** @lends SBIS3.CONTROLS/ListView/resources/MassSelectionController/resources/Selection */{
      _selectedKeys: null,
      _excludedKeys: null,

      constructor: function(options) {
         this._options = options;
         this._selectedKeys = options.selectedKeys || [];

         //excluded keys имеют смысл только когда выделено все, поэтому ситуацию, когда переданы оба массива считаем ошибочной //TODO возможно надо кинуть здесь исключение
         if (_private.isAllSelection(this._selectedKeys)) {
            this._excludedKeys = options.excludedKeys || [];
         }
         else {
            this._excludedKeys = [];
         }

         Selection.superclass.constructor.apply(this, arguments);
      },

      select: function(keys) {
         if (_private.isAllSelection(this._selectedKeys)) {
            ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, keys);
         }
         else {
            ArraySimpleValuesUtil.addSubArray(this._selectedKeys, keys);
         }
      },

      unselect: function(keys) {
         if (_private.isAllSelection(this._selectedKeys)) {
            ArraySimpleValuesUtil.addSubArray(this._excludedKeys, keys);
         }
         else {
            ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, keys);
         }
      },

      selectAll: function() {
         this._options.selectedKeys = ALLSELECTION_VALUE;
         this._options.excludedKeys = [];
      },

      unselectAll: function() {
         this._options.selectedKeys = [];
         this._options.excludedKeys = [];
      },

      toggleAll: function() {
         var marked, excluded;
         if (this._options.markedAll) {
            excluded = cClone(this._options.excludedKeys);
            this.unselectAll();
            this.select(excluded);
         } else {
            marked = cClone(this._options.selectedKeys);
            this.selectAll();
            this.unselect(marked);
         }
      },

      setProjection: function(projection) {
         this._options.projection = projection;
         this._idProperty = projection.getIdProperty();
      },

      getSelection: function() {
         return {
            marked: this._options.markedAll ? [] : this._options.selectedKeys,
            excluded: this._options.markedAll ? this._options.excludedKeys : [],
            markedAll: this._options.markedAll
         }
      },

      _getAllKeys: function() {
         var
            id,
            contents,
            keys = [];

         this._options.projection.each(function(item) {
            contents = item.getContents();
            //instanceOfModule тяжолая проверка, проверяем на наличие .get
            if (contents.get) {
               id = contents.get(this._idProperty);
               if (!ArraySimpleValuesUtil.hasInArray(keys, id)) {
                  keys.push(item.getContents().get(this._idProperty));
               }
            }
         }, this);

         return keys;
      },

      destroy: function() {
         this._options = null;
      }
   });

   //для тестов
   Selection._private = _private;

   return Selection;
});
