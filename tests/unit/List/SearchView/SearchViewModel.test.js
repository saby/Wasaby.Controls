define(['Controls/_treeGrid/SearchView/SearchViewModel', 'Types/collection'], function(SearchViewModel, collection) {
   describe('Controls.List.SearchView.SearchViewModel', function() {
      it('getDisplayFilter', function() {
         var
            itemsFilterMethod = function() {},
            searchViewModel = new SearchViewModel({}),
            result = [
               itemsFilterMethod
            ];
         assert.deepEqual(searchViewModel.getDisplayFilter(null, {itemsFilterMethod: itemsFilterMethod}), result);
      });
   });
});
