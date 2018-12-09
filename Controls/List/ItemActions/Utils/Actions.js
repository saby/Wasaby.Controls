define('Controls/List/ItemActions/Utils/Actions', [], function(
) {
   'use strict';
   return {
      itemActionsClick: function(self, event, action, itemData, showAll) {
         event.stopPropagation();
         if (action.isMenu) {
            self._notify('menuActionsClick', [itemData, event, showAll]);
         } else {
            self._notify('itemActionsClick', [
               action,
               itemData.item,
               Array.prototype.filter.call(self._container.querySelector('.controls-ListView__itemV').parentNode.children, function(item) {
                  return item.className.indexOf('controls-ListView__itemV') !== -1;
               })[itemData.index]
            ]);
            action.handler && action.handler(itemData.item);
         }
      }
   };
});
