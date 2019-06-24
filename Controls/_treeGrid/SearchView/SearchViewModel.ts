import TreeViewModel = require('Controls/_treeGrid/Tree/TreeViewModel');
import TreeGridDefaultItemTemplate = require('wml!Controls/_treeGrid/TreeGridView/Item');
import {SearchItemsUtil} from 'Controls/list';
import {Record} from 'Types/entity'

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
      hasItemById(id) {
         return !!this._items.getRecordById(id);
      },
      getItemDataByItem() {
         var
            self = this,
            data = SearchViewModel.superclass.getItemDataByItem.apply(this, arguments),
            s = SearchViewModel.superclass;
         // Use "duck typing" to detect breadCrumbs (faster than "instanceOf Array")
         data.breadCrumbs = !!data.item.forEach;
         data.resolveItemTemplate = function(itemData) {
            if (!itemData.breadCrumbs && self._options.itemTemplate) {
               return self._options.itemTemplate;
            }
            return TreeGridDefaultItemTemplate;
         };
         return data;
      },

       isBredCrumbsItem: function(item:Record) {
           return !!item.forEach;
       },
       isValidItemForMarkedKey: function(item) {
          const isGroup = SearchViewModel.superclass.isValidItemForMarkedKey.call(this, item);
          return isGroup && !this.isBredCrumbsItem(item);
       },
      _isGroup: function(item:Record):boolean {
          let result;

          // Use "duck typing" to detect breadCrumbs (faster than "instanceOf Array")
          if (!!item.forEach) {
              result = false;
          } else {
              result = SearchViewModel.superclass._isGroup.call(this, item);
          }

          return result;
      }
   });

export = SearchViewModel;
