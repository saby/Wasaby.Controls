/* global define */
define('js!WS.Data/Adapter/ITable', [], function () {
   'use strict';

   /**
    * Интерфейс адаптера для таблицы данных
    * @interface WS.Data/Adapter/ITable
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Adapter/ITable.prototype */{
      /**
       * Возвращает массив названий полей
       * @return {Array.<String>} Названия полей
       */
      getFields: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает кол-во записей таблицы
       * @return {Number}
       */
      getCount: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает данные таблицы в формате адаптера
       * @return {*}
       */
      getData: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Добавляет запись в таблицу
       * @param {*} record Запись
       * @param {Number} [at] Позиция, в которую добавляется запись (по умолчанию - в конец)
       */
      add: function (record, at) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает запись по позиции
       * @param {Number} index Позиция
       * @return {*} Запись таблицы
       */
      at: function (index) {
         throw new Error('Method must be implemented');
      },

      /**
       * Удаляет запись по позиции
       * @param {Number} at Позиция записи
       */
      remove: function (at) {
         throw new Error('Method must be implemented');
      },

      /**
       * Заменяет запись
       * @param {*} record Заменяющая запись
       * @param {Number} at Позиция, в которой будет произведена замена
       */
      replace: function (record, at) {
         throw new Error('Method must be implemented');
      },

      /**
       * Перемещает запись
       * @param {Number} source Позиция, откуда перемещаем
       * @param {Number} target Позиция, в позицию которую перемещаем
       * @return {*}
       */
      move: function(source, target) {
         throw new Error('Method must be implemented');
      },

      /**
       * Объединяет две записи
       * @param {Number} acceptor Позиция принимающей записи
       * @param {Number} donor Позиция записи-донора
       * @param {String} idProperty  Название поля содержащего первичный ключ
       * @return {*}
       */
      merge: function(acceptor, donor, idProperty) {
         throw new Error('Method must be implemented');
      },

      /**
       * Копирует запись по позиции
       * @param {Number} index Позиция, которая будет скопирована
       * @return {*}
       */
      copy: function(index) {
         throw new Error('Method must be implemented');
      },

      /**
       * Очищает таблицу (удаляет все записи)
       */
      clear: function () {
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
       * Добавляет поле в таблицу.
       * Если позиция не указана (или указана как -1), поле добавляется в конец.
       * Если поле с таким форматом уже есть, генерирует исключение.
       * @param {WS.Data/Format/Field} format Формат поля
       * @param {Number} [at] Позиция поля
       */
      addField: function(format, at) {
         throw new Error('Method must be implemented');
      },

      /**
       * Удаляет поле из таблицы по имени.
       * @param {String} name Имя поля
       */
      removeField: function(name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Удаляет поле из таблицы по позиции.
       * Если позиция выходит за рамки допустимого индекса, генерирует исключение.
       * @param {String} index Позиция поля
       */
      removeFieldAt: function(index) {
         throw new Error('Method must be implemented');
      }
   };
});
