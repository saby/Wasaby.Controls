define('Controls/Filter/Button/History/resources/historyUtils',
   [
      'Controls/History/FilterSource',
      'Controls/History/Service',
      'WS.Data/Source/Memory',
      'WS.Data/Di'
   ],
   function(HistorySource, HistoryService, MemorySource, Di) {

      'use strict';

      function getHistorySource(hId) {
         return new HistorySource({
            originSource: new MemorySource({
               idProperty: 'id',
               data: []
            }),
            historySource: Di.isRegistered('demoSourceHistory') ? Di.resolve('demoSourceHistory', {
               historyId: hId,
               pinned: true,
               dataLoaded: true
            }) : new HistoryService({
               historyId: hId,
               pinned: true,
               dataLoaded: true
            })
         });
      }

      return {
         getHistorySource: getHistorySource
      };
   }
);
