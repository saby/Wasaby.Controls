/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.IList', [
], function () {
   'use strict';

   /**
    * Интерфейс списка - коллекции c доступом по индексу
    * @mixin SBIS3.CONTROLS.Data.Collection.IList
    * @implements SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @public
    * @author Мальцев Алексей
    */
   return /** @lends SBIS3.CONTROLS.Data.Collection.IList.prototype */{
      /**
       * Заменяет список другой коллекцией. Если не передать коллекцию для замены, то список будет просто очищен.
       * @param {SBIS3.CONTROLS.Data.Collection.IEnumerable|Array} [instead] Коллекция с элементами для замены
       */
      fill: function (instead) {
         throw new Error('Method must be implemented');
      },

      /**
       * Добавляет элемент в список
       * @param {*} item Элемент
       * @param {Number} [at] Позиция, в которую добавляется элемент (по умолчанию - в конец)
       */
      add: function (item, at) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает элемент по позиции
       * @param {Number} index Позиция
       * @returns {*} Элемент списка
       */
      at: function (index) {
         throw new Error('Method must be implemented');
      },

      /**
       * Удаляет элемент из списка
       * @param {*} item Удаляемый элемент
       */
      remove: function (item) {
         throw new Error('Method must be implemented');
      },

      /**
       * Удаляет элемент из списка по позиции
       * @param {Number} index Позиция элемента
       */
      removeAt: function (index) {
         throw new Error('Method must be implemented');
      },

      /**
       * Заменяет элемент списка
       * @param {*} item Заменяющий элемент
       * @param {Number} at Позиция, в которой будет произведена замена
       */
      replace: function (item, at) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает индекс элемента списка
       * @param {*} item Искомый элемент
       * @returns {Number} Индекс элемента или -1, если не найден
       */
      getIndex: function (item) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает кол-во элементов списка
       * @returns {Number}
       */
      getCount: function () {
         throw new Error('Method must be implemented');
      }
   };
});
