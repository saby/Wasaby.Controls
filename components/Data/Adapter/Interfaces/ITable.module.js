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
       * @returns {Number}
       */
      getCount: function () {
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
       * @returns {*} Запись таблицы
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
       * @param {Number} from Позиция, откуда перемещаем
       * @param {Number} to Позиция, в позицию которую перемещаем
       * @returns {*}
       */
      move: function(source, target) {
         throw new Error('Method must be implemented');
      },

      /**
       * Объединяет две записи
       * @param {Number} one Позиция записи в которую будет идти объединение
       * @param {Number} two Позиция второй записи
       * @param {String} idProperty  Название поля содержащего первичный ключ
       * @returns {*}
       */
      merge: function(one, two, idProperty){
         throw new Error('Method must be implemented');
      },
      /**
       * Копирует запись по позиции
       * @param {Number} index Позиция, которая будет скопирована
       * @returns {*}
       */
      copy: function(index){
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
