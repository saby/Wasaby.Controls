/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Tree', [
   'js!SBIS3.CONTROLS.Data.Projection.ITree',
   'js!SBIS3.CONTROLS.Data.IHashable',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection',
   'js!SBIS3.CONTROLS.Data.Bind.ITree',
   'js!SBIS3.CONTROLS.Data.Projection',
   'js!SBIS3.CONTROLS.Data.Projection.Collection'
], function (ITreeProjection, IHashable, IBindCollection, IBindTree, Projection, CollectionProjection) {
   'use strict';

   /**
    * Проекция дерева - предоставляет методы навигации, фильтрации и сортировки, не меняя при этом исходное дерево
    * @class SBIS3.CONTROLS.Data.Projection.Tree
    * @extends SBIS3.CONTROLS.Data.Projection
    * @mixes SBIS3.CONTROLS.Data.IHashable
    * @mixes SBIS3.CONTROLS.Data.Bind.ICollection
    * @mixes SBIS3.CONTROLS.Data.Bind.ITree
    * @mixes SBIS3.CONTROLS.Data.Projection.ITree
    * @public
    * @author Мальцев Алексей
    */

   var TreeProjection = Projection.extend([IHashable, ITreeProjection, IBindCollection, IBindTree], /** @lends SBIS3.CONTROLS.Data.Projection.Tree.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.Tree',
      $protected: {
         /**
          * @var {SBIS3.CONTROLS.Data.Projection.Collection} Проекция дочерних элементов корневого узла
          */
         _childrenProjection: undefined,

         /**
          * @var {SBIS3.CONTROLS.Data.Collection.ITreeItem} Текущий элемент
          */
         _current: undefined,

         /**
          * @var {Function} Обработчик события об изменении потомков узла исходного дерева
          */
         _onSourceCollectionChange: undefined,

         /**
          * @var {Function} Обработчик события об изменении содержимого узла исходного дерева
          */
         _onSourceTreeItemContentsChange: undefined,

         /**
          * @var {Function} Обработчик события об изменении родителя узла исходного дерева
          */
         _onSourceTreeItemParentChange: undefined,

         /**
          * @var {Function} Обработчик события об разворачивании/сворачивании узла исходного дерева
          */
         _onSourceTreeNodeToggle: undefined
      },

      $constructor: function () {
         this._publish('onCollectionChange', 'onCurrentChange', 'onTreeItemContentsChange', 'onTreeItemParentChange', 'onTreeNodeToggle');

         if (!this._options.tree) {
            throw new Error('Source tree is undefined');
         }

         this._onSourceTreeItemContentsChange = onSourceTreeItemContentsChange.bind(this);
         this._onSourceTreeItemParentChange = onSourceTreeItemParentChange.bind(this);
         this._onSourceCollectionChange = onSourceCollectionChange.bind(this);
         this._onSourceTreeNodeToggle = onSourceTreeNodeToggle.bind(this);
         if ($ws.helpers.instanceOfMixin(this._options.tree, 'SBIS3.CONTROLS.Data.Bind.ITree')) {
            this.subscribeTo(this._options.tree, 'onTreeItemContentsChange', this._onSourceTreeItemContentsChange);
            this.subscribeTo(this._options.tree, 'onTreeItemParentChange', this._onSourceTreeItemParentChange);
            this.subscribeTo(this._options.tree, 'onCollectionChange', this._onSourceCollectionChange);
            this.subscribeTo(this._options.tree, 'onTreeNodeToggle', this._onSourceTreeNodeToggle);
         }

         this._childrenProjection = new CollectionProjection({
            collection: this._options.tree.getChildren()
         });
         //TODO: filtering, ordering
      },

      destroy: function () {
         if ($ws.helpers.instanceOfMixin(this._options.tree, 'SBIS3.CONTROLS.Data.Bind.ITree')) {
            this.unsubscribeFrom(this._options.tree, 'onTreeItemContentsChange', this._onSourceTreeItemContentsChange);
            this.unsubscribeFrom(this._options.tree, 'onTreeItemParentChange', this._onSourceTreeItemParentChange);
            this.unsubscribeFrom(this._options.tree, 'onCollectionChange', this._onSourceCollectionChange);
            this.unsubscribeFrom(this._options.tree, 'onTreeNodeToggle', this._onSourceTreeNodeToggle);
         }

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
       * @returns {SBIS3.CONTROLS.Data.Collection.ITreeItem}
       * @state mutable
       */
      getChildByHash: function (hash, deep) {
         return this._options.tree.getChildByHash(hash, deep);
      },

      /**
       * Возвращает проекцию потомков дерева
       * @returns {SBIS3.CONTROLS.Data.Projection.Collection}
       * @state mutable
       */
      getChildrenProjection: function () {
         return this._childrenProjection;
      },

      //region SBIS3.CONTROLS.Data.IHashable

      getHash: function () {
         return this._options.tree.getHash();
      },

      //endregion SBIS3.CONTROLS.Data.IHashable

      //region SBIS3.CONTROLS.Data.Projection.ITree

      getCollection: function () {
         return this._options.tree;
      },

      getCurrent: function () {
         return this._current;
      },

      setCurrent: function (item, silent) {
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
      },

      getCurrentPosition: function () {
         if (!this._current) {
            return -1;
         }
         var siblings = this._current.getParent().getChildren();
         return siblings.getIndex(this._current);
      },

      setCurrentPosition: function (position, silent) {
         var oldPosition = this.getCurrentPosition();
         if (position !== oldPosition) {
            var siblings = this._current ? this._current.getParent().getChildren() : this._tree.getChildren();
            this.setCurrent(siblings.at(position), silent);
         }
      },

      moveToNext: function () {
         var parent = this._current ? this._current.getParent() : this._options.tree,
            siblings = parent.getChildren(),
            index = (this._current === undefined ? -1 : siblings.getIndex(this._current));
         if (index >= siblings.getCount() - 1) {
            return false;
         }
         this.setCurrent(siblings.at(index + 1));
         return true;
      },

      moveToPrevious: function () {
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
      },

      moveToFirst: function () {
         var first = (this._current ? this._current.getParent() : this._options.tree).getChildren().at(0);
         if (first === this._current) {
            return false;
         }
         this.setCurrent(first);
         return true;
      },

      moveToLast: function () {
         var children = (this._current ? this._current.getParent() : this._options.tree).getChildren(),
            last = children.at(children.getCount() - 1);
         if (last === this._current) {
            return false;
         }
         this.setCurrent(last);
         return true;
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
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} newCurrent Новый текущий элемент
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} oldCurrent Старый текущий элемент
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
    * Обрабатывает событие об изменении содержимого узла дерева
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} item Элемент дерева
    * @param {*} newContents Новое содержимое
    * @param {*}  Старое содержимое
    * @private
    */
   var onSourceTreeItemContentsChange = function (event, item, newContents, oldContents) {
         this._notify(
            'onTreeItemContentsChange',
            item,
            newContents,
            oldContents
         );
   },

   /**
    * Обрабатывает событие об изменении родителя узла дерева
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} item Элемент дерева
    * @param {*} newParent Новый родитель
    * @param {*} oldParent Старый родитель
    * @private
    */
   onSourceTreeItemParentChange = function (event, item, newParent, oldParent) {
      this._notify(
         'onTreeItemParentChange',
         item,
         newParent,
         oldParent
      );
   },

   /**
    * Обрабатывает событие об изменении потомков узла дерева исходного дерева
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {String} action Действие, приведшее к изменению.
    * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem[]} newItems Новые элементы коллеции.
    * @param {Integer} newItemsIndex Индекс, в котором появились новые элементы.
    * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem[]} oldItems Удаленные элементы коллекции.
    * @param {Integer} oldItemsIndex Индекс, в котором удалены элементы.
    * @private
    */
   onSourceCollectionChange = function (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
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
    * Обрабатывает событие о разворачивании/сворачивании узла
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} node Узел
    * @param {Boolean} expanded Развернут или свернут узел.
    * @private
    */
   onSourceTreeNodeToggle = function (event, node, expanded) {
      this._notify(
         'onTreeNodeToggle',
         node,
         expanded
      );
   };

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Projection.Tree', function(config) {
      return new TreeProjection(config);
   });

   return TreeProjection;
});
