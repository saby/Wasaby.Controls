/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.ITree', [
], function () {
   'use strict';

   /**
    * Интерфейс проекции дерева - предоставляет методы навигации, фильтрации и сортировки, не меняя при этом исходное дерево.
    * @mixin SBIS3.CONTROLS.Data.Projection.ITree
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Projection.ITree.prototype */{
      /**
       * @event onCurrentChange При изменении текущего элемента
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} newCurrent Новый текущий элемент
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} oldCurrent Старый текущий элемент
       * @param {Number} newPosition Новая позиция
       * @param {Number} oldPosition Старая позиция
       */

      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.ITreeItem} Дерево
             */
            tree: undefined
         }
      },

      /**
       * Возвращает исходное дерево, для которого построена проекция
       * @returns {SBIS3.CONTROLS.Data.Collection.ITreeItem}
       */
      getCollection: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает текущий элемент дерева
       * @returns {SBIS3.CONTROLS.Data.Collection.ITreeItem}
       */
      getCurrent: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущий элемент дерева
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} item Новый текущий элемент
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
       * Устанавливает текущим следующий элемент среди непосредственных потомков одного узла
       * @returns {Boolean} Есть ли следующий элемент
       */
      moveToNext: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущим предыдущий элемент среди непосредственных потомков одного узла
       * @returns {Boolean} Есть ли предыдущий элемент
       */
      moveToPrevious: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущим первый элемент среди непосредственных потомков одного узла
       * @returns {Boolean} Есть ли первый элемент
       */
      moveToFirst: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущим последний элемент среди непосредственных потомков одного узла
       * @returns {Boolean} Есть ли последний элемент
       */
      moveToLast: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущим родителя текущего элемента
       * @returns {Boolean} Есть ли родительский элемент
       */
      moveToAbove: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущим первого непосредственного потомка текущего элемента
       * @returns {Boolean} Есть ли первый дочерние элементы
       */
      moveToBelow: function () {
         throw new Error('Method must be implemented');
      }
   };
});
