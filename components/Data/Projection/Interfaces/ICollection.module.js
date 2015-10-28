/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.ICollection', [
], function () {
   'use strict';

   /**
    * Интерфейс проекции коллекции - предоставляет методы навигации, фильтрации и сортировки, не меняя при этом исходную коллекцию.
    * @mixin SBIS3.CONTROLS.Data.Projection.ICollection
    * @implements SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @implements SBIS3.CONTROLS.Data.Bind.ICollection
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Projection.ICollection.prototype */{
      /**
       * @event onCurrentChange При изменении текущего элемента
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem} newCurrent Новый текущий элемент
       * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem} oldCurrent Старый текущий элемент
       * @param {Number} newPosition Новая позиция
       * @param {Number} oldPosition Старая позиция
       */

      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.IEnumerable} Исходная коллекция
             */
            collection: undefined
         }
      },

      /**
       * Возвращает исходную коллекцию, для которой построена проекция
       * @returns {SBIS3.CONTROLS.Data.Collection.IEnumerable}
       */
      getCollection: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает текущий элемент
       * @returns {SBIS3.CONTROLS.Data.Projection.ICollectionItem}
       */
      getCurrent: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущий элемент
       * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem} item Новый текущий элемент
       * @param {Boolean} [silent=false] Не генерировать событие onCurrentChange
       */
      setCurrent: function (item, silent) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает позицию текущего элемента
       * @returns {Number}
       */
      getCurrentPosition: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает позицию текущего элемента
       * @param {Number} position Позиция текущего элемента. Значение -1 указывает, что текущий элемент не выбран.
       * @param {Boolean} [silent=false] Не генерировать событие onCurrentChange
       */
      setCurrentPosition: function (position, silent) {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущим следующий элемент
       * @returns {Boolean} Есть ли следующий элемент
       */
      moveToNext: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущим предыдущий элемент
       * @returns {Boolean} Есть ли предыдущий элемент
       */
      moveToPrevious: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущим первый элемент
       * @returns {Boolean} Есть ли первый элемент
       */
      moveToFirst: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущим последний элемент
       * @returns {Boolean} Есть ли последний элемент
       */
      moveToLast: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает фильтр элементов проекции
       * @returns {Function}
       */
      getFilter: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает фильтр элементов проекции. Для сброса ранее установленного фильтра вызвать этот метод без параметров.
       * @param {Function} [filter] Фильтр элементов: аргументами приходят элемент и его позиция, должен вернуть Boolean
       */
      setFilter: function (filter) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает способ группировки элементов проекции
       * @returns {Function}
       */
      getGroup: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает способ группировки элементов проекции. Для сброса ранее установленного способа группировки вызвать этот метод без параметров.
       * @param {Function} [group] Способ группировки элементов: аргументами приходят элемент и его позиция, должен вернуть Object - группу, в которую входит элемент
       */
      setGroup: function (group) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает способ сортировки элементов проекции
       * @returns {Function}
       */
      getSort: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает способ сортировки элементов проекции. Для сброса ранее установленного способа сортировки вызвать этот метод без параметров.
       * Можно передать набор аргументов - тогда будет произведена множественная сортировка.
       * @param {Function} [sort] Способ сортировки элементов: аргументами приходят 2 объекта (a, b) вида {item: item, index: index}, должен вернуть -1|0|1 (см. Array.prototype.sort())
       * @example
       * <pre>
       *     var projection = new CollectionProjection({...});
       *
       *     //получаем коллекию, отсортированную по возрастанию id
       *     projection.setSort(function(a, b) {
       *       return a.item.id - b.item.id
       *     });
       *
       *     //получаем коллекию, отсортированную сначала по title, а потом - по id
       *     projection.setSort(function(a, b) {
       *       return a.item.title > b.item.title
       *     }, function(a, b) {
       *       return a.item.id - b.item.id
       *     });
       * </pre>
       */
      setSort: function (sort) {
         throw new Error('Method must be implemented');
      }
   };
});
