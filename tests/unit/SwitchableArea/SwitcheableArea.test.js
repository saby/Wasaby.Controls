define(['Controls/SwitchableArea', 'WS.Data/Collection/RecordSet'], function (SwitchableArea, RecordSet) {
   'use strict';
   var SwitchArea;
   var testItems = new RecordSet({
      rawData: [ {id: 1}, {id: 2}, {id: 3} ],
      idProperty: 'id'
   });
   describe('Controls.SwitchableArea', function () {
      beforeEach(function(){
         SwitchArea = new SwitchableArea();
      });

      it('getIdPropertyItem', function () {
         var opt = {
            items: testItems
         };
         SwitchArea.saveOptions(opt);
         assert.equal(SwitchArea.getIdPropertyItem(testItems.at(2)), 3, 'getIdProperty is uncorrect');
      });

      it('life circle', function () {
         var opt = {
            items: testItems,
            selectedKey: '1'
         };
         SwitchArea.saveOptions(opt);
         SwitchArea._beforeMount(opt);
         opt.selectedKey = '2';
         SwitchArea._beforeUpdate(opt);
         assert.equal(SwitchArea._viewModel._items.getRecordById('1').loaded, true, '_beforeMount. Item load status is uncorrect');
         assert.equal(SwitchArea._viewModel._items.getRecordById('2').loaded, true, '_beforeUpdate. Item load status is uncorrect');
      });
   });
});