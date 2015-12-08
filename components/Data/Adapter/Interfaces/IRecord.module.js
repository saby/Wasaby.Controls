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
       * Возвращает значение поля записи
       * @param {*} data Сырые данные
       * @param {String} name Поле записи
       * @returns {*}
       */
      get: function (data, name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Сохраняет значение поля записи
       * @param {*} data Сырые данные
       * @param {String} name Поле записи
       * @param {*} value Значение
       * @returns Новые сырые данные
       */
      set: function (data, name, value) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает массив названий полей
       * @param {*} data Сырые данные
       * @returns {String[]} Названия полей
       */
      getFields: function (data) {
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
       * @param {*} data Сырые данные
       * @param {String} name Поле записи
       * @returns {Object} Объект вида {type: Название, meta: Мета данные типа }
       */
      getFullFieldData: function (data, name) {
         throw new Error('Method must be implemented');
      }
   };
});
