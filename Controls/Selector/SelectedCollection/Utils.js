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
      }
   };
});
