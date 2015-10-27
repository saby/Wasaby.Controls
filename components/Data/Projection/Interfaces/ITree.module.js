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
      $protected: {
         _options: {
            /**
             * @cfg {String} Название свойства, содержащего идентификатор узла.
             */
            idProperty: '',

            /**
             * @cfg {String} Название свойства, содержащего идентификатор родительского узла.
             */
            parentProperty: '',

            /**
             * @cfg {String} Название свойства, содержащего признак узла.
             */
            nodeProperty: '',

            /**
             * @cfg {String} Название свойства, содержащего дочерние элементы узла.
             */
            childrenProperty: '',

            /**
             * @cfg {SBIS3.CONTROLS.Data.Tree.ITreeItem|*} Корневой узел или его содержимое
             */
            root: undefined
         }
      },

      /**
       * Возвращает корневой узел дерева
       * @returns {SBIS3.CONTROLS.Data.Tree.ITreeItem}
       */
      getRoot: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает коллекцию потомков элемента коллеции
       * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem} item Элемент коллекции
       * @returns {SBIS3.CONTROLS.Data.Tree.ITreeChildren}
       */
      getChildren: function (item) {
         throw new Error('Method must be implemented');
      },

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
