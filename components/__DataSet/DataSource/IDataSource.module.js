/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.IDataSource', [], function () {
   'use strict';

   /**
    * Интерфейс предназначен для работы с источником данных
    */

   return $ws.proto.Abstract.extend({
      $protected: {
         _options: {
            strategy: null
         }
      },
      $constructor: function () {
         this._publish('onCreate', 'onRead', 'onUpdate', 'onDestroy', 'onQuery', 'onDataChange');
      },
      /**
       * Получить объект стратегии работы с данными
       * @returns {Object}
       */
      getStrategy: function () {
         return this._options.strategy;
      },

      //TODO: учесть, что тут может быть много изменений и надо стрелять событием только раз
      sync: function (dataSet) {

      },

      /**
       * Метод создает запись в источнике данных
       */
      create: function () {
         /*Method must be implemented*/
      },

      /**
       * Метод для чтения записи из источника данных по ее идентификатору
       * @param {Number} id - идентификатор записи
       */
      read: function (id) {
         /*Method must be implemented*/
      },

      /**
       * Метод для обновлениязаписи в источнике данных
       * @param (SBIS3.CONTROLS.Record) record - измененная запись
       */
      update: function (record) {
         /*Method must be implemented*/
      },

      /**
       * Метод для удаления записи из источника данных
       * @param {Array | Number} id - идентификатор записи или массив идентификаторов
       */
      destroy: function (id) {
         /*Method must be implemented*/
      },
      /**
       * Метод для получения набора записей из источника данных
       * Возможно применене фильтрации, сортировки и выбора определенного количества записей с заданной позиции
       * @param {Object} filter - {property1: value, property2: value}
       * @param {Array} sorting - [{property1: 'ASC'},{property2: 'DESC'}]
       * @param {Number} offset смещение начала выборки
       * @param {Number} limit количество возвращаемых записей
       */
      query: function (filter, sorting, offset, limit) {
         /*Method must be implemented*/
      }

   });
});