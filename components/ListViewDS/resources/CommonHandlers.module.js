/**
 * Created by am.gerasimov on 30.03.2015.
 */
define('js!SBIS3.CONTROLS.CommonHandlers',[],
   function() {
      var CommonHandlers = {
         deleteRecords: function(idArray) {
            var
               isArray = Array.isArray(idArray),
               message = isArray &&  idArray.length !== 1 ? "Удалить записи?" : "Удалить текущую запись?",
               self = this;

            $ws.helpers.question(message).addCallback(function(res) {
               if(res) {
                  self._dataSet.removeRecord(idArray);
                  self.removeItemsSelection(isArray ? idArray : [idArray]);
                  self._dataSource.sync(self._dataSet).addCallback(function() {
                     self.reload();
                  });
               }
            })
         }
      };
      return CommonHandlers;
   });
