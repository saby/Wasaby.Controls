define('Controls/List/ItemActions/Helpers', [], function() {
   'use strict';

   var MOVE_DIRECTION = {
      'UP': -1,
      'DOWN': 1
   };

   var visibilityCallback = {
      reorderMoveActionsVisibility: function(direction, item, items, parentProperty, nodeProperty) {
         var
            index = items.getIndex(item),
            siblingItem = items.at(index + direction);

         return siblingItem &&
            (!parentProperty || siblingItem.get(parentProperty) === item.get(parentProperty)) && //items in one folder
            (!nodeProperty || siblingItem.get(nodeProperty) === item.get(nodeProperty));//items of the same type
      }
   };

   visibilityCallback.MOVE_DIRECTION = MOVE_DIRECTION;

   return visibilityCallback;
});
