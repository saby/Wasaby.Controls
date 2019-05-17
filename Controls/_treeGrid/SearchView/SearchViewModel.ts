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
      getItemDataByItem() {
         var
            self = this,
            data = SearchViewModel.superclass.getItemDataByItem.apply(this, arguments);
         data.resolveItemTemplate = function(item) {
            if (item.getId && self._options.itemTemplate) {
               return self._options.itemTemplate;
            }
            return TreeGridDefaultItemTemplate;
         };
         return data;
      }
   });

export = SearchViewModel;
