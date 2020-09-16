define([
   'Controls/_list/ScrollController',
   'Controls/_list/ListViewModel',
   'Types/collection'
], function(ScrollControllerLib, ListViewModel, collection) {
   const ScrollController = ScrollControllerLib.default;
   describe('Controls.List.Container', function() {
      let scrollController;
      beforeEach(() => {
         scrollController = new ScrollController({});
      });

      describe('.update()', () => {
         it('should update active element', () => {
            let activeElement = {};
            scrollController.update({
               options: {
                  activeElement: activeElement
               }
            });
            assert.equal(activeElement, scrollController._options.activeElement);
         });

         it('should create virtual scroll', (done) => {
            scrollController._options.viewModel = {};
            let items = new collection.RecordSet({
               keyProperty: 'id',
               rawData: {}
            });
            sinon.stub(scrollController, '_initVirtualScroll').callsFake(() => {
               done();
            });
            scrollController.update({
               options: {
                  collection: new ListViewModel({
                     items: items,
                     keyProperty: 'id'
                  })
               }
            });
         });

      });

      describe('._initVirtualScroll()', () => {
         it('should not create virtual scroll', () => {
            let items = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [{id: 1}]
            });
            let viewModel = new ListViewModel({
               items: items,
               keyProperty: 'id'
            });
            scrollController._initVirtualScroll({
               collection: viewModel,
               virtualScrollConfig: {
                  pageSize: 5
               }
            });
            assert.isUndefined(scrollController._virtualScroll);
         });

         it('should create virtual scroll when pageSise more than items count', () => {
            let items = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [{id: 1},{id: 2},{id: 3},{id: 4}]
            });
            let viewModel = new ListViewModel({
               items: items,
               keyProperty: 'id'
            });
            scrollController._initVirtualScroll({
               collection: viewModel,
               virtualScrollConfig: {
                  pageSize: 3
               }
            });
            assert.isDefined(scrollController._virtualScroll);
         });
      });

      describe('getFirstVisibleRecord', () => {
         const getBCR = () => ({ height: 30 });
         const htmlItems = [
            { getBoundingClientRect: getBCR },
            { getBoundingClientRect: getBCR },
            { getBoundingClientRect: getBCR }
         ];

         let items, viewModel;
         beforeEach(() => {
            items = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [{id: 1},{id: 2},{id: 3},{id: 4}]
            });
            viewModel = new ListViewModel({
               items: items,
               keyProperty: 'id'
            });
            scrollController = new ScrollController({
               collection: viewModel
            });
         });

         it('offset 0', () => {
            const result = scrollController.getFirstVisibleRecord(htmlItems, 0);
            assert.equal(result, items.getRecordById(1));
         });

         it('offset 1', () => {
            const result = scrollController.getFirstVisibleRecord(htmlItems, 1);
            assert.equal(result, items.getRecordById(2));
         });

         it('offset 29', () => {
            const result = scrollController.getFirstVisibleRecord(htmlItems, 29);
            assert.equal(result, items.getRecordById(2));
         });

         it ('offset 30', () => {
            const result = scrollController.getFirstVisibleRecord(htmlItems, 30);
            assert.equal(result, items.getRecordById(2));
         });

         it ('offset 31', () => {
            const result = scrollController.getFirstVisibleRecord(htmlItems, 31);
            assert.equal(result, items.getRecordById(3));
         });

         it ('offset 31 and start index 2', () => {
            viewModel.getStartIndex = () => 2;
            viewModel.getStopIndex = () => 3;
            const result = scrollController.getFirstVisibleRecord(htmlItems, 31);
            assert.equal(result, items.getRecordById(4));
         });
      });
   });
});
