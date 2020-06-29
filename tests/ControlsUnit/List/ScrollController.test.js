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
   });
});
