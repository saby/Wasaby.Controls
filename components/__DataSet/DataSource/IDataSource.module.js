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
      },
      $constructor: function () {
         this._publish('onCreate', 'onRead', 'onUpdate', 'onDestroy', 'onQuery', 'onDataChange');
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
       * @param {Number} id - идентификатор записи
       */
      destroy: function (id) {
         /*Method must be implemented*/
      },
      /**
       * Метод для получения набора записей из источника данных
       * Возможно применене фильтрации, сортировки и выбора определенного количества записей с заданной позиции
       * @param {Array} filter - [{property1: value},{property2: value}]
       * @param {Array} sorting - [{property1: 'ASC'},{property2: 'DESC'}]
       * @param {Number} offset смещение начала выборки
       * @param {Number} limit количество возвращаемых записей
       */
      query: function (filter, sorting, offset, limit) {
         /*Method must be implemented*/
      }

   });
});