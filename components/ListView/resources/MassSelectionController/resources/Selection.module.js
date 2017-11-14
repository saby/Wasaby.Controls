/* global define */
define('js!SBIS3.CONTROLS.Selection', [
   'Core/Abstract',
   'Core/core-clone',
   'js!SBIS3.CONTROLS.ArraySimpleValuesUtil'
], function (
   Abstract,
   cClone,
   ArraySimpleValuesUtil
) {
   'use strict';

   var Selection = Abstract.extend(/** @lends SBIS3.CONTROLS.Selection */{
      _idProperty: undefined,

      constructor: function(options) {
         this._options = options;
         this._options.selectedKeys = options.selectedKeys || [];
         this._options.excludedKeys = options.excludedKeys || [];
         this._idProperty = options.projection.getIdProperty();
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
      },

      getSelection: function() {
         return {
            marked: this._options.markedAll ? [] : this._options.selectedKeys,
            excluded: this._options.markedAll ? this._options.excludedKeys : []
         }
      },

      _getAllKeys: function() {
         var
            id,
            keys = [];

         this._options.projection.each(function(item) {
            id = item.getContents().get(this._idProperty);
            if (!ArraySimpleValuesUtil.hasInArray(keys, id)) {
               keys.push(item.getContents().get(this._idProperty));
            }
         }, this);

         return keys;
      }
   });

   return Selection;
});
