define(['Controls/Container/MasterList'], function(MasterList) {
   'use strict';
   describe('Controls.Container.MasterList', function() {
      let
         Control = new MasterList(),
         key;

      describe('itemClickHandler', function() {
         it('notify exact key', () => {
            Control._notify = (event, args) => {
               if (event === 'selectedMasterValueChanged') {
                  key = args[0];
               }
            };
            Control._markedKeyChangedHandler('selectedMasterValueChanged', 'newValue');
            assert.equal(key, 'newValue');
         });
      });
   });
});
