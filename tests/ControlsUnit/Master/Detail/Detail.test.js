define(['Controls/masterDetail'], function(masterDetail) {
   'use strict';
   describe('Controls.Container.MasterDetail', function() {
      let
         Control = new masterDetail.Base(),
         event = {
            stopPropagation() {}
         };
      describe('selectedMasterValueChanged', function() {
         it('selected master value changed', () => {
            Control._selectedMasterValueChangedHandler(event, 'newValue');
            assert.equal(Control._selected, 'newValue');
         });
      });
   });
});
