/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.ITree', [
], function () {
   'use strict';

   /**
    * Интерфейс проекции дерева - предоставляет методы навигации, фильтрации и сортировки, не меняя при этом исходную коллекцию.
    * @mixin SBIS3.CONTROLS.Data.Projection.ITree
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Projection.ITree.prototype */{
      /**
       * @event onCurrentChange При изменении текущего элемента
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem} newCurrent Новый текущий элемент
       * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem} oldCurrent Старый текущий элемент
       * @param {Number} newPosition Новая позиция
       * @param {Number} oldPosition Старая позиция
       */

      /**
       * Возвращает родительский узел для элемента коллеции
       * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem} item Элемент коллекции
       * @returns {SBIS3.CONTROLS.Data.Tree.ITreeItem}
       */
      getParent: function (item) {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает родительский узел для элемента коллеции
       * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem} item Элемент коллекции
       * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem} [parent] Новый родительский узел. Если не передан, то элемент остается без родителя.
       */
      setParent: function (item, parent) {
         throw new Error('Method must be implemented');
      },

      /**
       * Является ли элемент корнем дерева
       * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem} item Элемент коллекции
       * @returns {Boolean}
       */
      isRoot: function (item) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает коллекцию потомков элемента коллеции
       * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem} item Элемент коллекции
       * @returns {SBIS3.CONTROLS.Data.Collection.IList}
       */
      getChildren: function (item) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает уровень вложенности относительно корня
       * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem} item Элемент коллекции
       * @returns {Number}
       */
      /*getLevel: function (item) {
         throw new Error('Method must be implemented');
      },*/

      /**
       * Устанавливает текущим родителя текущего элемента
       * @returns {Boolean} Есть ли родитель
       */
      moveToAbove: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущим первого непосредственного потомка текущего элемента
       * @returns {Boolean} Есть ли первый потомок
       */
      moveToBelow: function () {
         throw new Error('Method must be implemented');
      }
   };
});
