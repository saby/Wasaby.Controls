/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Tree.ITreeItem', [
], function () {
   'use strict';

   /**
    * Интерфейс элемента дерева
    * @mixin SBIS3.CONTROLS.Data.Tree.ITreeItem
    * @implements SBIS3.CONTROLS.Data.Collection.ICollectionItem
    * @public
    * @author Мальцев Алексей
    */
   return /** @lends SBIS3.CONTROLS.Data.Tree.ITreeItem.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Tree.ITreeItem} Родительский узел
             */
            parent: undefined,

            /**
             * @cfg {Boolean} Является узлом
             */
            node: false,

            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.IList} Коллекция дочерних элементов
             */
            children: undefined,

            /**
             * @cfg {Boolean} Развернут или свернут узел. По умолчанию свернут.
             */
            expanded: false
         }
      },

      /**
       * Возвращает родительский узел
       * @returns {SBIS3.CONTROLS.Data.Tree.ITreeItem}
       */
      getParent: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает родительский узел
       * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem} [parent] Новый родительский узел. Если не передан, ссылка на родителя обнуляется.
       */
      setParent: function (parent) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает уровень вложенности относительно корня
       * @returns {Number}
       */
      getLevel: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Является ли элемент узлом
       * @returns {Boolean}
       */
      isNode: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Является ли элемент корнем дерева
       * @returns {Boolean}
       */
      isRoot: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает коллекцию потомков узла
       * @returns {SBIS3.CONTROLS.Data.Collection.IList}
       */
      getChildren: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает потомка узла по его хэшу
       * @param {String} hash Хэш потомка
       * @param {Boolean} [deep=false] Искать по всем уровням вложенности
       * @returns {SBIS3.CONTROLS.Data.Tree.ITreeItem}
       */
      getChildByHash: function (hash, deep) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает признак, что узел развернут
       * @returns {Boolean}
       */
      isExpanded: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает признак, что узел развернут или свернут
       * @param {Boolean} expanded Развернут или свернут узел
       */
      setExpanded: function (expanded) {
         throw new Error('Method must be implemented');
      },

      /**
       * Переключает признак, что узел развернут или свернут
       */
      toggleExpanded: function () {
         throw new Error('Method must be implemented');
      }
   };
});
