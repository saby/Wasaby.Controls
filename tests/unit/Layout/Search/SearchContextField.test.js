define(['Controls/Container/Search/SearchContextField'], function(SearchContextField){
  
   describe('Controls.Container.Search.SearchContextField', function () {
      
      it('check value', function () {
         var contextField = new SearchContextField('testValue');
         assert.equal(contextField.searchValue, 'testValue');
      });
      
   });
   
});