import GetWidth = require('Controls/Utils/getWidth');
import {detection} from 'Env/Env';
import CounterTemplate = require('wml!Controls/_lookup/SelectedCollection/CounterTemplate');

export = {
   getCounterWidth: function(itemsCount) {
      return itemsCount && GetWidth.getWidth(CounterTemplate({
            itemsCount: itemsCount
         }));
   },

   getItemMaxWidth: function(indexItem, itemsLength, maxVisibleItems, itemsLayout, counterWidth) {
      var itemMaxWidth;

      // toDO !KINGO в IE max-width работает по-другому, если ширина родителя задана не явно
      if (indexItem === 0 && itemsLength > maxVisibleItems && (maxVisibleItems === 1 || itemsLayout === 'default') && !(detection.isIE && detection.IEVersion <= 11)) {
         itemMaxWidth = 'calc(100% - ' + counterWidth + 'px);';
      }

      return itemMaxWidth;
   }
};
