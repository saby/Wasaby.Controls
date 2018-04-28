define('Controls/List/ItemActions/Utils/Actions', [], function(
) {
   'use strict';
   return {
      actionClick: function(self, event, action, itemData, showAll) {
         event.stopPropagation();
         if (action.isMenu) {
            self._notify('menuActionsClick', [itemData, event, showAll]);
         } else {
            self._notify('actionClick', [action, itemData.item]);
            action.handler && action.handler(itemData.item);
         }
      }
   };
});
