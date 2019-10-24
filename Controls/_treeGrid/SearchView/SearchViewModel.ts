import * as TreeViewModel from 'Controls/_treeGrid/Tree/TreeViewModel';
import {SearchItemsUtil} from 'Controls/list';
import {Record} from 'Types/entity';

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
      getActionsItem(item) {
          if (!!item.forEach) {
              return item[item.length - 1];
          }
          return item;
      },
      getItemActions(item) {
         if (!!item.forEach) {
            return SearchViewModel.superclass.getItemActions.call(this, item[item.length - 1]);
         }
         return SearchViewModel.superclass.getItemActions.call(this, item);
      },
      setHoveredItem(item) {
         let actualItem = item;
         if (item && this.isBredCrumbsItem(item)) {
            actualItem = item[item.length - 1];
         }
         SearchViewModel.superclass.setHoveredItem.call(this, actualItem);
      },
      hasItemById(id) {
         return !!this._items.getRecordById(id);
      },
      getItemDataByItem() {
         var
            self = this,
            data = SearchViewModel.superclass.getItemDataByItem.apply(this, arguments);

         if (data._searchViewModelCached) {
            return data;
         } else {
            data._searchViewModelCached = true;
         }

         // Use "duck typing" to detect breadCrumbs (faster than "instanceOf Array")
         data.breadCrumbs = !!data.item.forEach;
         data.actionsItem = this.getActionsItem(data.item);
         data.breadCrumbsItemTemplate = "Controls/breadcrumbs:ItemTemplate";

         data.resolveItemTemplate = function(itemData) {
            if (!itemData.breadCrumbs && self._options.itemTemplate) {
               return self._options.itemTemplate;
            }
            return data.resolveBaseItemTemplate();
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
