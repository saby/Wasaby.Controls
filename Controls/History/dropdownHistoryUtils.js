define('Controls/History/dropdownHistoryUtils',
   [
      'Controls/History/Source',
      'Core/core-merge'
   ],
   function(historySource, Merge) {
      'use strict';

      function getMetaHistory() {
         return {
            $_history: true
         };
      }

      function isHistorySource(source) {
         return source instanceof historySource;
      }

      function getFilter(filter, source) {
         // TODO: Избавиться от проверки, когда будет готово решение задачи https://online.sbis.ru/opendoc.html?guid=e6a1ab89-4b83-41b1-aa5e-87a92e6ff5e7
         if (isHistorySource(source)) {
            return Merge(getMetaHistory(), filter || {});
         }
         return filter;
      }

      return {
         getSourceFilter: getFilter,
         isHistorySource: isHistorySource,
         getMetaHistory: getMetaHistory
      };
   });
