define(['Controls/filterPopup'], function(filterPopup) {

   describe('filterPopup:Dropdown', function() {

      it('_selectedKeysChangedHandler', function() {
         let dropDown = new filterPopup.Dropdown();
         let selectedKeysEventFired = false;
         let eventResult;

         dropDown._notify = function(event, value) {
            selectedKeysEventFired = true;
            return 'testResult';
         };


         eventResult = dropDown._selectedKeysChangedHandler();

         assert.equal(eventResult, 'testResult');
         assert.isTrue(selectedKeysEventFired);
      });

   });
});
