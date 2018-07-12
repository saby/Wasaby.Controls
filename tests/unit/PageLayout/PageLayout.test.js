define(['Controls/PageLayout', 'WS.Data/Source/Memory', 'WS.Data/Collection/RecordSet'], function (pageLayout, memorySource, recordSet) {
   'use strict';
   describe('Controls/PageLayout', function () {
      it('life cycle', function () {
         var PL = new pageLayout()
         var source = new memorySource({
            data: [
               {id: '1'},
               {id: '2'},
               {id: '3'}
            ],
            idProperty: 'id'
         });
         var opt = {
            tabsSource: source,
            tabsSelectedKey: '3'
         };
         PL.saveOptions(opt);
         var resultItems = new recordSet({
            rawData: [{id: '1'}, {id: '2'}, {id: '3'}],
            idProperty: 'id'
         });
         PL._beforeMount(opt).addCallback(function (items) {
            assert.equal(items, resultItems);
            done();
         });
         source = new memorySource({
            data: [
               {id: '1'},
               {id: '2'},
               {id: '3'},
               {id: '4'}
            ],
            idProperty: 'id'
         });
         opt = {
            tabsSource: source,
            tabsSelectedKey: '2'
         };
         PL._beforeUpdate(opt).addCallback(function (items) {
            assert.equal(PL._items.at(3), {id: '4'});
            assert.equal(PL.selectedKey, '2');
            done();
         });
      });
   });
});