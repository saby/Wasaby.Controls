import TreeViewModel = require('Controls/_treeGrid/Tree/TreeViewModel');
import TreeGridDefaultItemTemplate = require('wml!Controls/_treeGrid/TreeGridView/Item');
import {SearchItemsUtil} from 'Controls/list';

var
   SearchViewModel = TreeViewModel.extend({
      _prepareDisplay: function (items, cfg) {
         var
            filter = this.getDisplayFilter(this.prepareDisplayFilterData(), cfg);
         return SearchItemsUtil.getDefaultDisplaySearch(items, cfg, filter);
      },
      getDisplayFilter: function (data, cfg) {
         var
            filter = [];
         if (cfg.itemsFilterMethod) {
            filter.push(cfg.itemsFilterMethod);
         }
         return filter;
      },
      getItemActions(item) {
         if (!!item.forEach) {
            return SearchViewModel.superclass.getItemActions.call(this, item[item.length - 1]);
         }
         return SearchViewModel.superclass.getItemActions.call(this, item);
      },
      getItemById(id) {
         return this._items.getRecordById(id);
      },
      getItemDataByItem() {
         var
            self = this,
            data = SearchViewModel.superclass.getItemDataByItem.apply(this, arguments);
         // Use "duck typing" to detect breadCrumbs (faster than "instanceOf Array")
         data.breadCrumbs = !!data.item.forEach;
         data.resolveItemTemplate = function(itemData) {
            if (!itemData.breadCrumbs && self._options.itemTemplate) {
               return self._options.itemTemplate;
            }
            return TreeGridDefaultItemTemplate;
         };
         return data;
      }
   });

export = SearchViewModel;
