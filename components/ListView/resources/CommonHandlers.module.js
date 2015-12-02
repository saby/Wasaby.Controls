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

            return $ws.helpers.question(message).addCallback(function(res) {
               if(res) {
                  self._dataSet.removeRecord(idArray);
                  self.removeItemsSelection(isArray ? idArray : [idArray]);
                  return self._dataSource.sync(self._dataSet).addCallback(function () {
                     if ($ws.helpers.instanceOfModule(self, 'SBIS3.CONTROLS.TreeCompositeView') && self.getViewMode() === 'table') {
                        self.partialyReload(isArray ? idArray : [idArray]);
                     } else {
                        self.reload();
                     }
                  });
               }
            })
         },
         editItems: function(tr, id) {
            this.sendCommand('activateItem', id);
         },
         moveRecordDown: function(tr, id, record) {
            var nextItem = this._getNextItemById(id),
               nextId = nextItem.data('id');
            moveRecord.call(this, record, nextId, id, {after: nextId});
         },
         moveRecordUp: function(tr, id, record) {
            var prevItem = this._getPrevItemById(id),
               prevId = prevItem.data('id');
            moveRecord.call(this, record, prevId, id, {before: prevId});
         }
      };
      function moveRecord(itemRecord, moveTo, current, config){
         var self = this,
            deferred;
         if ($ws.helpers.instanceOfMixin(this.getDataSource(), 'SBIS3.CONTROLS.Data.Source.ISource')) {
            deferred =  this.getDataSource().move(itemRecord,
               moveTo,
               config
            );
         } else {
            deferred = this.getDataSource().move(itemRecord,
               undefined,
               undefined,
               config
            );
         }
         deferred.addCallback(function(){
            self._moveItemTo(current, moveTo, config.before ? true : false);
         }).addErrback(function(e){
            $ws.core.alert(e.message);
         });

      }
      return CommonHandlers;
   });
