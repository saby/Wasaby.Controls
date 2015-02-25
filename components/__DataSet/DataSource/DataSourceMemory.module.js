/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceMemory', [
   'js!SBIS3.CONTROLS.IDataSource',
   'js!SBIS3.CONTROLS.Record',
   'js!SBIS3.CONTROLS.DataSet',
   'js!SBIS3.CONTROLS.DataStrategyArray'
], function (IDataSource, Record, DataSet, DataStrategyArray) {
   'use strict';

   /**
    * Класс, реализующий интерфейс IDataSource, для работы с массивами как с источником данных
    */

   return IDataSource.extend({
      $protected: {
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
      $constructor: function () {

      },

      /**
       * Метод создает запись в источнике данных
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет js!SBIS3.CONTROLS.Record
       */
      create: function () {
         var def = new $ws.proto.Deferred(),
            strategy=new DataStrategyArray(),
            record = new Record(strategy);
         strategy.addRawRecord(this._options.data,this._options.keyField,record);
         def.callback(record);
         var self = this;
         def.addCallback(function(record){
            self._notify('onCreate');
            self._notify('onDataChange');
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
         var def = new $ws.proto.Deferred(),
         //TODO: переделать установку стратегии
            strategy = new DataStrategyArray();
         var record = new Record(strategy);
         // установка "сырых" данных для записи
         record.setRaw(strategy.findRawRecordByKey(this._options.data, this._options.keyField, id));
         def.callback(record);
         var self = this;
         def.addCallback(function(record){
            self._notify('onRead');
            self._notify('onDataChange');
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
         //TODO: переделать установку стратегии
            strategy = new DataStrategyArray();
         strategy.updateRawRecordByKey(this._options.data, this._options.keyField, record);
         def.callback(true);
         var self = this;
         def.addCallback(function(res){
            self._notify('onUpdate');
            self._notify('onDataChange');
            return res;
         });
         return def;
      },

      /**
       * Метод для удаления записи из источника данных
       * @param {Number} id - идентификатор записи
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет Boolean - результат успешности выполнения операции
       */
      destroy: function (id) {
         var def = new $ws.proto.Deferred(),
            strategy = new DataStrategyArray();
         strategy.destroy(this._options.data, this._options.keyField, id);
         def.callback(true);
         var self = this;
         def.addCallback(function(res){
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
            strategy = new DataStrategyArray(),
            data = strategy.query(this._options.data, filter, sorting, offset, limit);
         var DS = new DataSet({
            strategy: 'DataStrategyArray',
            data: data,
            keyField: this._options.keyField
         });
         def.callback(DS);
         var self = this;
         def.addCallback(function(res){
            self._notify('onDelete');
            return res;
         });
         return def;
      }


   });
});