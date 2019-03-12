define('Controls/Selector/SelectedCollection/Utils', [
   'Controls/Utils/getWidth',
   'wml!Controls/Selector/SelectedCollection/CounterTemplate'
], function(GetWidth, CounterTemplate) {
   'use strict';

   return {
      getCounterWidth: function(itemsCount) {
         return itemsCount && GetWidth.getWidth(CounterTemplate({
            itemsCount: itemsCount
         }));
      },

      getItemMaxWidth: function(indexItem, itemsLength, maxVisibleItems, itemsLayout, counterWidth) {
         var itemMaxWidth;

         if (indexItem === 0 && itemsLength > maxVisibleItems && (maxVisibleItems === 1 || itemsLayout === 'default')) {
            itemMaxWidth = 'calc(100% - ' + counterWidth + 'px);';
         }

         return itemMaxWidth;
      }
   };
});
