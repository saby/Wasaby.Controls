define(['Controls/List/SearchView/SearchGridViewModel', 'Types/collection', 'Types/entity'], function(SearchGridViewModel, collection, entity) {
   
   describe('Controls.List.SearchView.SearchGridViewModel', function() {
   
      describe('instance tests', function() {
      
         it('getCurrent', function () {
            var items = new collection.RecordSet({
               rawData: [{id: 1, title: 'test'}],
               idProperty: 'id'
            });
            var model = new SearchGridViewModel({
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
            assert.include(current.getCurrentColumn().cellClasses, ' controls-Grid__cell_spacingFirstCol_search');
            
            current.goToNextColumn();
            assert.isTrue(!!current.getCurrentColumn().column.needSearchHighlight);
            assert.equal(current.getCurrentColumn().searchValue, 'tes');
            assert.notInclude(current.getCurrentColumn().cellClasses, ' controls-Grid__cell_spacingFirstCol_search');
         });

         it('should not add spacing to first column because multiSelectVisibility is "visible"', function() {
            var items = new collection.RecordSet({
               rawData: [{id: 1, title: 'test'}],
               idProperty: 'id'
            });
            var model = new SearchGridViewModel({
               items: items,
               searchValue: 'tes',
               columns: [{displayProperty: 'id'}, {displayProperty: 'title'}],
               multiSelectVisibility: 'visible'
            });
            model._curIndex = 0;
            var current = model.getCurrent();
            current.resetColumnIndex();

            assert.notInclude(current.getCurrentColumn().cellClasses, ' controls-Grid__cell_spacingFirstCol_search');
         });
      });
   });
});
