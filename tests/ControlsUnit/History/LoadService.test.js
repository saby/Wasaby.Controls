define(['Controls/history', 'Controls/suggestPopup'], function(history, suggestPopup) {
   describe('Controls/_suggestPopup/LoadService', function() {
      it('LoadHistoryService', function(done) {
         new suggestPopup.LoadService({
            historyId: 'historyField'
         }).addCallback(function(historyService) {
            assert.isTrue(historyService instanceof history.Service);
            assert.isTrue(new suggestPopup.LoadService({
               historyId: 'historyField'
            }).getResult() instanceof history.Service);
            done();
         });
      });
   });
});