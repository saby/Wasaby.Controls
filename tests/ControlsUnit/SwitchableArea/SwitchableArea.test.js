define([
   'Controls/switchableArea'
], function(
   switchableArea
) {
   'use strict';
   var SwitchArea;
   var testItems = [
      {
         id: '1'
      }, {
         key: '2'
      }, {
         id: '3'
      }
   ];
   var additionalTestItems = [
      {
         id: '1',
         title: 'title'
      }
   ];
   describe('Controls.switchableArea:View', function() {
      beforeEach(function() {
         SwitchArea = new switchableArea.View();
      });

      it('life cycle', function() {
         var opt = {
            items: testItems,
            selectedKey: '1'
         };
         SwitchArea.saveOptions(opt);
         SwitchArea._beforeMount(opt);
         SwitchArea._beforeUpdate({
            items: testItems,
            selectedKey: '2'
         });
         assert.equal(SwitchArea._viewModel._items[0].loaded, true, '_beforeMount. Item load status is uncorrect');
         assert.equal(SwitchArea._viewModel._items[1].loaded, true, '_beforeUpdate. Item load status is uncorrect');
         SwitchArea._beforeUpdate({
            items: additionalTestItems,
            selectedKey: '1'
         });
         assert.equal(SwitchArea._viewModel._items[0].title, 'title', '_beforeUpdate. Items updating is uncorrect');
      });
   });
});
