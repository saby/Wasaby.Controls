import {Service as HistoryService, FilterSource as HistorySource, Constants} from 'Controls/history';
import {factory} from 'Types/chain';

import {Controller as SourceController} from 'Controls/source';
import {factory as CollectionFactory} from 'Types/collection';
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

function createHistorySource(cfg) {
   var historySourceData = {
      historyId: cfg.historyId,
      pinned: cfg.pinned !== undefined ? cfg.pinned : true,

      /* A record about resets filters is stored in the history, but it is not necessary to display it in the history list.
         We request one more record, so that the number of records remains equal to 10 */
      recent: (Constants[cfg.recent] || Constants.MAX_HISTORY) + 1,

      dataLoaded: true
   };
   return new HistorySource({
      originSource: new sourceLib.Memory({
         keyProperty: 'id',
         data: []
      }),
      historySource: Di.isRegistered('demoSourceHistory') ? Di.resolve('demoSourceHistory', historySourceData)
         : new HistoryService(historySourceData)
   });
}

function getHistorySource(cfg) {
   if (Env.constants.isBuildOnServer) {
      return createHistorySource(cfg);
   } else {
      HISTORY_SOURCE[cfg.historyId] = HISTORY_SOURCE[cfg.historyId] || createHistorySource(cfg);
   }
   return HISTORY_SOURCE[cfg.historyId];
}

function loadHistoryItems(historyConfig) {
   var source = getHistorySource(historyConfig);
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

function getUniqItems(items1, items2, keyProperty) {
   const uniqItems = factory(items2).filter((item) => {
      if (!items1.getRecordById(item.get(keyProperty))) {
         return item;
      }
   }).value();
   const resultItems = items1.clone();
   resultItems.prepend(uniqItems);
   return resultItems;
}

function prependNewItems(oldItems, newItems, sourceController, keyProperty) {
   const allCount = oldItems.getCount();
   const uniqItems = getUniqItems(oldItems, newItems, keyProperty);

   if (sourceController && sourceController.hasMoreData('down')) {
      uniqItems = factory(uniqItems).first(allCount).value(CollectionFactory.recordSet, {
         adapter: oldItems.getAdapter(),
         keyProperty: oldItems.getKeyProperty(),
         format: oldItems.getFormat(),
         model: oldItems.getModel()
      });
   }
   uniqItems.setMetaData(oldItems.getMetaData());
   return uniqItems;
}

function getItemsWithHistory(oldItems, newItems, sourceController, source, keyProperty) {
   let itemsWithHistory;
   const resultItems = prependNewItems(oldItems, newItems, sourceController, keyProperty);
   if (isHistorySource(source)) {
      itemsWithHistory = source.prepareItems(resultItems);
   } else {
      itemsWithHistory = resultItems;
   }
   return itemsWithHistory;
}

export {
   loadHistoryItems,
   getHistorySource,
   destroyHistorySource,
   isHistorySource,
   getItemsWithHistory,
   getUniqItems
};
