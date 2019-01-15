define('Controls/List/TreeTileView/TreeTileView', [
   'Controls/List/TileView/TileView',
   'Core/constants',
   'wml!Controls/List/TreeTileView/DefaultItemTpl',
   'wml!Controls/List/TreeTileView/resources/ItemOutputWrapper',
   'css!theme?Controls/List/TreeTileView/TreeTileView'
], function(TileView, cConstants, defaultItemTpl, itemOutputWrapper) {

   'use strict';

   var TreeTileView = TileView.extend({
      _defaultItemTemplate: defaultItemTpl,
      _itemOutputWrapper: itemOutputWrapper,
      _onTileViewKeyDown: function(event) {
         // Pressing the left or right key allows you to expand / collapse an element.
         // In tileView mode, expand/collapse is not allowed.
         if (event.nativeEvent.keyCode === cConstants.key.right || event.nativeEvent.keyCode === cConstants.key.left) {
            event.stopImmediatePropagation();
            event.preventDefault();
         }
      }
   });

   return TreeTileView;
});
