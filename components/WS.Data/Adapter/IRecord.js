/* global define */
define('js!WS.Data/Adapter/IRecord', [], function () {
   'use strict';

   /**
    * Интерфейс адаптера для записи таблицы данных
    * @interface WS.Data/Adapter/IRecord
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Adapter/IRecord.prototype */{
      /**
       * Возвращает признак наличия поля в данных
       * @param {String} name Поле записи
       * @return {Boolean}
       */
      has: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает значение поля записи
       * @param {String} name Поле записи
       * @return {*}
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
       * Очищает запись (удаляет все поля)
       */
      clear: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает данные записи в формате адаптера
       * @return {*}
       */
      getData: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает массив названий полей
       * @return {Array.<String>} Названия полей
       */
      getFields: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает формат поля (в режиме только для чтения)
       * @param {String} name Поле записи
       * @return {WS.Data/Format/Field}
       */
      getFormat: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает общий универсальный формат поля - его нельзя использовать в замыканиях и сохранять куда-либо.
       * Метод каждый раз возвращает один и тот же объект, заменяя только его данные - подобный подход обеспечивает
       * ускорение и уменьшение расхода памяти.
       * @param {String} name Поле записи
       * @return {WS.Data/Format/UniversalField}
       */
      getSharedFormat: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Добавляет поле в запись.
       * Если позиция не указана (или указана как -1), поле добавляется в конец.
       * Если поле с таким форматом уже есть, генерирует исключение.
       * @param {WS.Data/Format/Field} format Формат поля
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
