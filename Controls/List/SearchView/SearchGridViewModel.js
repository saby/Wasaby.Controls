define('Controls/List/SearchView/SearchGridViewModel', [
   'Controls/List/TreeGridView/TreeGridViewModel',
   'Controls/List/SearchView/SearchViewModel'
], function(TreeGridViewModel, SearchViewModel) {

   'use strict';

   var
      SearchGridViewModel = TreeGridViewModel.extend({
         _createModel: function(cfg) {
            return new SearchViewModel(cfg);
         },
   
         getItemDataByItem: function() {
            var itemsModelCurrent = SearchGridViewModel.superclass.getItemDataByItem.apply(this, arguments);
            itemsModelCurrent.searchValue = this._options.searchValue;
            return itemsModelCurrent;
         }
      });

   return SearchGridViewModel;
});
