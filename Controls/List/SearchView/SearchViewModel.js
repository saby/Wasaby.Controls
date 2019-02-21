define('Controls/List/SearchView/SearchViewModel', [
   'Controls/List/Tree/TreeViewModel',
   'Controls/List/resources/utils/SearchItemsUtil'
], function(TreeViewModel, SearchItemsUtil) {

   'use strict';

   var
      SearchViewModel = TreeViewModel.extend({
         _prepareDisplay: function(items, cfg) {
            var
               filter = this.getDisplayFilter(this.prepareDisplayFilterData(), cfg);
            return SearchItemsUtil.getDefaultDisplaySearch(items, cfg, filter);
         },
         getDisplayFilter: function(data, cfg) {
            var
               filter = [];
            if (cfg.itemsFilterMethod) {
               filter.push(cfg.itemsFilterMethod);
            }
            return filter;
         }
      });

   return SearchViewModel;
});
