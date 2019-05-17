define(['Controls/lookupPopup', 'Types/entity', 'Types/source', 'Types/collection'], function(lookupPopup, entity, sourceLib, collection) {

   var getItems = function() {
      var items = [];
      var i;

      for (i = 0; i < 5; i++) {
         items.push(new entity.Model(
            {
               rawData: {
                  id: i
               },
               idProperty: 'id'
            })
         );
      }

      return items;
   };

   describe('Controls.Selector.Container', function() {

      it('getFilteredItems', function() {
         var items = ['toRemoveItem', 'toSaveItem', 'toSaveItem'];
         var filterFunc = function(item) {
            return item !== 'toRemoveItem';
         };
         var retTrue = function() {
            return true;
         };

         assert.deepEqual(lookupPopup.Container._private.getFilteredItems(items, retTrue), items);
         assert.deepEqual(lookupPopup.Container._private.getFilteredItems(items, filterFunc), ['toSaveItem', 'toSaveItem']);
      });

      it('getKeysByItems', function() {
         assert.deepEqual(lookupPopup.Container._private.getKeysByItems(getItems(), 'id'), [0, 1, 2, 3, 4]);
      });

      it('getEmptyItems', function() {
         var listWithItems = new collection.List({items: getItems()});

         assert.equal(lookupPopup.Container._private.getEmptyItems(listWithItems).getCount(), 0);
         assert.equal(lookupPopup.Container._private.getEmptyItems(listWithItems)._moduleName, 'Types/collection:List');
      });


      it('getValidSelectionType', function() {
         assert.equal(lookupPopup.Container._private.getValidSelectionType('all'), 'all');
         assert.equal(lookupPopup.Container._private.getValidSelectionType('leaf'), 'leaf');
         assert.equal(lookupPopup.Container._private.getValidSelectionType('node'), 'node');
         assert.equal(lookupPopup.Container._private.getValidSelectionType('test'), 'all');
      });

      it('getFilterFunction', function() {
         var retFalse = function() {
            return false;
         }

         assert.isTrue(lookupPopup.Container._private.getFilterFunction()());
         assert.isFalse(lookupPopup.Container._private.getFilterFunction(retFalse)());
      });

      it('getSelectedKeys', function() {
         var context = {
            selectorControllerContext: {
               selectedItems: getItems()
            },
            dataOptions: {
               keyProperty: 'id'
            }
         };
         var options = {
            selectionFilter: function(item) {
               var id = item.get('id');
               return id !== 1 && id !== 3;
            }
         };

         assert.deepEqual(lookupPopup.Container._private.getSelectedKeys(options, context), [0, 2, 4]);
      });

      it('prepareFilter', function() {
         var filter = {
            searchParam: 'test'
         };
         var selection = {
            selected: [1, 2],
            excluded: [3, 4]
         };

         var preparedFilter = lookupPopup.Container._private.prepareFilter(filter, selection, 'searchParam');

         assert.deepEqual(preparedFilter.selection.selected, [1, 2]);
         assert.deepEqual(preparedFilter.selection.excluded, [3, 4]);
         assert.isTrue(preparedFilter !== filter);
         assert.isTrue(!preparedFilter.searchParam);
      });

      it('prepareResult', function() {
         var result = 'result';
         var selectedKeys = [];
         var keyProperty = 'id';

         assert.deepEqual(lookupPopup.Container._private.prepareResult(result, selectedKeys, keyProperty), {
            resultSelection: result,
            initialSelection: selectedKeys,
            keyProperty: keyProperty
         });
      });

      it('getSourceController', function() {
         var source = new sourceLib.Memory();
         var navigation = {};
         var sourceController = lookupPopup.Container._private.getSourceController(source, navigation);

         assert.include(
            ['Controls/source:Controller', 'Controls/_source/SourceController'],
            sourceController._moduleName
         );
      });

   });

});
