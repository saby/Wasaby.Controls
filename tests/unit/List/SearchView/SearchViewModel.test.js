define(['Controls/List/SearchView/SearchViewModel'], function(SearchViewModel) {
   describe('Controls.List.SearchView.SearchViewModel', function() {
      describe('getDisplayFilter', function() {
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
