/**
 * Created by am.gerasimov on 30.03.2015.
 */
define('js!SBIS3.CONTROLS.CommonHandlers',['i18n!SBIS3.CONTROLS.CommonHandlers'],
   function() {
      var CommonHandlers = {
         deleteRecords: function(idArray, message) {
            var self = this;
            idArray = Array.isArray(idArray) ? idArray : [idArray];
            message = message || (idArray.length !== 1 ? rk("Удалить записи?") : rk("Удалить текущую запись?"));
            return $ws.helpers.question(message).addCallback(function(res) {
               if (res) {
                  self._toggleIndicator(true);
                  return self._dataSource.destroy(idArray).addCallback(function () {
                     self.removeItemsSelection(idArray);
                     if ($ws.helpers.instanceOfModule(self, 'SBIS3.CONTROLS.TreeCompositeView') && self.getViewMode() === 'table') {
                        self.partialyReload(idArray);
                     } else {
                        self.reload();
                     }
                  }).addErrback(function(result) {
                     $ws.helpers.alert(result)
                  }).addBoth(function() {
                     self._toggleIndicator(false);
                  });
               }
            });
         },
         editItems: function(tr, id) {
            this.sendCommand('activateItem', id);
         }
      };

      return CommonHandlers;
   });
