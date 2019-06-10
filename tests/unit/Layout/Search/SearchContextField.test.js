define(['Controls/context'], function(contexts){

   describe('Controls.context:SearchContextField', function () {

      it('check value', function () {
         var contextField = new contexts.SearchContextField('testValue');
         assert.equal(contextField.searchValue, 'testValue');
      });

   });

});
