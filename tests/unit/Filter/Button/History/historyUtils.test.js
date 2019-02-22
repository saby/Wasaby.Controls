define(
   [
      'Controls/Filter/Button/History/resources/historyUtils',
      'Controls/History/FilterSource',
      'Env/Env'
   ],
   function(HistoryUtils, FilterHistorySource, Env) {
      describe('Filter.Button.HistoryUtils', function() {

         var historyId = 'TEST_HISTORY_ID_UTILS';

         it('getHistorySource', function() {
            var hSource = HistoryUtils.getHistorySource(historyId);
            assert.isTrue(hSource instanceof FilterHistorySource);
            var hSource2 = HistoryUtils.getHistorySource(historyId);
            assert.isTrue(hSource === hSource2);
         });

         it('getHistorySource isBuildOnServer', function() {
            var isBuildOnServer = Env.constants.isBuildOnServer;
            Env.constants.isBuildOnServer = true;
            var hSource = HistoryUtils.getHistorySource(historyId);
            var hSource2 = HistoryUtils.getHistorySource(historyId);
            assert.isTrue(hSource !== hSource2);
            Env.constants.isBuildOnServer = isBuildOnServer;
         });
      });
   });
