define(['Controls/filterPopup', 'Types/collection'], function(filterPopup, collection) {

   describe('filterPopup:Dropdown', function() {

      it('dataLoadCallback', function() {
         let dropDown = new filterPopup.Dropdown(),
            expectedItems = [{id: 'first'}],
            isDataLoaded = false;
         dropDown._options.dataLoadCallback = (items) => {
            isDataLoaded = true;
         };
         filterPopup.Dropdown._private.dataLoadCallback.call(dropDown, expectedItems);
         assert.deepStrictEqual(dropDown._items, expectedItems);
         assert.isTrue(isDataLoaded);
      });

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


      it('_textValueChangedHandler', function() {
         let dropDown = new filterPopup.Dropdown();
         let textValueEventResult = '';

         dropDown._notify = function(event, value) {
            textValueEventResult = value[0];
         };

         let options = {
            emptyText: 'all',
            selectedKeys: ['2'],
            keyProperty: 'id'
         };
         dropDown.saveOptions(options);
         dropDown._items = new collection.RecordSet({
            idProperty: 'id',
            rawData: [
               {id: '1', title: 'first'},
               {id: '2', title: 'second'},
               {id: '3', title: 'third'},
               {id: '4', title: 'fourth'}
            ]
         });
         dropDown._textValueChangedHandler('event', 'New text value');
         assert.equal(textValueEventResult, 'New text value');

         dropDown._options.selectedKeys = [null];
         dropDown._textValueChangedHandler('event', 'New text value');
         assert.equal(textValueEventResult, '');

         dropDown._options.selectedKeys = ['1'];
         dropDown._textValueChangedHandler('event', 'New text value');
         assert.equal(textValueEventResult, '');
      });

   });
});
