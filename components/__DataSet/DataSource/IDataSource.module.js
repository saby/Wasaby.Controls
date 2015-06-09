/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.IDataSource', [], function () {
   'use strict';

   /**
    * Интерфейс предназначен для работы с источником данных
    * @author Мануйлов Андрей
    * @public
    */

   return $ws.proto.Abstract.extend({
       /**
        * @event onCreate При создании записи в источнике данных
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @see create
        */
       /**
        * @event onRead При чтении
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {Number} id Идентификатор вычитываемой записи.
        * @see read
        */
       /**
        * @event onUpdate При перезагрузке
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param (SBIS3.CONTROLS.Record) record Измененная запись.
        * @see update
        */
       /**
        * @event onDestroy При удалении записи из источника данных
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {Array | Number} id Идентификатор или массив идентификаторов удаляемых записей.
        * @see destroy
        */
       /**
        * @event onQuery При получении набора записей из источника данных
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @see query
        */
       /**
        * @event onDataChange При изменении данных
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        */
      /**
       * @event onDataSync При изменении синхронизации данных с источником
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param (SBIS3.CONTROLS.Record[]) records Измененные записи
       */
      $protected: {
         _options: {
             /**
              * @cfg {Object} Объект стратегии работы с данными
              * @example
              * <pre>
              *     <option name="strategy">ArrayStrategy</option>
              * </pre>
              * @variant ArrayStrategy
              * @variant SbisJSONStrategy
              * @see getStrategy
              */
            strategy: null
         }
      },

      $constructor: function () {
         this._publish('onCreate', 'onRead', 'onUpdate', 'onDestroy', 'onQuery', 'onDataChange', 'onDataSync');
      },

      /**
       * Метод получения объекта стратегии работы с данными.
       * @returns {Object} Объект стратегии работы с данными.
       * @see strategy
       */
      getStrategy: function () {
         return this._options.strategy;
      },

      /**
       * Cинхронизирует набор данных или запись с источником данных.
       * @param {SBIS3.CONTROLS.DataSet|SBIS3.CONTROLS.Record} data Набор данных или запись.
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения.
       */
      sync: function (data) {
         var self = this,
             def;
         if ($ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Record')) {
            def = this._syncRecord(data);
         } else {
            def = this._syncDataSet(data);
         }
         def = def || $ws.proto.Deferred.success(false);

         def.addCallback(function() {
            self._notify('onDataSync');
         });

         return def;
      },

      /**
       * Cинхронизирует набор данных с источником данных.
       * @param {SBIS3.CONTROLS.DataSet} dataSet Набор данных.
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения.
       */
      _syncDataSet: function (dataSet) {
         var self = this,
             syncCompleteDef = new $ws.proto.ParallelDeferred();
         dataSet.each(function(record) {
            var syncResult = self._syncRecord(record);
            if (syncResult !== undefined) {
               syncCompleteDef.push(syncResult);
            }
         }, 'all');
         syncCompleteDef.done();

         return syncCompleteDef.getResult();
      },

      /**
       * Cинхронизирует запись с источником данных.
       * @param {SBIS3.CONTROLS.Record} record Запись.
       * @returns {$ws.proto.Deferred|undefined} Асинхронный результат выполнения. В колбэке придет результат выполненной операции.
       */
      _syncRecord: function (record) {
         var syncResult;
         if (record.isDeleted()) {
            //Удаляем запись, если она уже есть в источнике.
            if (record.isCreated()) {
               syncResult = this.destroy(record.getKey());
            }
         } else if (!record.isCreated() || record.isChanged()) {
            //Обновление, в т.ч. записи, полученной не из источника
            syncResult = this.update(record);
         }

         return syncResult;
      },

      /**
       * Метод создания запись в источнике данных.
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет SBIS3.CONTROLS.Record.
       * @see onCreate
       */
      create: function () {
         /*Method must be implemented*/
      },

      /**
       * Метод для чтения записи из источника данных по её идентификатору.
       * @param {Number} id Идентификатор записи.
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет SBIS3.CONTROLS.Record.
       * @see onRead
       */
      read: function (id) {
         /*Method must be implemented*/
      },

      /**
       * Метод для обновления записи в источнике данных.
       * @param (SBIS3.CONTROLS.Record) record Измененная запись.
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придёт Boolean - результат успешности выполнения операции.
       * @see onUpdate
       */
      update: function (record) {
         /*Method must be implemented*/
      },

      /**
       * Метод для удаления записи из источника данных.
       * @param {Array | Number} id Идентификатор записи или массив идентификаторов.
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придёт Boolean - результат успешности выполнения операции.
       * @see onDestroy
       */
      destroy: function (id) {
         /*Method must be implemented*/
      },

      /**
       * Метод для получения набора записей из источника данных.
       * Возможно применение фильтрации, сортировки и выбора определённого количества записей с заданной позиции.
       * @param {Object} filter Параметры фильтрации вида - {property1: value, property2: value}.
       * @param {Array} sorting Параметры сортировки вида - [{property1: 'ASC'}, {property2: 'DESC'}].
       * @param {Number} offset Смещение начала выборки.
       * @param {Number} limit Количество возвращаемых записей.
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придёт SBIS3.CONTROLS.DataSet - набор отобранных элементов.
       * @see onQuery
       */
      query: function (filter, sorting, offset, limit) {
         /*Method must be implemented*/
      }

   });
});