define(['Controls/Container/MasterDetail'], function(MasterDetail) {
   'use strict';
   describe('Controls.Container.MasterDetail', function() {
      let
         Control = new MasterDetail(),
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
