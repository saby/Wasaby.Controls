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
               keyProperty: 'id',
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
               keyProperty: 'id',
               columns: [{displayProperty: 'id'}, {displayProperty: 'title'}],
               multiSelectVisibility: 'visible'
            });
            model._curIndex = 0;
            var current = model.getCurrent();
            current.resetColumnIndex();
         });
      });
      describe('Check value of "current" for all items with grouping.', function() {
         var
            items = new collection.RecordSet({
               rawData: [{
                  id: 1,
                  parent: null,
                  nodeType: true,
                  title: 'test_node'
               }, {
                  id: 2,
                  parent: 1,
                  nodeType: null,
                  title: 'test_leaf'
               }],
               idProperty: 'id'
            }),
            searchModel;
         beforeEach(function() {
            searchModel = new treeGrid.SearchGridViewModel({
               items: items,
               keyProperty: 'id',
               parentProperty: 'parent',
               nodeProperty: 'nodeType',
               columns: [{}],
               groupingKeyCallback: function() {
                  return 'test_group';
               }
            });
         });
         it('current.rowIndex', function() {
            assert.equal(searchModel.getCurrent().rowIndex, 0);
            searchModel.goToNext();
            assert.equal(searchModel.getCurrent().rowIndex, 1);
            searchModel.goToNext();
            assert.equal(searchModel.getCurrent().rowIndex, 2);
         });
         it('current.breadCrumbs', function() {
            assert.isFalse(searchModel.getCurrent().breadCrumbs);
            searchModel.goToNext();
            assert.isTrue(searchModel.getCurrent().breadCrumbs);
            searchModel.goToNext();
            assert.isFalse(searchModel.getCurrent().breadCrumbs);
         });
      });
   });
});
