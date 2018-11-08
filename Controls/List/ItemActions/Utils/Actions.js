define('Controls/List/ItemActions/Utils/Actions', [], function(
) {
   'use strict';
   return {
      itemActionsClick: function(self, event, action, itemData, showAll) {
         event.stopPropagation();
         if (action.isMenu) {
            self._notify('menuActionsClick', [itemData, event, showAll]);
         } else {
            self._notify('itemActionsClick', [action, itemData.item, event.nativeEvent]);
            action.handler && action.handler(itemData.item);
         }
      }
   };
});
