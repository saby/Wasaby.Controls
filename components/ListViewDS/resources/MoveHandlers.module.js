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
      _selectedMoveTo: function(moveTo) {
         this._move(this.getSelectedKeys(), moveTo);
      },
      _move: function(records, moveTo) {
         var
            record,
            /*TODO переделать не на ParallelDeferred*/
            deferred = new $ws.proto.ParallelDeferred();
         if (this._checkRecordsForMove(records, moveTo)) {
            for (var i = 0; i < records.length; i++) {
               record = this._dataSet.getRecordByKey(records[i]);
               deferred.push(this._dataSource.move(record, this._options.hierField, [moveTo]));
            }
            if (deferred.done().getResult().isSuccessful()) {
               this.removeItemsSelectionAll();
               this.setCurrentRoot(moveTo);
            }
         }
      },
      _checkRecordsForMove: function(records, moveTo) {
         if (moveTo === undefined) {
            return false;
         }
         if ($.inArray(moveTo, records) !== -1) {
            $ws.helpers.alert("Вы не можете переместить запись саму в себя!", {}, this);
            return false;
         }
         return true;
      }
   };
   return MoveHandlers;
});