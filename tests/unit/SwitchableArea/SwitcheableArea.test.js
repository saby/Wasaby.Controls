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
         assert(SwitchArea.getIdPropertyItem(testItems.at(2)) === 3);
      });
   });
});