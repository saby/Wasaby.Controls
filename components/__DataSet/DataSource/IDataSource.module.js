/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.IDataSource', [], function () {
   'use strict';

   /**
    * Интерфейс предназначен для работы с источником данных
    * @author Мануйлов Андрей
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
         this._publish('onCreate', 'onRead', 'onUpdate', 'onDestroy', 'onQuery', 'onDataChange');
      },
      /**
       * Метод получения объекта стратегии работы с данными.
       * @returns {Object} Объект стратегии работы с данными.
       * @see strategy
       */
      getStrategy: function () {
         return this._options.strategy;
      },

      //TODO: учесть, что тут может быть много изменений и надо стрелять событием только раз
      sync: function (dataSet) {

      },

      /**
       * Метод создания запись в источнике данных.
       * @see onCreate
       */
      create: function () {
         /*Method must be implemented*/
      },

      /**
       * Метод для чтения записи из источника данных по её идентификатору.
       * @param {Number} id Идентификатор записи.
       * @see onRead
       */
      read: function (id) {
         /*Method must be implemented*/
      },

      /**
       * Метод для обновления записи в источнике данных.
       * @param (SBIS3.CONTROLS.Record) record Измененная запись.
       * @see onUpdate
       */
      update: function (record) {
         /*Method must be implemented*/
      },

      /**
       * Метод для удаления записи из источника данных.
       * @param {Array | Number} id Идентификатор записи или массив идентификаторов.
       * @see onDestroy
       */
      destroy: function (id) {
         /*Method must be implemented*/
      },
      /**
       * Метод для получения набора записей из источника данных.
       * Возможно применение фильтрации, сортировки и выбора определённого количества записей с заданной позиции.
       * @param {Object} filter - {property1: value, property2: value}
       * @param {Array} sorting - [{property1: 'ASC'},{property2: 'DESC'}]
       * @param {Number} offset Смещение начала выборки.
       * @param {Number} limit Количество возвращаемых записей.
       * @see onQuery
       */
      query: function (filter, sorting, offset, limit) {
         /*Method must be implemented*/
      }

   });
});