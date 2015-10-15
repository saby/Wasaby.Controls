/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ObservableTreeChildrenMixin', [
   'js!SBIS3.CONTROLS.Data.Collection.TreeItem'
], function () {
   'use strict';

   /**
    * Миксин, поддерживающий отcлеживание изменений в дочерних элементах узла дерева.
    * @mixin SBIS3.CONTROLS.Data.Collection.ObservableTreeChildrenMixin
    * @public
    * @author Мальцев Алексей
    */

   var ObservableTreeChildrenMixin = /** @lends SBIS3.CONTROLS.Data.Collection.ObservableTreeChildrenMixin.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.TreeItem} Узел-владелец
             * @name SBIS3.CONTROLS.Data.Collection.TreeChildren#owner
             */
         },

         _itemModule: 'SBIS3.CONTROLS.Data.Collection.TreeItem'
      },

      after: {
         /**
          * Для дерева обеспечиваем всплытие собития об изменении коллекции до корня
          * @see SBIS3.CONTROLS.Data.Collection.ObservableListMixin#notifyCollectionChange
          * @private
          */
         notifyCollectionChange: function (action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
            if (!this._eventsEnabled) {
               return;
            }

            this._options.owner.notifyChildrenChangeToRoot(
               action,
               newItems,
               newItemsIndex,
               oldItems,
               oldItemsIndex
            );
         }
      }

      //region Protected methods

      //endregion Protected methods
   };

   return ObservableTreeChildrenMixin;
});
