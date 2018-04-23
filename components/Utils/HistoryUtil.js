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
         var saveHistory = this.getHistory(id);
         var isEqual = true;
         var hRows, vRows, hRecord, vRecord;

         if (saveHistory && value) {
            hRows = saveHistory.getRow();
            vRows = value.getRow();
            this.historyType.forEach(function(type) {
               hRecord = hRows.get(type);
               vRecord = vRows.get(type);
               if (hRecord && vRecord && !hRecord.isEqual(vRecord)) {
                  isEqual = false;
               }
            });
         } else {
            isEqual = false;
         }
         return isEqual;
      }

   };
});
