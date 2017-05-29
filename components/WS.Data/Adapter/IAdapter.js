/* global define */
define('js!WS.Data/Adapter/IAdapter', [], function () {
   'use strict';

   /**
    * Интерфейс адаптера, осуществляющиего операции с "сырыми" данными.
    * Назначение адаптера - предоставить общий интерфейс для работы различными форматами данных.
    * @interface WS.Data/Adapter/IAdapter
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Adapter/IAdapter.prototype */{
      /**
       * Возвращает интерфейс доступа к данным в виде таблицы
       * @param {*} data Сырые данные
       * @return {WS.Data/Adapter/ITable}
       */
      forTable: function (data) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает интерфейс доступа к данным в виде записи
       * @param {*} data Сырые данные
       * @param {*} [tableData] Сырые данные таблицы (передаются, когда data пустой)
       * @return {WS.Data/Adapter/IRecord}
       */
      forRecord: function (data, tableData) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает название поля, которое является первичным ключом
       * @param {*} data Сырые данные
       * @return {String}
       */
      getKeyField: function (data) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает значение свойства
       * @param {*} data Сырые данные
       * @param {String} property Название свойства
       * @return {*}
       */
      getProperty: function (data, property) {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает значение свойства
       * @param {*} data Сырые данные
       * @param {String} property Название свойства
       * @param {*} value Значение свойства
       */
      setProperty: function (data, property, value) {
         throw new Error('Method must be implemented');
      },

      /**
       * Сериализует данные - переводит из внешнего формата в формат адаптера
       * @param {*} data Сериализуемые данные
       * @return {Object} Сериализованные данные
       * @static
       */
      serialize: function (data) {
         throw new Error('Method must be implemented');
      }
   };
});
