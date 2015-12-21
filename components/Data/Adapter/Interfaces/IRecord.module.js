/* global define */
define('js!SBIS3.CONTROLS.Data.Adapter.IRecord', [], function () {
   'use strict';

   /**
    * Интерфейс адаптера для записи таблицы данных
    * @mixin SBIS3.CONTROLS.Data.Adapter.IRecord
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Adapter.IRecord.prototype */{
      /**
       * Возвращает признак наличия поля в данных
       * @param {String} name Поле записи
       * @returns {Boolean}
       */
      has: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает значение поля записи
       * @param {String} name Поле записи
       * @returns {*}
       */
      get: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Сохраняет значение поля записи
       * @param {String} name Поле записи
       * @param {*} value Значение
       */
      set: function (name, value) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает массив названий полей
       * @returns {String[]} Названия полей
       */
      getFields: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает пустую запись
       * @returns {*}
       */
      getEmpty: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает объект содержащий название типа и мета данные
       * @param {String} name Поле записи
       * @returns {Object} Объект вида {type: Название, meta: Мета данные типа }
       */
      getInfo: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает название поля, которое является первичным ключем
       * @returns {String}
       */
      getKeyField: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает данные
       * @returns {*}
       */
      getData: function () {
         throw new Error('Method must be implemented');
      }
   };
});
