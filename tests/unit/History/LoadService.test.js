define(['Controls/History/LoadService', 'Controls/History/Service'], function(LoadService, HistoryService) {
   describe('Controls/History/LoadService', function() {
      it('LoadHistoryService', function(done) {
         new LoadService({
            historyId: 'historyField'
         }).addCallback(function(historyService) {
            assert.isTrue(historyService instanceof HistoryService);
            assert.isTrue(new LoadService({
               historyId: 'historyField'
            }).getResult() instanceof HistoryService);
            done();
         });
      });
   });
});