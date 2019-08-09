define(['Controls/suggest', 'Types/entity'], function(suggest, entity) {
   'use strict';

   describe('Controls/_suggest/Input/Search/Suggest', function() {

      var sandbox;

      beforeEach(function() {
         sandbox = sinon.createSandbox();
      });

      afterEach(function() {
         sandbox.restore();
      });

      it('_close', function() {
         var searchSuggest = new suggest.SearchInput();
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

      it('_suggestMarkedKeyChanged', function() {
         var searchSuggest = new suggest.SearchInput();
         searchSuggest._suggestMarkedKeyChanged(null, null);
         assert.isFalse(searchSuggest._markedKeyChanged);

         searchSuggest._suggestMarkedKeyChanged(null, 'test');
         assert.isTrue(searchSuggest._markedKeyChanged);
      });

      it('_searchClick', function() {
         var searchSuggest = new suggest.SearchInput();
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

      if('_choose', () => {
         const searchSuggest = new suggest.SearchInput();
         const model = new entity.Model({
            rawData: {
               id: 0,
               title: 'test'
            }
         });
         const stubNotify = sandbox.stub(instance, '_notify');

         searchSuggest.saveOptions({
            displayProperty: 'title'
         });

         searchSuggest._choose(null, model);

         assert.isTrue(stubNotify.withArgs('valueChanged', ['test']).calledOnce);
      });

   });
});
