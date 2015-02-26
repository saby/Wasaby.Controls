/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.IDataSource', [
   'js!SBIS3.CONTROLS.StrategyHelper'
], function (StrategyHelper) {
   'use strict';

   /**
    * Интерфейс предназначен для работы с источником данных
    */

   return $ws.proto.Abstract.extend({
      $protected: {
         /**
          * Объект стратегии работы с данными
          */
         _strategy: undefined,
         _options: {
            strategyName: ''
         }
      },
      $constructor: function () {
         this._publish('onCreate', 'onRead', 'onUpdate', 'onDestroy', 'onQuery', 'onDataChange');
         if (this._options.strategyName) {
            this._strategy = StrategyHelper.getStrategyObjectByName(this._options.strategyName);
         }
      },
      /**
       * Получить объект стратегии работы с данными
       * @returns {Object}
       */
      getStrategy: function () {
         return this._strategy;
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