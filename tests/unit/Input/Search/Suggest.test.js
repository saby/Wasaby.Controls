define(['Controls/Input/Search/Suggest'], function(Suggest) {
      
      'use strict';
      
      describe('Controls.Input.Search.Suggest', function() {
         
         it('_suggestMarkedKeyChanged', function() {
            var searchSuggest = new Suggest();
            searchSuggest._suggestMarkedKeyChanged(null, null);
            assert.isFalse(searchSuggest._markedKeyChanged);
   
            searchSuggest._suggestMarkedKeyChanged(null, 'test');
            assert.isTrue(searchSuggest._markedKeyChanged);
         });
         
         it('_searchClick', function() {
            var searchSuggest = new Suggest();
            var searchClickNotifyed = false;
            searchSuggest._notify = function() {
               searchClickNotifyed = true;
            }
            
            searchSuggest._suggestMarkedKeyChanged(null, 'test');
            searchSuggest._searchClick();
            assert.isFalse(searchClickNotifyed);
   
            searchSuggest._suggestMarkedKeyChanged(null, null);
            searchSuggest._searchClick();
            assert.isTrue(searchClickNotifyed);
         });
      });
   }
);