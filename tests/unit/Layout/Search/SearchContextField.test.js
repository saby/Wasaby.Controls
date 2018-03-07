define(['Controls/Layout/Search/SearchContextField'], function(SearchContextField){
  
   describe('Controls.Layout.Search.SearchContextField', function () {
      
      it('check value', function () {
         var contextField = new SearchContextField('testValue');
         assert.equal(contextField.searchValue, 'testValue');
      });
      
   });
   
});