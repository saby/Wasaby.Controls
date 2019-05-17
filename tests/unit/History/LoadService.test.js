define(['Controls/history'], function(history) {
   describe('Controls/_history/LoadService', function() {
      it('LoadHistoryService', function(done) {
         new history.LoadService({
            historyId: 'historyField'
         }).addCallback(function(historyService) {
            assert.isTrue(historyService instanceof history.Service);
            assert.isTrue(new history.LoadService({
               historyId: 'historyField'
            }).getResult() instanceof history.Service);
            done();
         });
      });
   });
});