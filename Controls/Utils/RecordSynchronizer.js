/**
 * Created by as.krasilnikov on 21.09.2018.
 */
define('Controls/Utils/RecordSynchronizer', [
   'WS.Data/Entity/Record',
   'WS.Data/Di'
], function(Record, Di) {
   'use strict';

   var _private = {
      createRecord: function(editRecord, items) {
         var syncRecord;

         syncRecord = Di.resolve(items.getModel(), {
            adapter: items.getAdapter(),
            format: items.getFormat(),
            idProperty: items.getIdProperty()
         });

         var changedValues = _private.getChangedValues(syncRecord, editRecord);
         _private.setRecordValues(syncRecord, changedValues);

         return syncRecord;
      },

      getSyncRecord: function(items, editKey) {
         var index = items.getIndexByValue(items.getIdProperty(), editKey);
         return items.at(index);
      },
      getChangedValues: function(syncRecord, editRecord) {
         var newValues = {};
         var recValue;

         Record.prototype.each.call(syncRecord, function(key, value) {
            if (editRecord.has(key)) {
               recValue = editRecord.get(key);

               if (recValue !== value && key !== editRecord.getIdProperty()) {
                  // clone the model, flags, etc because when they lose touch with the current record, the edit can still continue.
                  if (recValue && (typeof recValue.clone === 'function')) {
                     recValue = recValue.clone();
                  }
                  newValues[key] = recValue;
               }
            }
         });

         return newValues;
      },
      setRecordValues: function(record, values) {
         // The property may not have a setter
         try {
            record.set(values);
         } catch (e) {
            if (!(e instanceof ReferenceError)) {
               throw e;
            }
         }
      }
   };

   return {
      addRecord: function(editRecord, additionalData, items) {
         var newRecord = _private.createRecord(editRecord, items);
         var at = additionalData.at || 0;

         if (additionalData.isNewRecord) {
            newRecord.set(items.getIdProperty(), additionalData.key);
         }

         items.add(newRecord, at);
      },

      mergeRecord: function(editRecord, items, editKey) {
         var syncRecord = _private.getSyncRecord(items, editKey);
         var changedValues = _private.getChangedValues(syncRecord, editRecord);

         _private.setRecordValues(syncRecord, changedValues);
      },

      deleteRecord: function(items, editKey) {
         var syncRecord = _private.getSyncRecord(items, editKey);
         items.remove(syncRecord);
      }
   };
});
