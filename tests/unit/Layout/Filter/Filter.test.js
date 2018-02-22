define(['Controls/Layout/Filter'], function(Filter){
   
   describe('Controls.Layout.Filter', function () {
      
      it('check filter', function () {
         var filterLayout = new Filter();
         filterLayout._changeFilterHandler(null, {testKey: 'testValue'});
         assert.deepEqual(filterLayout._filter, {testKey: 'testValue'});
      });
      
   });
   
});