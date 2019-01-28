define(['Controls/List/SearchView/SearchViewModel', 'Types/collection'], function(SearchViewModel, collection) {
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
      it('getItemDataByItem', function() {
         var data = new collection.RecordSet({rawData: [{id: '1'}], idProperty: 'id'});
         var searchViewModel = new SearchViewModel({searchValue: 'test', items: data});
         assert.deepEqual(searchViewModel.getItemDataByItem(searchViewModel._display.at(0)).searchValue, 'test');
      });
   });
});
