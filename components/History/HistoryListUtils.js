define('SBIS3.CONTROLS/History/HistoryListUtils', [
   'SBIS3.CONTROLS/History/HistoryList',
   'Core/ParallelDeferred',
   'Core/Deferred'
], function(HistoryList, ParallelDeferred, Deferred) {

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
               result |= historyLists[listName].getCount();
            }
         }

         return result;
      },
   
      loadHistoryLists: function(self, historyId) {
         var loadDef = new ParallelDeferred();
         var lists = this.getHistoryLists(historyId);
   
         if (!self._historyLists) {
            for (var list in lists) {
               if (lists.hasOwnProperty(list)) {
                  loadDef.push(lists[list].getHistory(true));
               }
            }
            
            return loadDef.done().getResult().addCallback(function () {
               self._historyLists = lists;
               return lists;
            });
         } else {
            return Deferred.success(self._historyLists);
         }
      }
   };
});