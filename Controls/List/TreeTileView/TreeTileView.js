define('Controls/List/TreeTileView/TreeTileView', [
   'Controls/List/TileView/TileView',
   'wml!Controls/List/TreeTileView/DefaultItemTpl',
   'wml!Controls/List/TreeTileView/resources/ItemOutputWrapper',
   'css!theme?Controls/List/TreeTileView/TreeTileView'
], function(TileView, defaultItemTpl, itemOutputWrapper) {

   'use strict';

   var TreeTileView = TileView.extend({
      _defaultItemTemplate: defaultItemTpl,
      _itemOutputWrapper: itemOutputWrapper
   });

   return TreeTileView;
});
