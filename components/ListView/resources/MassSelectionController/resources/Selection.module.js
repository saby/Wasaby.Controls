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
         this._options.marked = options.marked || [];
         this._options.excluded = options.excluded || [];
         this._idProperty = options.projection.getIdProperty();
         Selection.superclass.constructor.apply(this, arguments);
      },

      add: function(keys) {
         ArraySimpleValuesUtil.addSubArray(this._options.marked, keys);
         ArraySimpleValuesUtil.removeSubArray(this._options.excluded, keys);
      },

      remove: function(keys) {
         ArraySimpleValuesUtil.removeSubArray(this._options.marked, keys);
         if (this._options.markedAll) {
            ArraySimpleValuesUtil.addSubArray(this._options.excluded, keys);
         }
      },

      toggle: function(keys) {
         keys.forEach(function(key) {
            this[ArraySimpleValuesUtil.hasInArray(this._options.marked, key) ? 'remove' : 'add']([key]);
         }, this);
      },

      addAll: function() {
         this._options.marked = this._getAllKeys();
         this._options.markedAll = true;
         this._options.excluded = [];
      },

      removeAll: function() {
         this._options.marked = [];
         this._options.markedAll = false;
         this._options.excluded = [];
      },

      toggleAll: function() {
         var marked, excluded;
         if (this._options.markedAll) {
            excluded = cClone(this._options.excluded);
            this.removeAll();
            this.add(excluded);
         } else {
            marked = cClone(this._options.marked);
            this.addAll();
            this.remove(marked);
         }
      },

      setProjection: function(projection) {
         this._options.projection = projection;
      },

      getSelection: function() {
         return {
            marked: this._options.markedAll ? [] : this._options.marked,
            excluded: this._options.markedAll ? this._options.excluded : [],
            isMarkedAll: this._options.markedAll
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
