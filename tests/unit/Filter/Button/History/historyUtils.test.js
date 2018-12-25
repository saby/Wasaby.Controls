define(
   [
      'Controls/Filter/Button/History/resources/historyUtils',
      'Controls/History/FilterSource'
   ],
   function(HistoryUtils, FilterHistorySource) {
      describe('Filter.Button.HistoryUtils', function() {

         var historyId = 'TEST_HISTORY_ID_UTILS';

         it('getHistorySource', function() {
            var hSource = HistoryUtils.getHistorySource(historyId);
            assert.isTrue(hSource instanceof FilterHistorySource);
            var hSource2 = HistoryUtils.getHistorySource(historyId);
            assert.isTrue(hSource === hSource2);
         });

      });
   });
