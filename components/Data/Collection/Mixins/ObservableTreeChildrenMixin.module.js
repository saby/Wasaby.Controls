/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ObservableTreeChildrenMixin', [
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
             * @cfg {SBIS3.CONTROLS.Data.Collection.ObservableTreeItem} Узел-владелец
             * @name owner
             */
         },
         _itemConstructor: undefined,
         _itemModule: 'SBIS3.CONTROLS.Data.Collection.ObservableTreeItem'
      },

      //region Protected methods

      _notifyCollectionChange: function (action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         if (!this._eventsEnabled) {
            return;
         }

         this._options.owner.setChildrenChanged(
            action,
            newItems,
            newItemsIndex,
            oldItems,
            oldItemsIndex
         );
      }

      //endregion Protected methods
   };

   return ObservableTreeChildrenMixin;
});
