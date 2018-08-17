define('SBIS3.CONTROLS/Utils/HistoryUtil', function() {
   return {
      historyType: ['pinned', 'frequent', 'recent'],
      _historyIds: {},

      getHistory: function(id) {
         return this._historyIds[id];
      },

      setHistory: function(id, value) {
         this._historyIds[id] = value;
      },

      isEqualHistory: function(id, value) {
         var savedHistory = this.getHistory(id);
         var isEqual = true;
         var hRows, vRows, hRecordSet, vRecordSet;
         
         var isItemsIdsEqual = function(firstItem, secondItem) {
            var firstItemId = firstItem && firstItem.getId();
            var secondItemId = secondItem && secondItem.getId();
            
            return firstItemId === secondItemId;
         };

         if (savedHistory && value) {
            hRows = savedHistory.getRow();
            vRows = value.getRow();
            this.historyType.forEach(function(type) {
               hRecordSet = hRows.get(type);
               vRecordSet = vRows.get(type);
               
               if (hRecordSet && vRecordSet) {
                  /* Т.к. нам важен лиш порядок записей и само наличие записи, то проверяем по этим признакам,
                     а не полностью сравниваем рекордсеты. */
                  hRecordSet.forEach(function(item, index) {
                     if (isEqual) {
                        isEqual = isItemsIdsEqual(item, vRecordSet.at(index));
                     }
                  });
               }
            });
         } else {
            isEqual = false;
         }
         return isEqual;
      }

   };
});
