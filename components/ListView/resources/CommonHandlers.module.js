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
               self = this,
               reloadChanges = function() {
                  if ($ws.helpers.instanceOfModule(self, 'SBIS3.CONTROLS.TreeCompositeView') && self.getViewMode() === 'table') {
                     self.partialyReload(isArray ? idArray : [idArray]);
                  } else {
                     self.reload();
                  }
               };

            return $ws.helpers.question(message).addCallback(function(res) {
               if(res) {
                  self._dataSet.removeRecord(idArray);
                  self.removeItemsSelection(isArray ? idArray : [idArray]);

                  //TODO: remove switch after migration to SBIS3.CONTROLS.Data.Source.ISource
                  if ($ws.helpers.instanceOfMixin(self._dataSource, 'SBIS3.CONTROLS.Data.Source.ISource')) {
                     return self._dataSet.saveChanges().addCallback(function () {
                        reloadChanges();
                     });
                  } else {
                     return self._dataSource.sync(self._dataSet).addCallback(function () {
                        reloadChanges();
                     });
                  }
               }
            });
         }
      };
      return CommonHandlers;
   });
