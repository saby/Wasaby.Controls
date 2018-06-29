/* global define */
define('SBIS3.CONTROLS/ListView/resources/MassSelectionController/resources/Selection', [
   'Core/Abstract',
   'Core/core-clone',
   'Controls/Utils/ArraySimpleValuesUtil'
], function (
   Abstract,
   cClone,
   ArraySimpleValuesUtil
) {
   'use strict';

   var ALLSELECTION_VALUE = [null];

   var Selection = Abstract.extend(/** @lends SBIS3.CONTROLS/ListView/resources/MassSelectionController/resources/Selection */{
      _idProperty: undefined,

      constructor: function(options) {
         this._options = options;
         this._options.selectedKeys = options.selectedKeys || [];
         this._options.excludedKeys = options.excludedKeys || [];
         Selection.superclass.constructor.apply(this, arguments);
      },

      select: function(keys) {
         ArraySimpleValuesUtil.addSubArray(this._options.selectedKeys, keys);
         ArraySimpleValuesUtil.removeSubArray(this._options.excludedKeys, keys);
      },

      unselect: function(keys) {
         ArraySimpleValuesUtil.removeSubArray(this._options.selectedKeys, keys);
         if (this._options.markedAll) {
            ArraySimpleValuesUtil.addSubArray(this._options.excludedKeys, keys);
         }
      },

      selectAll: function() {
         this._options.selectedKeys = this._getAllKeys();
         this._options.markedAll = true;
         this._options.excludedKeys = [];
      },

      unselectAll: function() {
         this._options.selectedKeys = [];
         this._options.markedAll = false;
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
            marked: this._options.markedAll ? ALLSELECTION_VALUE : this._options.selectedKeys,
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
      }
   });

   Selection.ALLSELECTION_VALUE = ALLSELECTION_VALUE;

   return Selection;
});
