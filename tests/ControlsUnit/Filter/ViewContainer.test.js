define(
   [
      'Controls/filter',
   ],
   function(filter) {
      describe('ViewContainer', function() {
         let resultFilter = {test: 'test'};

         it('_filterChanged', function() {
            let filterLayout = new filter.ViewContainer();
            let propagationStopped = false;

            filterLayout._filterChanged({stopPropagation: () => {propagationStopped = true}}, {...resultFilter});
            assert.isTrue(propagationStopped);
         });

         it('_itemsChanged', function() {
            let filterLayout = new filter.ViewContainer();
            let propagationStopped = false;

            filterLayout._filterChanged({stopPropagation: () => {propagationStopped = true}}, {...resultFilter});
            assert.isTrue(propagationStopped);
         });

         describe('_beforeMount', () => {
            it('_beforeMount with preloadedSources', () => {
               const filterSource = [{
                  name: 'testName',
                  value: 'testValue'
               }];
               const preloadedSources = [{
                  historyItems: {},
                  filterButtonSource: filterSource
               }];
               const filterViewContainer = new filter.ViewContainer();

               filterViewContainer._beforeMount({
                  useStore: true,
                  preloadedSources
               });
               assert.ok(filterViewContainer._source);

               preloadedSources.historyItems = {
                  items: filterSource
               };
               filterViewContainer._source = null;
               filterViewContainer._beforeMount({
                  useStore: true,
                  preloadedSources
               });
               assert.ok(filterViewContainer._source);
            });
         });
      });
   }
);
