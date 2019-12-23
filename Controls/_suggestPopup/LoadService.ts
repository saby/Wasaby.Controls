import Deferred = require('Core/Deferred');
const COUNT_HISTORY_ITEMS = 12;
let HistoryService;

function createHistoryService(historyServiceLoad, config) {
   config.recent = config.recent || COUNT_HISTORY_ITEMS;

   return historyServiceLoad.callback(new HistoryService(config));
}

export default function (config) {
   let historyServiceLoad = new Deferred();

   if (HistoryService) {
      createHistoryService(historyServiceLoad, config);
   } else {
      require(['Controls/history'], function (history) {
         HistoryService = history.Service;
         createHistoryService(historyServiceLoad, config);
      });
   }

   return historyServiceLoad;
};
