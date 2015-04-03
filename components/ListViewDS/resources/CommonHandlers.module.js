/**
 * Created by am.gerasimov on 30.03.2015.
 */
define('js!SBIS3.CONTROLS.CommonHandlers',[],
   function() {
      var CommonHandlers = {
         deleteRecords: function(idArray) {
            var message = Array.isArray(idArray) &&  idArray.length !== 1 ? "Удалить записи?" : "Удалить текущую запись?",
               self = this;

            $ws.helpers.question(message).addCallback(function(res) {
               if(res) {
                  self._dataSet.removeRecord(idArray);
                  self._dataSource.sync(self._dataSet);
                  self.removeItemsSelectionAll();
               }
            })
         }
      };
      return CommonHandlers;
   });
