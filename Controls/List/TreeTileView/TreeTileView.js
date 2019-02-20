define('Controls/List/TreeTileView/TreeTileView', [
   'Controls/List/TileView/TileView',
   'Env/Env',
   'wml!Controls/List/TreeTileView/DefaultItemTpl',
   'wml!Controls/List/TreeTileView/resources/ItemOutputWrapper',
   'css!theme?Controls/List/TreeTileView/TreeTileView'
], function(TileView, Env, defaultItemTpl, itemOutputWrapper) {

   'use strict';

   var TreeTileView = TileView.extend({
      _defaultItemTemplate: defaultItemTpl,
      _itemOutputWrapper: itemOutputWrapper,
      _onTileViewKeyDown: function(event) {
         // Pressing the left or right key allows you to expand / collapse an element.
         // In tileView mode, expand/collapse is not allowed.
         if (event.nativeEvent.keyCode === Env.constants.key.right || event.nativeEvent.keyCode === Env.constants.key.left) {
            event.stopImmediatePropagation();
            event.preventDefault();
         }
      }
   });

   return TreeTileView;
});
