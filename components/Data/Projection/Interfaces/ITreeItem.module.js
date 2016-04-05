/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.ITreeItem', [
], function () {
   'use strict';


   $ws.single.ioc.resolve('ILogger').info('SBIS3.CONTROLS.Data.Projection.ITreeItem', 'Interface is deprecated and will be removed in 3.7.4. Use SBIS3.CONTROLS.Data.Projection.TreeItem instead.');

   /**
    * Интерфейс элемента дерева
    * @mixin SBIS3.CONTROLS.Data.Projection.ITreeItem
    * @implements SBIS3.CONTROLS.Data.Projection.ICollectionItem
    * @public
    * @deprecated интерфейс будет удален в 3.7.4, используйте SBIS3.CONTROLS.Data.Projection.TreeItem
    * @author Мальцев Алексей
    */
   return /** @lends SBIS3.CONTROLS.Data.Projection.ITreeItem.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Projection.ITreeItem} Родительский узел
             */
            parent: undefined,

            /**
             * @cfg {Boolean} Является узлом
             */
            node: false,

            /**
             * @cfg {Boolean} Развернут или свернут узел. По умолчанию свернут.
             */
            expanded: false
         }
      },

      /**
       * Возвращает родительский узел
       * @returns {SBIS3.CONTROLS.Data.Projection.ITreeItem}
       */
      getParent: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает родительский узел
       * @param {SBIS3.CONTROLS.Data.Projection.ITreeItem} parent Родительский узел
       * @param {Boolean} [silent=false] Не генерировать событие
       */
      setParent: function (parent, silent) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает корневой элемент дерева
       * @returns {SBIS3.CONTROLS.Data.Projection.ITreeItem}
       */
      getRoot: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Является ли корнем дерева
       * @returns {Boolean}
       */
      isRoot: function () {
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
