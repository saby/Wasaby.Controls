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
      it('itemTemplate', function() {
         var
            itemData,
            searchViewModel,
            superclassGetItemDataByItem = SearchViewModel.superclass.getItemDataByItem;
         SearchViewModel.superclass.getItemDataByItem = function() {
            return {};
         };

         searchViewModel = new SearchViewModel({});
         itemData = searchViewModel.getItemDataByItem();
         assert.equal(itemData.resolveItemTemplate({}).prototype._moduleName, 'Controls/treeGrid:ItemTemplate');
         assert.equal(itemData.resolveItemTemplate({ getId: function() {} }).prototype._moduleName, 'Controls/treeGrid:ItemTemplate');

         searchViewModel = new SearchViewModel({
            itemTemplate: {
               prototype: {
                  _moduleName: 'testItemTemplate'
               }
            }
         });
         itemData = searchViewModel.getItemDataByItem();
         assert.equal(itemData.resolveItemTemplate({}).prototype._moduleName, 'Controls/treeGrid:ItemTemplate');
         assert.equal(itemData.resolveItemTemplate({ getId: function() {} }).prototype._moduleName, 'testItemTemplate');

         SearchViewModel.superclass.getItemDataByItem = superclassGetItemDataByItem;
      });
   });
});
