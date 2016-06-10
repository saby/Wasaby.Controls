/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Synchronizer', [
   'js!SBIS3.CONTROLS.Data.Record',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator'
], function (Record, ArrayEnumerator) {
   'use strict';

   var RecordState = Record.RecordState,
      RecordStateSerialized = {},
      stateField;

   RecordStateSerialized[RecordState.UNCHANGED] = 0;
   RecordStateSerialized[RecordState.CHANGED] = 1;
   RecordStateSerialized[RecordState.ADDED] = 2;
   RecordStateSerialized[RecordState.DELETED] = 3;
   RecordStateSerialized[RecordState.DETACHED] = 4;

   stateField = {
      name: '__state__',
      type: 'integer',
      defaultValue: RecordStateSerialized[RecordState.UNCHANGED]
   };

   /**
    * Синхронизатор данных и источника.
    * @class SBIS3.CONTROLS.Data.Source.Synchronizer
    * @public
    * @author Мальцев Алексей
    */

   var Synchronizer = /** @lends SBIS3.CONTROLS.Data.Source.Synchronizer.prototype */{
      /**
       * @typedef {Number} RecordStateSerialized
       * @variant 0 Запись не была изменена.
       * @variant 1 Запись была изменена
       * @variant 2 Запись была добавлена
       * @variant 3 Запись была удалена
       * @variant 4 Запись не была вставлена
       */

      _moduleName: 'SBIS3.CONTROLS.Data.Source.Synchronizer',

      //region Public methods

      /**
       * Синхронизирует запись с источником данных.
       * Синхронизация производится исходя из значения свойства {@link SBIS3.CONTROLS.Data.Record#state} по следующим правилам:
       * <ul>
       * <li>Added, Changed обновляются через вызов {@link SBIS3.CONTROLS.Data.Source.ISource#update};</li>
       * <li>Deleted удаляются через вызов {@link SBIS3.CONTROLS.Data.Source.ISource#destroy} (для корректного удаления в источнике данных должна быть заполенена опция {@link SBIS3.CONTROLS.Data.Source.ISource#idProperty});</li>
       * </ul>
       * После успешного вызова метода источника данных производится вызов {@link SBIS3.CONTROLS.Data.Record#acceptChanges}.
       * @param {SBIS3.CONTROLS.Data.Record} record Запись.
       * @param {SBIS3.CONTROLS.Data.Source.ISource} dataSource Источник данных.
       * @return {$ws.proto.Deferred} Асинхронный результат выполнения.
       * @static
       */
      record: function (record, dataSource) {
         var result;
         switch(record.getState()) {
            case RecordState.ADDED:
            case RecordState.CHANGED:
               result = dataSource.update(record);
               break;
            case RecordState.DELETED:
               result = dataSource.destroy(record.get(
                  dataSource.getIdProperty()
               ));
               break;
            default:
               result = $ws.proto.Deferred.success();
         }

         result.addCallback(function() {
            record.acceptChanges();
         });

         return result;
      },

      /**
       * Синхронизирует коллекцию записей с источником данных.
       * Вызывает {@link record} для каждой записи коллекции.
       * @param {SBIS3.CONTROLS.Data.Collection.IEnumerable.<SBIS3.CONTROLS.Data.Record>|Array.<SBIS3.CONTROLS.Data.Record>} records Коллекция записей.
       * @param {SBIS3.CONTROLS.Data.Source.ISource} dataSource Источник данных.
       * @return {$ws.proto.Deferred} Асинхронный результат выполнения.
       * @static
       */
      collection: function (records, dataSource) {
         var result = new $ws.proto.ParallelDeferred(),
            isEnumerable = records && $ws.helpers.instanceOfMixin(records, 'SBIS3.CONTROLS.Data.Collection.IEnumerable'),
            enumerator,
            record,
            index,
            state;
         if (isEnumerable) {
            enumerator = records.getEnumerator();
         } else if (records instanceof Array) {
            enumerator = new ArrayEnumerator(records);
         } else {
            throw new TypeError('Argument "records" should be an instance of Array or should implement SBIS3.CONTROLS.Data.Collection.IEnumerable');
         }

         var handler = function(state, index) {
            switch(state) {
               case RecordState.DELETED:
                  if (isEnumerable) {
                     records.removeAt(index);
                  } else {
                     records.splice(index, 1);
                  }
                  break;
            }
         };

         index = 0;
         while ((record = enumerator.getNext())) {
            state = record.getState();
            result.push(
               this.record(record, dataSource).addCallback(handler.bind(record, state, index))
            );
            index++;
         }

         result.done(true);
         return result.getResult(true);
      },

      /**
       * Синхронизирует рекордсет с источником данных.
       * Синхронизация выполняется только если в рекордсете есть записи с состоянием Added, Changed или Deleted.
       * Синхронизация производится через вызов {@link SBIS3.CONTROLS.Data.Source.ISource#update}. При этом в рекордсет
       * добавлятеся служебное поле "__state__" типа {@link RecordStateSerialized}, содержащее состояние каждой записи.
       * После успешного вызова метода источника данных производится вызов {@link SBIS3.CONTROLS.Data.Collection.RecordSet#acceptChanges}.
       * @param {SBIS3.CONTROLS.Data.Collection.RecordSet} recordSet Рекордсет.
       * @param {SBIS3.CONTROLS.Data.Source.ISource} dataSource Источник данных.
       * @return {$ws.proto.Deferred} Асинхронный результат выполнения.
       * @static
       */
      recordSet: function (recordSet, dataSource) {
         var hasChanges = false,
            result;
         recordSet.each(function(record) {
            switch(record.getState()) {
               case RecordState.ADDED:
               case RecordState.CHANGED:
               case RecordState.DELETED:
                  hasChanges = true;
                  break;
            }
         });

         if (hasChanges) {
            this._addRecordSetStateData(recordSet);
            result = dataSource.update(recordSet);
            this._removeRecordSetStateData(recordSet);

            result.addCallback(function() {
               recordSet.acceptChanges();
            });
         } else {
            result = $ws.proto.Deferred.success();
         }

         return result;
      },

      //endregion Public methods

      //region Protected methods

      _addRecordSetStateData: function (recordSet) {
         var hasField = false;
         try {
            recordSet.removeField(stateField.name);
         } catch(e) {
            hasField = true;
         }

         recordSet.addField(stateField);
         recordSet.each(function(record) {
            record.set(
               stateField.name,
               RecordStateSerialized[record.getState()]
            );
         });

         return !hasField;
      },

      _removeRecordSetStateData: function (recordSet) {
         var hasField = false;
         try {
            recordSet.removeField(stateField.name);
         } catch(e) {
            hasField = true;
         }

         return hasField;
      }

      //endregion Protected methods
   };

   Synchronizer.RecordStateSerialized = RecordStateSerialized;

   return Synchronizer;
});
