define(['Controls/history', 'Controls/suggest'], function(history, suggest) {
   describe('Controls/_suggest/LoadService', function() {
      it('LoadHistoryService', function(done) {
         new suggest.LoadService({
            historyId: 'historyField'
         }).addCallback(function(historyService) {
            assert.isTrue(historyService instanceof history.Service);
            assert.isTrue(new suggest.LoadService({
               historyId: 'historyField'
            }).getResult() instanceof history.Service);
            done();
         });
      });
   });
});