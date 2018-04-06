define(['Controls/Container/Filter/FilterContextField'], function(FilterContextField){
   
   describe('Controls.Container.Filter.FilterContextField', function () {
      
      it('check filter', function () {
         var contextField = new FilterContextField({filter: {testKey: 'testValue'}});
         assert.deepEqual(contextField.filter, {testKey: 'testValue'});
      });
   
      it('check fastFilterItems', function () {
         var contextField = new FilterContextField({fastFilterItems: {id: 'testId', value: 'testValue'}});
         assert.deepEqual(contextField.fastFilterItems, {id: 'testId', value: 'testValue'});
      });
   
      it('check filterButtonItems', function () {
         var contextField = new FilterContextField({filterButtonItems: {id: 'testId', value: 'testValue'}});
         assert.deepEqual(contextField.filterButtonItems, {id: 'testId', value: 'testValue'});
      });
      
   });
   
});