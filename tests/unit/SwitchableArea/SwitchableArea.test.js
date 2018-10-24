define([
   'Controls/SwitchableArea'
], function(
   SwitchableArea
) {
   'use strict';
   var SwitchArea;
   var testItems = [
      {
         id: '1'
      }, {
         id: '2'
      }, {
         id: '3'
      }
   ];
   describe('Controls.SwitchableArea', function() {
      beforeEach(function() {
         SwitchArea = new SwitchableArea();
      });

      it('life cycle', function() {
         var opt = {
            items: testItems,
            selectedKey: '1'
         };
         SwitchArea.saveOptions(opt);
         SwitchArea._beforeMount(opt);
         SwitchArea._beforeUpdate({
            selectedKey: '2'
         });
         assert.equal(SwitchArea._viewModel._items[0].loaded, true, '_beforeMount. Item load status is uncorrect');
         assert.equal(SwitchArea._viewModel._items[1].loaded, true, '_beforeUpdate. Item load status is uncorrect');
      });
   });
});
