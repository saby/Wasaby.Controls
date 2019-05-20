define(['Controls/_treeGrid/SearchView/SearchViewModel'], function(SearchViewModel) {
   describe('Controls.List.SearchView.SearchViewModel', function() {
      it('getDisplayFilter', function() {
         var
            itemsFilterMethod = function() {},
            searchViewModel = new SearchViewModel({
               root: 'myTestRoot',
               items: []
            }),
            result = [
               itemsFilterMethod
            ];
         assert.deepEqual(searchViewModel.getDisplayFilter(null, {itemsFilterMethod: itemsFilterMethod}), result);
         assert.deepEqual(searchViewModel._display.getRoot().getContents(), 'myTestRoot');
      });
      it('itemTemplate', function() {
         var
            itemData,
            searchViewModel,
            superclassGetItemDataByItem = SearchViewModel.superclass.getItemDataByItem;
         SearchViewModel.superclass.getItemDataByItem = function(breadCrumbs) {
            if (breadCrumbs) {
               return {
                  item: {
                     forEach: function() {}
                  }
               };
            }
            return {
               item: {}
            };
         };

         searchViewModel = new SearchViewModel({});
         itemData = searchViewModel.getItemDataByItem(false);
         assert.equal(itemData.resolveItemTemplate(itemData).prototype._moduleName, 'Controls/treeGrid:ItemTemplate');
         itemData = searchViewModel.getItemDataByItem(true);
         assert.equal(itemData.resolveItemTemplate(itemData).prototype._moduleName, 'Controls/treeGrid:ItemTemplate');

         searchViewModel = new SearchViewModel({
            itemTemplate: {
               prototype: {
                  _moduleName: 'testItemTemplate'
               }
            }
         });
         itemData = searchViewModel.getItemDataByItem(false);
         assert.equal(itemData.resolveItemTemplate(itemData).prototype._moduleName, 'testItemTemplate');
         itemData = searchViewModel.getItemDataByItem(true);
         assert.equal(itemData.resolveItemTemplate(itemData).prototype._moduleName, 'Controls/treeGrid:ItemTemplate');

         SearchViewModel.superclass.getItemDataByItem = superclassGetItemDataByItem;
      });
   });
});
