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
               activeElement: activeElement
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
               collection: new ListViewModel({
                  items: items,
                  keyProperty: 'id'
               })
            });
         });
      });

      describe('._registerObserver()', () => {
         it('should do nothing if trigers was undefined', () => {
            scrollController._triggers = undefined;
            scrollController._observerRegistered = true;

            assert.doesNotThrow(() => scrollController._registerObserver());
         });
      });

      describe('.setTriggers()', () => {
         it('should reset observerRegistered if scrollObserver was changed', () => {
            scrollController._triggers = {
               scrollObserver: {}
            };
            scrollController._observerRegistered = true;
            scrollController.setTriggers({
               scrollObserver: {}
            });
            assert.isFalse(scrollController._observerRegistered);
         });
      });

      describe('_registerObserver', () => {
         it('should not throw error when observer doesnt exists', () => {
            scrollController._triggers = {};
            assert.doesNotThrow(() => scrollController._registerObserver());
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
   });
});
