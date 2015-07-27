/**
 * Created by as.suhoruchkin on 21.07.2015.
 */
define('js!SBIS3.CONTROLS.MoveHandlers', ['js!SBIS3.CONTROLS.MoveDialog'], function(MoveDialog) {
   var MoveHandlers = {
      moveRecordsWithDialog: function() {
         new MoveDialog({
            linkedView: this
         });
      },
      selectedMoveTo: function(moveTo) {
         this._move(this.getSelectedKeys(), moveTo);
      },
      _move: function(records, moveTo) {
         var
            record,
            self = this,
            /*TODO переделать не на ParallelDeferred*/
            deferred = new $ws.proto.ParallelDeferred();
         if (this._checkRecordsForMove(records, moveTo)) {
            for (var i = 0; i < records.length; i++) {
               record = this._dataSet.getRecordByKey(records[i]);
               deferred.push(this._dataSource.move(record, this._options.hierField, [moveTo]));
            }
            deferred.done().getResult().addCallback(function() {
               if (deferred.getResult().isSuccessful()) {
                  self.removeItemsSelectionAll();
                  //TODO hotFix
                  self.reload();
                  self.setCurrentRoot(moveTo);
               }
            });
         }
      },
      _checkRecordsForMove: function(records, moveTo) {
         var record;
         if (moveTo === undefined) {
            return false;
         }
         if ($.inArray(moveTo, records) !== -1) {
            $ws.helpers.alert("Вы не можете переместить запись саму в себя!", {}, this);
            return false;
         }
         if (moveTo !== null) {
            record = this._dataSet.getRecordByKey(moveTo);
            if (!record.get(this._options.hierField + '@')) {
               $ws.helpers.alert('Вы не можете перемещать в лист! Выберите другую запись для перемещения!', {}, this);
               return false;
            }
         }
         return true;
      }
   };
   return MoveHandlers;
});