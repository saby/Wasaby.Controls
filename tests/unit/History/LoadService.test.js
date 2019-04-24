define(['Controls/History/LoadService', 'Controls/history'], function(LoadService, history) {
   describe('Controls/History/LoadService', function() {
      it('LoadHistoryService', function(done) {
         new LoadService({
            historyId: 'historyField'
         }).addCallback(function(historyService) {
            assert.isTrue(historyService instanceof history.Service);
            assert.isTrue(new LoadService({
               historyId: 'historyField'
            }).getResult() instanceof history.Service);
            done();
         });
      });
   });
});