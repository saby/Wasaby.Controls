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
      });
   }
);
