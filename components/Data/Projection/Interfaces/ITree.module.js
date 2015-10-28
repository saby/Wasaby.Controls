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
       * @param {SBIS3.CONTROLS.Data.Projection.ITreeItem} newCurrent Новый текущий элемент
       * @param {SBIS3.CONTROLS.Data.Projection.ITreeItem} oldCurrent Старый текущий элемент
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
             * @cfg {SBIS3.CONTROLS.Data.Projection.ITreeItem|*} Корневой узел или его содержимое
             */
            root: undefined
         }
      },

      /**
       * Возвращает название свойства, содержащего идентификатор узла
       * @returns {String}
       */
      getIdProperty: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает название свойства, содержащего идентификатор узла
       * @param {String} name Название свойства, содержащего идентификатор узла
       */
      setIdProperty: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает название свойства, содержащего идентификатор родительского узла
       * @returns {String}
       */
      getParentProperty: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает название свойства, содержащего идентификатор родительского узла
       * @param {String} name Название свойства, содержащего идентификатор родительского узла
       */
      setParentProperty: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает название свойства, содержащего признак узла
       * @returns {String}
       */
      getNodeProperty: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает название свойства, содержащего признак узла
       * @param {String} name Название свойства, содержащего признак узла
       */
      setNodeProperty: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает корневой узел дерева
       * @returns {SBIS3.CONTROLS.Data.Projection.ITreeItem}
       */
      getRoot: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает коллекцию потомков элемента коллеции
       * @param {SBIS3.CONTROLS.Data.Projection.ITreeItem} item Элемент коллекции
       * @returns {SBIS3.CONTROLS.Data.Projection.ITreeChildren}
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
