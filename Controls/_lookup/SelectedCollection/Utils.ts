import GetWidth = require('Controls/Utils/getWidth');
import CounterTemplate = require('wml!Controls/_lookup/SelectedCollection/CounterTemplate');


   export = {
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

