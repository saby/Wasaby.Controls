define(['Controls/search'], function(search) {
   describe('Controls/search:FilterController', function() {
      it('_beforeMount with option searchValue', function() {
         var filterController = new search.FilterController();

         filterController._beforeMount({
            searchParam: 'title',
            searchValue: 'test'
         });

         assert.deepEqual(filterController._filter, {title: 'test'});
      });
   });
});