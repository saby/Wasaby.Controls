define(['Controls/treeGrid', 'Types/collection', 'Types/entity'], function(treeGrid, collection, entity) {
   
   describe('Controls.List.SearchView.SearchGridViewModel', function() {
   
      describe('instance tests', function() {
      
         it('getCurrent', function () {
            var items = new collection.RecordSet({
               rawData: [{id: 1, title: 'test'}],
               idProperty: 'id'
            });
            var model = new treeGrid.SearchGridViewModel({
               items: items,
               searchValue: 'tes',
               columns: [{displayProperty: 'id'}, {displayProperty: 'title'}],
               multiSelectVisibility: 'hidden'
            });
            model._curIndex = 0;
   
            var current = model.getCurrent();
            current.resetColumnIndex();
            assert.isFalse(!!current.getCurrentColumn().column.needSearchHighlight);
            assert.equal(current.getCurrentColumn().searchValue, 'tes');
            
            current.goToNextColumn();
            assert.isTrue(!!current.getCurrentColumn().column.needSearchHighlight);
            assert.equal(current.getCurrentColumn().searchValue, 'tes');
         });

         it('should not add spacing to first column because multiSelectVisibility is "visible"', function() {
            var items = new collection.RecordSet({
               rawData: [{id: 1, title: 'test'}],
               idProperty: 'id'
            });
            var model = new treeGrid.SearchGridViewModel({
               items: items,
               searchValue: 'tes',
               columns: [{displayProperty: 'id'}, {displayProperty: 'title'}],
               multiSelectVisibility: 'visible'
            });
            model._curIndex = 0;
            var current = model.getCurrent();
            current.resetColumnIndex();
         });
      });
   });
});
