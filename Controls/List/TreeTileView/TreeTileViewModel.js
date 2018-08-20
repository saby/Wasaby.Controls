define('Controls/List/TreeTileView/TreeTileViewModel', [
   'Controls/List/TileView/TileViewModel',
   'Controls/List/Tree/TreeViewModel'
], function(TileViewModel, TreeViewModel) {

   'use strict';

   //TODO: крпипаста из TileViewModel, думаю как нормально
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

      getCurrent: function() {
         var
            prevItem,
            hoveredItem = this._tileModel.getHoveredItem(),
            current = TreeTileViewModel.superclass.getCurrent.apply(this, arguments);

         current.tileMode = this._tileModel.getTileMode();
         current.itemsHeight = this._tileModel.getItemsHeight();
         current.imageProperty = this._options.imageProperty;

         prevItem = this._display.at(current.index - 1);
         if (prevItem) {
            current.hasSeparator = prevItem.isNode() && !current.dispItem.isNode();
         }

         if (hoveredItem && hoveredItem.key === current.key) {
            current.isHovered = true;
            current.fixedPosition = hoveredItem.fixedPosition;
         }

         return current;
      },

      setTileMode: function(tileMode) {
         this._tileModel.setTileMode(tileMode);
      },

      setItemsHeight: function(itemsHeight) {
         this._tileModel.setItemsHeight(itemsHeight);
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

      setTargetItem: function(itemData) {
         this._tileModel.setTargetItem(itemData);
      },

      getTargetItem: function() {
         return this._tileModel.getTargetItem();
      },

      destroy: function() {
         this._tileModel.destroy();
         TreeTileViewModel.superclass.destroy.apply(this, arguments);
      }
   });

   return TreeTileViewModel;
});
