define(['Controls/Input/Search/Suggest'], function(Suggest) {
   'use strict';
   
   
   describe('Controls.Input.Search.Suggest', function() {
      
      it('_close', function() {
         var searchSuggest = new Suggest();
         var valueChangedFired = false;
   
         searchSuggest._notify = function(eventName) {
            if (eventName === 'valueChanged') {
               valueChangedFired = true;
            }
         };
         
         //case 1, value is empty
         searchSuggest.saveOptions({value: ''});
         searchSuggest._close();
         assert.isFalse(valueChangedFired);
   
         //case 2, value is not empty
         searchSuggest.saveOptions({value: 'test'});
         searchSuggest._close();
         assert.isTrue(valueChangedFired);
      });
      
   });
});
