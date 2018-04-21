define('SBIS3.CONTROLS/History/HistoryListUtils', [
   'SBIS3.CONTROLS/History/HistoryList'
], function(HistoryList) {

   return {
      getHistoryList: function(historyId, isFavorite, isGlobal) {
         if(isFavorite && !isGlobal) {
            historyId += '-favorite';
         }

         return new HistoryList({
            historyId: historyId,
            isGlobalUserConfig: !!isGlobal
         });
      },
      getHistoryLists: function(historyId) {
         var
            result = {},
            self = this,
            historyLists = [{name: 'list', args: []}, {name: 'favoriteList', args: [true]}, {name: 'globalList', args: [false, true]}];

         historyLists.forEach(function(value) {
            value.args.unshift(historyId);
            result[value.name] = self.getHistoryList.apply(self, value.args);
         });

         return result;
      },
      hasHistory: function(historyId) {
         var
            result = false,
            historyLists = this.getHistoryLists(historyId);

         for (var listName in historyLists) {
            if (historyLists.hasOwnProperty(listName)) {
               var historyList = historyLists[listName].getHistory();
               result |= historyList.getCount();
            }
         }

         return result;
      }
   };
});