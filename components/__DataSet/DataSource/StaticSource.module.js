/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.StaticSource', [
   'js!SBIS3.CONTROLS.IDataSource',
   'js!SBIS3.CONTROLS.Record',
   'js!SBIS3.CONTROLS.DataSet'
], function (IDataSource, Record, DataSet) {
   'use strict';

   /**
    * Класс, реализующий интерфейс IDataSource, для работы с массивами как с источником данных
    */

   return IDataSource.extend({
      $protected: {
         _initialDataSet: undefined,
         _options: {
            /**
             * @cfg {Array} Исходный массив данных, с которым работает StaticSource
             */
            data: [],
            /**
             * @cfg {String} Название поля, являющегося первичных ключом
             */
            keyField: ''
         }
      },
      $constructor: function (cfg) {
         // неявно создадим начальный датасет, с которым будем работать дальше
         this._initialDataSet = new DataSet({
            strategy: this.getStrategy(),
            data: cfg.data,
            keyField: this._options.keyField
         });
      },

      sync: function (dataSet) {
         var self = this,
            syncCompleteDef = new $ws.proto.ParallelDeferred(),
            changedRecords = [];
         dataSet.each(function (record) {
            if (record.getMarkStatus() == 'changed') {
               syncCompleteDef.push(self.update(record));
               changedRecords.push(record);
            }
            if (record.getMarkStatus() == 'deleted') {
               syncCompleteDef.push(self.destroy(record.getKey()));
               changedRecords.push(record);
            }
         }, 'all');

         syncCompleteDef.done().getResult().addCallback(function(){
            self._notify('onDataSync', changedRecords);
         });

      },

      /**
       * Метод создает запись в источнике данных
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет js!SBIS3.CONTROLS.Record
       */
      create: function () {
         var def = new $ws.proto.Deferred(),
            record = new Record({
               strategy: this.getStrategy(),
               raw: {},
               keyField: this._options.keyField
            });
         def.callback(record);
         return def;
      },

      /**
       * Метод для чтения записи из массива по ее идентификатору
       * @param {Number} id - идентификатор записи
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет js!SBIS3.CONTROLS.Record
       */
      read: function (id) {
         var def = new $ws.proto.Deferred();
         def.callback(this._initialDataSet.getRecordByKey(id));
         return def;
      },

      /**
       * Метод для обновления записи в источнике данных
       * @param (SBIS3.CONTROLS.Record) record - измененная запись
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет Boolean - результат успешности выполнения операции
       */
      update: function (record) {
         var def = new $ws.proto.Deferred();
         def.callback(true);
         return def;
      },

      /**
       * Метод для удаления записи из источника данных
       * @param {Array | Number} id - идентификатор записи или массив идентификаторов
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет Boolean - результат успешности выполнения операции
       */
      destroy: function (id) {
         var def = new $ws.proto.Deferred(),
            strategy = this.getStrategy();
         strategy.destroy(this._options.data, this._options.keyField, id);
         def.callback(true);
         return def;
      },

      /**
       * Метод для получения набора записей из источника данных
       * Возможно применене фильтрации, сортировки и выбора определенного количества записей с заданной позиции
       * @param {Object} filter - {property1: value, property2: value}
       * @param {Array} sorting - [{property1: 'ASC'},{property2: 'DESC'}]
       * @param {Number} offset смещение начала выборки
       * @param {Number} limit количество возвращаемых записей
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет js!SBIS3.CONTROLS.DataSet - набор отобранных элементов
       */
      query: function (filter, sorting, offset, limit) {

         var def = new $ws.proto.Deferred(),
            strategy = this.getStrategy(),
         /*TODO непонятно пока, кажется что метода query в стратегии быть не должно*/
            data = strategy.query(this._options.data, filter, sorting, offset, limit);

         var DS = new DataSet({
            strategy:strategy,
            data: data,
            keyField: this._options.keyField
         });
         var meta = strategy.getMetaData(this._options.data);
         def.callback(DS, meta);
         return def;
      }


   });
});