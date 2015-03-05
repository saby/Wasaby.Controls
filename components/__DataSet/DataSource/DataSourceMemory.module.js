/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceMemory', [
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
             * @cfg {Array} Исходный массив данных, с которым работает DataSourceMemory
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
         var self = this;
         dataSet.each(function (record) {
            if (record.getMarkStatus() == 'changed') {
               self.update(record);
            }
            if (record.getMarkStatus() == 'deleted') {
               self.destroy(record.getKey());
            }
         }, 'all');
         self._notify('onDataSync');
         //TODO: нотификация о завершении синхронизации
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
         var self = this;
         def.addCallback(function (record) {
            self._notify('onCreate');
            return record;
         });
         return def;
      },

      /**
       * Метод для чтения записи из массива по ее идентификатору
       * @param {Number} id - идентификатор записи
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет js!SBIS3.CONTROLS.Record
       */
      read: function (id) {
         var self = this,
            def = new $ws.proto.Deferred();
         def.callback(this._initialDataSet.getRecordByKey(id));
         def.addCallback(function (record) {
            self._notify('onRead');
            return record;
         });
         return def;
      },

      /**
       * Метод для обновления записи в источнике данных
       * @param (SBIS3.CONTROLS.Record) record - измененная запись
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет Boolean - результат успешности выполнения операции
       */
      update: function (record) {
         var def = new $ws.proto.Deferred(),
            strategy = this.getStrategy();
         strategy.updateRawRecordByKey(this._options.data, this._options.keyField, record);
         def.callback(true);
         var self = this;
         def.addCallback(function (res) {
            self._notify('onUpdate');
            self._notify('onDataChange');
            return res;
         });
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
         var self = this;
         def.addCallback(function (res) {
            self._notify('onDestroy');
            self._notify('onDataChange');
            return res;
         });
         return def;
      },

      /**
       * Метод для получения набора записей из источника данных
       * Возможно применене фильтрации, сортировки и выбора определенного количества записей с заданной позиции
       * @param {Array} filter - [{property1: value},{property2: value}]
       * @param {Array} sorting - [{property1: 'ASC'},{property2: 'DESC'}]
       * @param {Number} offset смещение начала выборки
       * @param {Number} limit количество возвращаемых записей
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет js!SBIS3.CONTROLS.DataSet - набор отобранных элементов
       */
      query: function (filter, sorting, offset, limit) {

         var def = new $ws.proto.Deferred(),
         //TODO: переделать установку стратегии
            strategy = this.getStrategy(),
            data = strategy.query(this._options.data, filter, sorting, offset, limit);

         var DS = new DataSet({
            strategy: this.getStrategy(),
            data: data,
            keyField: this._options.keyField
         });
         def.callback(DS);
         return def;
      }


   });
});