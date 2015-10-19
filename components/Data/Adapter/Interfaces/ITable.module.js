/* global define */
define('js!SBIS3.CONTROLS.Data.Adapter.ITable', [], function () {
   'use strict';

   /**
    * Интерфейс адаптера для таблицы данных
    * @mixin SBIS3.CONTROLS.Data.Adapter.ITable
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Adapter.ITable.prototype */{
      /**
       * Возвращает пустую таблицу
       * @returns {*}
       */
      getEmpty: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает кол-во записей таблицы
       * @param {*} data Сырые данные
       * @returns {Number}
       */
      getCount: function (data) {
         throw new Error('Method must be implemented');
      },

      /**
       * Добавляет запись в таблицу
       * @param {*} data Сырые данные
       * @param {*} record Запись
       * @param {Number} [at] Позиция, в которую добавляется запись (по умолчанию - в конец)
       */
      add: function (data, record, at) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает запись по позиции
       * @param {*} data Сырые данные
       * @param {Number} index Позиция
       * @returns {*} Запись таблицы
       */
      at: function (data, index) {
         throw new Error('Method must be implemented');
      },

      /**
       * Удаляет запись по позиции
       * @param {*} data Сырые данные
       * @param {Number} at Позиция записи
       */
      remove: function (data, at) {
         throw new Error('Method must be implemented');
      },

      /**
       * Заменяет запись
       * @param {*} data Сырые данные
       * @param {*} record Заменяющая запись
       * @param {Number} at Позиция, в которой будет произведена замена
       */
      replace: function (data, record, at) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает значение свойства таблицы
       * @param {*} data Сырые данные
       * @param {String} property Название свойства
       * @returns {*}
       */
      getProperty: function (data, property) {
         throw new Error('Method must be implemented');
      },
      /**
       * Объединяет две записи
       * @param {*} data Сырые данные
       * @param {Number} one Позиция записи в которую будет идти объединение
       * @param {Number} two Позиция второй записи
       * @param {String} idProperty  Название поля содержащего первичный ключ
       * @returns {*}
       */
      merge: function(data, one, two, idProperty){
         throw new Error('Method must be implemented');
      },
      /**
       * Копирует запись по позиции
       * @param {*} data Сырые данные
       * @param {Number} index Позиция, которая будет скопирована
       * @returns {*}
       */
      copy: function(data, index){
         throw new Error('Method must be implemented');
      }
   };
});
