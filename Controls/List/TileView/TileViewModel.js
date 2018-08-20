define('Controls/List/TileView/TileViewModel', [
   'Controls/List/ListViewModel'
], function(ListViewModel) {

   'use strict';

   var TileViewModel = ListViewModel.extend({
      constructor: function() {
         TileViewModel.superclass.constructor.apply(this, arguments);
         this._tileMode = this._options.tileMode;
         this._itemsHeight = this._options.itemsHeight;
      },

      getCurrent: function() {
         var current = TileViewModel.superclass.getCurrent.apply(this, arguments);
         current.tileMode = this._tileMode;
         current.itemsHeight = this._itemsHeight;
         current.imageProperty = this._options.imageProperty;

         return current;
      },

      setTileMode: function(tileMode) {
         this._tileMode = tileMode;
         this._nextVersion();
         this._notify('onListChange');
      },

      getTileMode: function() {
         return this._tileMode;
      },

      setItemsHeight: function(itemsHeight) {
         this._itemsHeight = itemsHeight;
         this._nextVersion();
         this._notify('onListChange');
      },

      getItemsHeight: function() {
         return this._itemsHeight;
      },

      setHoveredItem: function(hoveredItem) {
         if (this._hoveredItem !== hoveredItem) {
            this._hoveredItem = hoveredItem;
            this._nextVersion();
            this._notify('onListChange');
         }
      },

      setActiveItem: function(activeItem) {
         if (!activeItem) {
            this.setHoveredItem(null);
         }
         TileViewModel.superclass.setActiveItem.apply(this, arguments);
      },

      getHoveredItem: function() {
         return this._hoveredItem;
      }
   });

   return TileViewModel;
});
