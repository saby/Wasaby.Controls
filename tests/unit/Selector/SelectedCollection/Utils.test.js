define(['Controls/_lookup/SelectedCollection/Utils'], function(Utils) {
   describe('Controls/_lookup/SelectedCollection/Utils', function() {
      it('getItemMaxWidth', function() {
         assert.equal(Utils.getItemMaxWidth(0, 4, 1, 'oneRow', 20), 'calc(100% - 20px);');
         assert.equal(Utils.getItemMaxWidth(0, 4, 2, 'oneRow', 20), undefined);
         assert.equal(Utils.getItemMaxWidth(0, 4, 2, 'default', 30), 'calc(100% - 30px);');
         assert.equal(Utils.getItemMaxWidth(1, 4, 2, 'default', 30), undefined);
      });
   });
});
