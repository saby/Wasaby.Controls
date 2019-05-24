define([ 'Controls/MoveDialog'], function(MoveDialog) {
   describe('Controls.MoveDialog', function() {
      it('getDefaultOptions', function() {
         assert.deepEqual(MoveDialog.getDefaultOptions(), {
            root: null
         });
      });
   });
});
