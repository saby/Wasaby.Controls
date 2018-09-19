define(['Controls/Selector/Controller', 'WS.Data/Entity/Model', 'WS.Data/Source/Memory', 'WS.Data/Collection/List'], function(Controller, Model, Memory, List) {

   var getSelectedItems = function() {
      var items = new List();
      
      for (var i = 0; i < 5; i++) {
         items.add(new Model({
            rawData: {
               id: i,
               title: 'title-' + i
            },
            idProperty: 'id'
         }));
      }
      
      return items;
   };
   
   describe('Controls.Selector.Controller', function() {
   
      it('prepareItems', function() {
         var itemList = new List({items: [1, 2]});
         
         assert.equal(Controller._private.prepareItems()._moduleName, 'WS.Data/Collection/List');
         assert.deepEqual();
      });
   
      it('addItemToSelected', function() {
         var itemNew = new Model({
            rawData: {
               id: 'test',
               title: 'test'
            }
         });
         var itemToReplace = new Model({
            rawData: {
               id: 0,
               title: 'test'
            }
         });
         var selectedItems = getSelectedItems();
   
         Controller._private.addItemToSelected(itemNew, selectedItems, 'id');
         assert.equal(selectedItems.getCount(), 6);
         assert.equal(selectedItems.at(5).get('title'), 'test');
   
         Controller._private.addItemToSelected(itemToReplace, selectedItems, 'id');
         assert.equal(selectedItems.getCount(), 6);
         assert.equal(selectedItems.at(0).get('title'), 'test');
      });
   
      it('removeFromSelected', function() {
         var selectedItems = getSelectedItems();
   
        Controller._private.removeFromSelected(0, selectedItems, 'id');
   
         assert.equal(selectedItems.getCount(), 4);
         assert.equal(selectedItems.at(0).get('id'), 1);
      });
   
      it('processSelectionResult', function() {
         var selectedItems = getSelectedItems();
         var newSelected = getSelectedItems();
         newSelected.removeAt(0);
         newSelected.removeAt(0);
         newSelected.removeAt(2);
         
         var result = {
            initialSelection: [0, 1, 2, 3, 4],
            resultSelection: newSelected,
            keyProperty: 'id'
         };
         Controller._private.processSelectionResult([result], selectedItems);
         
         assert.equal(selectedItems.getCount(), 2);
         assert.equal(selectedItems.at(0).get('id'), 2);
         assert.equal(selectedItems.at(1).get('id'), 3);
      });
   
      it('isSelectionChanged', function() {
         assert.isTrue(Controller._private.isSelectionChanged([0, 2, 3, 4, 5], getSelectedItems(), 'id'));
         assert.isTrue(Controller._private.isSelectionChanged([0], getSelectedItems(), 'id'));
      });
      
   });
   
});