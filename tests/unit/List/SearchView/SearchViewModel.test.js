define(['Controls/_treeGrid/SearchView/SearchViewModel', 'Types/collection'], function(SearchViewModel, Collection) {
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
      it('getItemActions', function() {
         var
            searchViewModel = new SearchViewModel({
               items: new Collection.RecordSet({
                  rawData: [{
                     id: 1,
                     type: true,
                     parent: null
                  }, {
                     id: 2,
                     type: null,
                     parent: 1
                  }],
                  idProperty: 'id'
               }),
               parentProperty: 'parent',
               nodeProperty: 'type',
               keyProperty: 'id'
            }),
            item1 = searchViewModel._display.at(0).getContents(),
            item2 = searchViewModel._display.at(1).getContents();

         searchViewModel.setItemActions(item1[0], [{ id: 'action_for_node' }]);
         searchViewModel.setItemActions(item2, [{ id: 'action_for_leaf' }]);

         assert.deepEqual(searchViewModel.getItemActions(item1), [{ id: 'action_for_node' }]);
         assert.deepEqual(searchViewModel.getItemActions(item2), [{ id: 'action_for_leaf' }]);
      });
   });
});
