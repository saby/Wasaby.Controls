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
                  self.getDataSet().removeRecord(idArray);
                  self.removeItemsSelection(isArray ? idArray : [idArray]);
                  return self.getDataSource().sync(self.getDataSet()).addCallback(function () {
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
            this.sendCommand('ActivateItem', id);
         },
         moveRecordDown: function(item) {
            var id = item.data('id'),
               nextItem = this.getNextItemById(id),
               itemRecord = this.getDataSet().getRecordByKey(id),
               nextId = nextItem.data('id');
            moveRecord.call(this, itemRecord, nextId, id, {after: nextId});
         },
         moveRecordUp: function(item) {
            var id = item.data('id'),
               prevItem = this.getPrevItemById(id),
               itemRecord = this.getDataSet().getRecordByKey(id),
               prevId = prevItem.data('id');
            moveRecord.call(this,itemRecord, prevId, id, {before: prevId});
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
            self.partialyReload([current, moveTo]);
         }).addErrback(function(e){
            $ws.core.alert(e.message);
         });

      }
      return CommonHandlers;
   });
