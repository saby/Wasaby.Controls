import HistorySource = require('Controls/History/FilterSource');
import HistoryService = require('Controls/History/Service');
import SourceController = require('Controls/Controllers/SourceController');
import entity = require('Types/entity');
import collection = require('Types/collection');
import sourceLib = require('Types/source');
import Env = require('Env/Env');
import Di = require('Types/di');


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

export = {
   loadHistoryItems: loadHistoryItems,
   getHistorySource: getHistorySource,
   destroyHistorySource: destroyHistorySource
};

