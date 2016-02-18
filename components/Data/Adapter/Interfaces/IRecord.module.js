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
       * Возвращает данные записи в формате адаптера
       * @returns {*}
       */
      getData: function () {
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
       * Возвращает массив названий полей
       * @returns {Array.<String>} Названия полей
       */
      getFields: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает объект содержащий название типа и мета данные
       * @param {String} name Поле записи
       * @returns {Object} Объект вида {type: Название, meta: Мета данные типа }
       * @deprecated Метод getInfo() не рекомендуется к использованию и будет удален в 3.7.4. Используйте метод getFormat().
       */
      getInfo: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает формат поля (в режиме только для чтения)
       * @param {String} name Поле записи
       * @returns {SBIS3.CONTROLS.Data.Format.Field}
       */
      getFormat: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Добавляет поле в запись.
       * Если позиция не указана (или указана как -1), поле добавляется в конец.
       * Если поле с таким форматом уже есть, генерирует исключение.
       * @param {SBIS3.CONTROLS.Data.Format.Field} format Формат поля
       * @param {Number} [at] Позиция поля
       */
      addField: function(format, at) {
         throw new Error('Method must be implemented');
      },

      /**
       * Удаляет поле из записи по имени.
       * @param {String} name Имя поля
       */
      removeField: function(name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Удаляет поле из записи по позиции.
       * Если позиция выходит за рамки допустимого индекса, генерирует исключение.
       * @param {String} index Позиция поля
       */
      removeFieldAt: function(index) {
         throw new Error('Method must be implemented');
      }
   };
});
