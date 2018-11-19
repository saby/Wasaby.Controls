define('Controls/Filter/Button/History/resources/historyUtils',
   [
      'Controls/History/FilterSource',
      'Controls/History/Service',
      'Controls/Controllers/SourceController',
      'WS.Data/Adapter/Sbis',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Source/Memory',
      'WS.Data/Di'
   ],
   function(HistorySource, HistoryService, SourceController, SbisAdapter, RecordSet, MemorySource, Di) {
      'use strict';

      var HISTORY_SOURCE = {};

      function destroyHistorySource(historyId) {
         HISTORY_SOURCE[historyId].destroy({}, {
            '$_history': true
         });
         HISTORY_SOURCE[historyId] = null;
      }

      function createHistorySource(historyId) {
         var historySourceData = {
            historyId: historyId,
            pinned: true,
            dataLoaded: true
         };
         return new HistorySource({
            originSource: new MemorySource({
               idProperty: 'id',
               data: []
            }),
            historySource: Di.isRegistered('demoSourceHistory') ? Di.resolve('demoSourceHistory', historySourceData)
               : new HistoryService(historySourceData)
         });
      }

      function getHistorySource(historyId) {
         HISTORY_SOURCE[historyId] = HISTORY_SOURCE[historyId] || createHistorySource(historyId);
         return HISTORY_SOURCE[historyId];
      }

      function loadHistoryItems(self, historyId) {
         var source = getHistorySource(self, historyId);
         var sourceController = new SourceController({
            source: source
         });
         return sourceController.load({
            '$_history': true
         }).addCallback(function(items) {
            return new RecordSet({
               rawData: items.getRawData(),
               adapter: new SbisAdapter()
            });
         });
      }

      return {
         loadHistoryItems: loadHistoryItems,
         getHistorySource: getHistorySource,
         destroyHistorySource: destroyHistorySource
      };
   });
