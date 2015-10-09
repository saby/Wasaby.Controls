/**
 * Created by as.suhoruchkin on 21.07.2015.
 */
define('js!SBIS3.CONTROLS.MoveHandlers', ['js!SBIS3.CONTROLS.MoveDialog'], function(MoveDialog) {
   var MoveHandlers = {
      moveRecordsWithDialog: function(records) {
         records = this._getRecordsForMove(records);
         if (records.length) {
            new MoveDialog({
               linkedView: this,
               records: records
            });
         }
      },
      _getRecordsForMove: function(records) {
         if (!Array.isArray(records) || !records.length) {
            records = this.getSelectedKeys().length ? this.getSelectedKeys() :
               this.getSelectedKey() ? [this.getSelectedKey()] : [];
         }
         return records;
      },
      selectedMoveTo: function(moveTo) {
         this._move(this._selectedRecords, moveTo);
      },
      _move: function(records, moveTo) {
         var
            record,
            self = this,
            /*TODO переделать не на ParallelDeferred*/
            deferred = new $ws.proto.ParallelDeferred();
         if (this._checkRecordsForMove(records, moveTo)) {
            for (var i = 0; i < records.length; i++) {
               record = typeof records[i] === 'number' ? this._dataSet.getRecordByKey(records[i]) : records[i];
               deferred.push(this._dataSource.move(record, this._options.hierField, moveTo));
            }
            deferred.done().getResult().addCallback(function() {
               if (deferred.getResult().isSuccessful()) {
                  self.removeItemsSelectionAll();
                  self.setCurrentRoot(moveTo);
                  self.reload();
               }
            });
         }
      },
      _checkRecordsForMove: function(records, moveTo) {
         var
            record,
            keyField = this._dataSet._keyField;
         if (moveTo === undefined) {
            return false;
         }
         for (var i = 0; i < records.length; i++) {
            if (typeof records[i] === 'number' && records[i] === moveTo ||
                typeof records[i] === 'object' && records[i].get(keyField)[0] === moveTo) {
               $ws.helpers.alert("Вы не можете переместить запись саму в себя!", {}, this);
               return false;
            }
         }
         if (moveTo !== null) {
            record = this._dataSet.getRecordByKey(moveTo);
            if (record && !record.get(this._options.hierField + '@')) {
               $ws.helpers.alert('Вы не можете перемещать в лист! Выберите другую запись для перемещения!', {}, this);
               return false;
            }
         }
         return true;
      }
   };
   return MoveHandlers;
});