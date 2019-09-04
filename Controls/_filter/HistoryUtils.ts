import {Service as HistoryService, FilterSource as HistorySource, Constants} from 'Controls/history';
import {factory} from 'Types/chain';

import {Controller as SourceController} from 'Controls/source';
import entity = require('Types/entity');
import collection = require('Types/collection');
import sourceLib = require('Types/source');
import Env = require('Env/Env');
import Di = require('Types/di');
import coreInstance = require('Core/core-instance');

var HISTORY_SOURCE = {};

function destroyHistorySource(historyId) {
   HISTORY_SOURCE[historyId].destroy({}, {
      '$_history': true
   });
   HISTORY_SOURCE[historyId] = null;
}

function createHistorySource(historyId, isReport) {
   var historySourceData = {
      historyId: historyId,
      // the report filters panel uses favorite history, for it we don't request pinned items from the history service
      pinned: !isReport,

      /* A record about resets filters is stored in the history, but it is not necessary to display it in the history list.
         We request one more record, so that the number of records remains equal to 10 */
      recent: Constants.MAX_HISTORY + 1,

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

function getHistorySource(historyId, isReport?) {
   if (Env.constants.isBuildOnServer) {
      return createHistorySource(historyId, isReport);
   } else {
      HISTORY_SOURCE[historyId] = HISTORY_SOURCE[historyId] || createHistorySource(historyId, isReport);
   }
   return HISTORY_SOURCE[historyId];
}

function loadHistoryItems(historyId, isReport) {
   var source = getHistorySource(historyId, isReport);
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

function isHistorySource(source) {
   return coreInstance.instanceOfModule(source, 'Controls/history:Source');
}

function prependNewItems(oldItems, newItems, sourceController, keyProperty) {
   let getUniqItems = (items) => {
      let uniqItems = factory(items).filter((item) => {
         if (!newItems.getRecordById(item.get(keyProperty))) {
            return item;
         }
      }).value();
      newItems.append(uniqItems);
   };

   if (sourceController.hasMoreData('down')) {
      const allCount = oldItems.getCount();
      const firstItems = factory(oldItems).first(allCount - newItems.getCount()).value();
      getUniqItems(firstItems);
   } else {
      getUniqItems(oldItems);
   }
   newItems.setMetaData(oldItems.getMetaData());
}

function getItemsWithHistory(oldItems, newItems, sourceController, source, keyProperty) {
   let itemsWithHistory;
   prependNewItems(oldItems, newItems, sourceController, keyProperty);
   if (isHistorySource(source)) {
      itemsWithHistory = source.prepareItems(newItems);
   } else {
      itemsWithHistory = newItems;
   }
   return itemsWithHistory;
}

export {
   loadHistoryItems,
   getHistorySource,
   destroyHistorySource,
   isHistorySource,
   getItemsWithHistory
};
