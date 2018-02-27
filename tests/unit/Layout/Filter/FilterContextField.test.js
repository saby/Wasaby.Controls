define(['Controls/Layout/Filter/FilterContextField'], function(FilterContextField){
   
   describe('Controls.Layout.Filter.FilterContextField', function () {
      
      it('check filter', function () {
         var contextField = new FilterContextField({testKey: 'testValue'});
         assert.deepEqual(contextField.filter, {testKey: 'testValue'});
      });
      
   });
   
});