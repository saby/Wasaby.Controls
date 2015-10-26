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
