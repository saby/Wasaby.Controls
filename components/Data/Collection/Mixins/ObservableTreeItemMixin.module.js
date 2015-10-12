/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ObservableTreeItemMixin', [
   'js!SBIS3.CONTROLS.Data.Collection.ObservableTreeChildren'
], function () {
   'use strict';

   /**
    * Миксин, реализующий элемент дерева, в котором можно отслеживать изменения.
    * @mixin SBIS3.CONTROLS.Data.Collection.ObservableTreeItemMixin
    * @public
    * @ignoreMethods setChildrenChanged
    * @author Мальцев Алексей
    */
   var ObservableTreeItemMixin = /** @lends SBIS3.CONTROLS.Data.Collection.ObservableTreeItemMixin.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.ObservableTreeChildren|Array} Коллекция дочерних элементов
             * @name children
             */
         },

         _childrenModule: 'SBIS3.CONTROLS.Data.Collection.ObservableTreeChildren'
      },

      $constructor: function (cfg) {
         this._publish('onCollectionChange', 'onTreeItemContentsChange', 'onTreeItemParentChange', 'onTreeNodeToggle');
      },

      around: {
         //region SBIS3.CONTROLS.Data.Collection.ITreeItem

         setContents: function (parentFnc, contents) {
            var oldContents = this.getContents();
            parentFnc.call(this, contents);
            this._notify(
               'onTreeItemContentsChange',
               this,
               contents,
               oldContents
            );
         },

         setParent: function (parentFnc, parent) {
            var oldParent = this.getParent();
            parentFnc.call(this, parent);
            this._notify(
               'onTreeItemParentChange',
               this,
               parent,
               oldParent
            );
         },

         setExpanded: function (parentFnc, expanded) {
            if (this.isExpanded() !== expanded) {
               parentFnc.call(this, expanded);
               this._notifyParentTreeNodeToggle(
                  this,
                  expanded
               );
            }
         }

         //endregion SBIS3.CONTROLS.Data.Collection.ITreeItem

      },

      //region SBIS3.CONTROLS.Data.Collection.ITreeItem

      /**
       * Возвращает коллекцию потомков узла
       * @returns {SBIS3.CONTROLS.Data.Collection.ObservableTreeChildren}
       */
      /*getChildren: function () {
      },*/

      //endregion SBIS3.CONTROLS.Data.Collection.ITreeItem

      //region Public methods

      /**
       * Генерирует событие об изменении дочерних элементов узла дерева
       * @param {String} action Действие, приведшее к изменению.
       * @param {SBIS3.CONTROLS.Data.Collection.ObservableTreeItem[]} newItems Новые элементы коллеции.
       * @param {Number} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {SBIS3.CONTROLS.Data.Collection.ObservableTreeItem[]} oldItems Удаленные элементы коллекции.
       * @param {Number} oldItemsIndex Индекс, в котором удалены элементы.
       */
      setChildrenChanged: function (action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         this._bubbleUp(function() {
            this._notify(
               'onCollectionChange',
               action,
               newItems,
               newItemsIndex,
               oldItems,
               oldItemsIndex
            );
         });
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Генерирует событие об изменении дочерних элементов узла дерева
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} node Узел
       * @param {Boolean} expanded Развернут или свернут узел.
       */
      _notifyParentTreeNodeToggle: function (node, expanded) {
         this._bubbleUp(function() {
            this._notify(
               'onTreeNodeToggle',
               node,
               expanded
            );
         });
      }

      //endregion Protected methods

   };

   return ObservableTreeItemMixin;
});
