define(['Controls/filterPopup', 'Types/collection'], function(filterPopup, collection) {

   describe('filterPopup:HierarchyLookup', function() {
      it('_beforeMount', function() {
         let lookup = new filterPopup.HierarchyLookup();
         lookup._beforeMount({selectedKeys: null});
         assert.equal(lookup._selectedKeys, null);

         lookup._beforeMount({selectedKeys: {folder1: [1,2,3], folder2: [4,5,6]}});
         assert.deepEqual(lookup._selectedKeys, [1,2,3,4,5,6]);
      });

      it('_selectedKeysChangedHandler', function() {
         let lookup = new filterPopup.HierarchyLookup();
         let selectedKeysEventFired = false;
         let newSelectedKeys;

         lookup.saveOptions({
            keyProperty: 'key',
            parentProperty: 'root'
         });
         lookup._notify = function(event, value) {
            selectedKeysEventFired = true;
            newSelectedKeys = value[0];
         };

         const items = new collection.RecordSet({
            rawData: [
               {key: '1'},
               {key: '3', root: '-1'},
               {key: '8', root: '0'},
               {key: '5', root: '-1'}
            ]
         });

         lookup._itemsChanged('event', items);

         assert.deepEqual(newSelectedKeys, {'1': ['1'], '-1': ['3', '5'], '0': ['8']});
         assert.isTrue(selectedKeysEventFired);
      });

   });
});
