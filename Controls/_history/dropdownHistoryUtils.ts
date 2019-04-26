import coreInstance = require('Core/core-instance');
import Merge = require('Core/core-merge');


function getMetaHistory() {
   return {
      $_history: true
   };
}

function isHistorySource(source) {
   return coreInstance.instanceOfModule(source, 'Controls/history:Source');
}

function getFilter(filter, source) {
   // TODO: Избавиться от проверки, когда будет готово решение задачи https://online.sbis.ru/opendoc.html?guid=e6a1ab89-4b83-41b1-aa5e-87a92e6ff5e7
   if (isHistorySource(source)) {
      return Merge(getMetaHistory(), filter || {});
   }
   return filter;
}

export = {
   getSourceFilter: getFilter,
   isHistorySource: isHistorySource,
   getMetaHistory: getMetaHistory
};
