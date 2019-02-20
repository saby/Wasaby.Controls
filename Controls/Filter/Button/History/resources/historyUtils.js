define('Controls/Filter/Button/History/resources/historyUtils',
   [
      'Controls/History/FilterSource',
      'Controls/History/Service',
      'Controls/Controllers/SourceController',
      'Types/entity',
      'Types/collection',
      'Types/source',
      'Env/Env',
      'Types/di'
   ],
   function(HistorySource, HistoryService, SourceController, entity, collection, sourceLib, Env, Di) {
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
            originSource: new sourceLib.Memory({
               idProperty: 'id',
               data: []
            }),
            historySource: Di.isRegistered('demoSourceHistory') ? Di.resolve('demoSourceHistory', historySourceData)
               : new HistoryService(historySourceData)
         });
      }

      function getHistorySource(historyId) {
         if (Env.constants.isBuildOnServer) {
            return createHistorySource(historyId);
         } else {
            HISTORY_SOURCE[historyId] = HISTORY_SOURCE[historyId] || createHistorySource(historyId);
         }
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
            return new collection.RecordSet({
               rawData: items.getRawData(),
               adapter: new entity.adapter.Sbis()
            });
         });
      }

      return {
         loadHistoryItems: loadHistoryItems,
         getHistorySource: getHistorySource,
         destroyHistorySource: destroyHistorySource
      };
   });
