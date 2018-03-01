define(['Controls/Layout/Search'], function(Search){
   
   describe('Controls.Layout.Search', function () {
      
      it('check searchValue', function () {
         var filterLayout = new Search();
         filterLayout._changeValueHandler(null, 'testValue');
         assert.equal(filterLayout._searchValue, 'testValue');
      });
      
   });
   
});