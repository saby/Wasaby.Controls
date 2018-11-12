define('Controls/List/TreeTileView/TreeTileViewModel', [
   'Controls/List/TileView/TileViewModel',
   'Controls/List/Tree/TreeViewModel',
   'Core/core-merge'
], function(TileViewModel, TreeViewModel, cMerge) {

   'use strict';
   var DEFAULT_FOLDER_WIDTH = 250;

   var TreeTileViewModel = TreeViewModel.extend({
      constructor: function(cfg) {
         var self = this;
         TreeTileViewModel.superclass.constructor.apply(this, arguments);
         this._tileModel = new TileViewModel(cfg);
         this._tileModel.subscribe('onListChange', function() {
            self._nextVersion();
            self._notify('onListChange');
         });
      },

      getItemDataByItem: function(dispItem) {
         var
            prevItem,
            hoveredItem = this._tileModel.getHoveredItem(),
            current = TreeTileViewModel.superclass.getItemDataByItem.apply(this, arguments);

         prevItem = this._display.at(current.index - 1);
         if (prevItem) {
            current.hasSeparator = prevItem.isNode() && !current.dispItem.isNode();
         }

         if (hoveredItem && hoveredItem.key === current.key) {
            current.isHovered = true;
            if (hoveredItem.position) {
               current.isFixed = true;
               current.position = hoveredItem.position;
            }
            current.isAnimated = hoveredItem.isAnimated;
         }

         current = cMerge(current, this.getTileItemData());

         return current;
      },

      getTileItemData: function() {
         var opts = this._tileModel.getTileItemData();
         opts.defaultFolderWidth = DEFAULT_FOLDER_WIDTH;
         return opts;
      },

      setTileMode: function(tileMode) {
         this._tileModel.setTileMode(tileMode);
      },

      getTileMode: function() {
         return this._tileModel.getTileMode();
      },

      setItemsHeight: function(itemsHeight) {
         this._tileModel.setItemsHeight(itemsHeight);
      },

      getItemsHeight: function() {
         return this._tileModel.getItemsHeight();
      },

      setHoveredItem: function(itemData) {
         this._tileModel.setHoveredItem(itemData);
      },

      getHoveredItem: function() {
         return this._tileModel.getHoveredItem();
      },

      setActiveItem: function(itemData) {
         this._tileModel.setActiveItem(itemData);
         TreeTileViewModel.superclass.setActiveItem.apply(this, arguments);
      },

      setRoot: function() {
         this._tileModel.setHoveredItem(null);
         TreeTileViewModel.superclass.setRoot.apply(this, arguments);
      },

      destroy: function() {
         this._tileModel.destroy();
         TreeTileViewModel.superclass.destroy.apply(this, arguments);
      }
   });

   return TreeTileViewModel;
});
