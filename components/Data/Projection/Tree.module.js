/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Tree', [
   'js!SBIS3.CONTROLS.Data.Projection.ITree',
   'js!SBIS3.CONTROLS.Data.Projection',
   'js!SBIS3.CONTROLS.Data.Projection.Collection'
], function (ITreeProjection, Projection, CollectionProjection) {
   'use strict';

   /**
    * Проекция дерева - предоставляет методы навигации, фильтрации и сортировки, не меняя при этом исходное дерево
    * @class SBIS3.CONTROLS.Data.Projection.Tree
    * @extends SBIS3.CONTROLS.Data.Projection.Collection
    * @mixes SBIS3.CONTROLS.Data.Projection.ITree
    * @public
    * @author Мальцев Алексей
    */

   var TreeProjection = CollectionProjection.extend([ITreeProjection], /** @lends SBIS3.CONTROLS.Data.Projection.Tree.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.Tree',
      $protected: {
      },

      $constructor: function () {
         //this._onSourceCollectionChange = onSourceCollectionChange.bind(this);
         //this._onSourceCollectionItemChange = onSourceCollectionItemChange.bind(this);

         /*if ($ws.helpers.instanceOfMixin(this._options.tree, 'SBIS3.CONTROLS.Data.Bind.ICollection')) {
            this.subscribeTo(this._options.tree, 'onCollectionChange', this._onSourceCollectionChange);
            this.subscribeTo(this._options.tree, 'onCollectionItemChange', this._onSourceCollectionItemChange);
         }

         this._childrenProjection = $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.Projection.Collection', {
            collection: this._options.tree.getChildren()
         });*/

         //TODO: filtering, ordering
      },

      destroy: function () {
         /*if ($ws.helpers.instanceOfMixin(this._options.tree, 'SBIS3.CONTROLS.Data.Bind.ICollection')) {
            this.unsubscribeFrom(this._options.tree, 'onCollectionChange', this._onSourceCollectionChange);
            this.unsubscribeFrom(this._options.tree, 'onCollectionItemChange', this._onSourceCollectionItemChange);
         }*/

         TreeProjection.superclass.destroy.call(this);
      },

      getLevel: function () {
         return this._options.tree.getLevel();
      },

      /**
       * Возвращает коллекцию потомков дерева
       * @returns {SBIS3.CONTROLS.Data.Collection.IList}
       * @state mutable
       */
      getChildren: function () {
         return this._options.tree.getChildren();
      },

      /**
       * Возвращает потомка узла по его хэшу
       * @param {String} hash Хэш потомка
       * @param {Boolean} [deep=false] Искать по всем уровням вложенности
       * @returns {SBIS3.CONTROLS.Data.Tree.ITreeItem}
       * @state mutable
       */
      /*getChildByHash: function (hash, deep) {
         return this._options.tree.getChildByHash(hash, deep);
      },*/

      //region SBIS3.CONTROLS.Data.Projection.ICollection

      /*setCurrent: function (item, silent) {
         if (this._current !== item) {
            var oldCurrent = this._current,
               oldPosition = this.getCurrentPosition();
            this._current = item;
            this._notifyCurrentChange(
               this._current,
               oldCurrent,
               this.getCurrentPosition(),
               oldPosition
            );
         }
      },*/

      /*getCurrentPosition: function () {
         if (!this._current) {
            return -1;
         }
         var siblings = this._current.getParent().getChildren();
         return siblings.getIndex(this._current);
      },*/

      /*setCurrentPosition: function (position, silent) {
         var oldPosition = this.getCurrentPosition();
         if (position !== oldPosition) {
            var siblings = this._current ? this._current.getParent().getChildren() : this._tree.getChildren();
            this.setCurrent(siblings.at(position), silent);
         }
      },*/

      /*moveToNext: function () {
         var parent = this._current ? this._current.getParent() : this._options.tree,
            siblings = parent.getChildren(),
            index = (this._current === undefined ? -1 : siblings.getIndex(this._current));
         if (index >= siblings.getCount() - 1) {
            return false;
         }
         this.setCurrent(siblings.at(index + 1));
         return true;
      },*/

      /*moveToPrevious: function () {
         if (this._current === undefined) {
            return false;
         }
         var parent = this._current.getParent(),
            siblings = parent.getChildren(),
            index = siblings.getIndex(this._current);
         if (index <= 0) {
            return false;
         }
         this.setCurrent(siblings.at(index - 1));
         return true;
      },*/

      /*moveToFirst: function () {
         var first = (this._current ? this._current.getParent() : this._options.tree).getChildren().at(0);
         if (first === this._current) {
            return false;
         }
         this.setCurrent(first);
         return true;
      },*/

      /*moveToLast: function () {
         var children = (this._current ? this._current.getParent() : this._options.tree).getChildren(),
            last = children.at(children.getCount() - 1);
         if (last === this._current) {
            return false;
         }
         this.setCurrent(last);
         return true;
      },*/

      //endregion SBIS3.CONTROLS.Data.Projection.ICollection

      //region SBIS3.CONTROLS.Data.Projection.ITree

      getParent: function (item) {
      },

      setParent: function (item, parent) {
      },

      isRoot: function (item) {
      },

      getChildren: function (item) {
      },

      moveToAbove: function () {
         if (this._current === undefined) {
            return false;
         }
         var parent = this._current.getParent();
         if (parent === undefined || parent.isRoot()) {
            return false;
         }
         this.setCurrent(parent);
         return true;
      },

      moveToBelow: function () {
         if (this._current === undefined || !this._current.isNode()) {
            return false;
         }
         if (!this._current.isExpanded()) {
            this._current.setExpanded(true);
         }
         var children = this._current.getChildren();
         if (children.getCount() === 0) {
            return false;
         }
         this.setCurrent(children.at(0));
         return true;
      },

      //endregion SBIS3.CONTROLS.Data.Projection.ITree

      //region Protected methods

      /**
       * Генерирует событие об изменении текущего элемента проекции дерева
       * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem} newCurrent Новый текущий элемент
       * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem} oldCurrent Старый текущий элемент
       * @param {Number} newPosition Новая позиция
       * @param {Number} oldPosition Старая позиция
       * @private
       */
      _notifyCurrentChange: function (newCurrent, oldCurrent, newPosition, oldPosition) {
         this._notify(
            'onCurrentChange',
            newCurrent,
            oldCurrent,
            newPosition,
            oldPosition
         );
      }

      //endregion Protected methods

   });

   /**
    * Обрабатывает событие об изменении потомков узла дерева исходного дерева
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {String} action Действие, приведшее к изменению.
    * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem[]} newItems Новые элементы коллеции.
    * @param {Integer} newItemsIndex Индекс, в котором появились новые элементы.
    * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem[]} oldItems Удаленные элементы коллекции.
    * @param {Integer} oldItemsIndex Индекс, в котором удалены элементы.
    * @private
    */
   var onSourceCollectionChange = function (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
      this._notify(
         'onCollectionChange',
         action,
         newItems,
         newItemsIndex,
         oldItems,
         oldItemsIndex
      );
   },

   /**
    * Обрабатывает событие об изменении исходной коллекции
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem} item Измененный элемент коллеции.
    * @param {Integer} index Индекс измененного элемента.
    * @param {String} [property] Измененное свойство элемента
    * @private
    */
   onSourceCollectionItemChange = function (event, item, index, property) {
      this._notify(
         'onCollectionItemChange',
         item,
         index,
         property
      );
   };

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Projection.Tree', function(config) {
      return new TreeProjection(config);
   });

   return TreeProjection;
});
