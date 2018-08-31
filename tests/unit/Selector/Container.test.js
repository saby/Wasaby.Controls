define(['Controls/Selector/Container', 'WS.Data/Entity/Model', 'WS.Data/Source/Memory'], function(Container, Model, Memory) {
   
   var getItems = function() {
      var items = [];
      var i;
   
      for (i = 0; i < 5; i++) {
         items.push(new Model(
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
   
         assert.deepEqual(Container._private.getFilteredItems(items, retTrue), items);
         assert.deepEqual(Container._private.getFilteredItems(items, filterFunc), ['toSaveItem', 'toSaveItem']);
      });
   
      it('getKeysByItems', function() {
         assert.deepEqual(Container._private.getKeysByItems(getItems(), 'id'), [0, 1, 2, 3, 4]);
      });
   
      it('getFilterFunction', function() {
         var retFalse = function() {
            return false;
         }
   
         assert.isTrue(Container._private.getFilterFunction()());
         assert.isFalse(Container._private.getFilterFunction(retFalse)());
      });
   
      it('getSelectedKeys', function() {
         var context = {
            controllerContext: {
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
         
         assert.deepEqual(Container._private.getSelectedKeys(options, context), [0, 2, 4]);
      });
   
      it('prepareFilter', function() {
         var filter = {};
         var selection = {
            selected: [1, 2],
            excluded: [3, 4]
         };
         var source = new Memory();
         
         var preparedFilter = Container._private.prepareFilter(filter, selection, source);
         
         assert.deepEqual(filter.selection.get('marked'), ['1', '2']);
         assert.deepEqual(filter.selection.get('excluded'), ['3', '4']);
      });
   
      it('prepareResult', function() {
         var result = 'result';
         var selectedKeys = [];
         var keyProperty = 'id';
   
         assert.deepEqual(Container._private.prepareResult(result, selectedKeys, keyProperty), {
            resultSelection: result,
            initialSelection: selectedKeys,
            keyProperty: keyProperty
         });
      });
   
      it('getSourceController', function() {
         var source = new Memory();
         var navigation = {};
         var sourceController = Container._private.getSourceController(source, navigation);
         
         assert.equal(sourceController._moduleName, 'Controls/Controllers/SourceController');
      });
      
   });
   
});