/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Tree', [
   'js!SBIS3.CONTROLS.Data.Projection.ITree',
   'js!SBIS3.CONTROLS.Data.Projection.Collection',
   'js!SBIS3.CONTROLS.Data.Projection.TreeEnumerator',
   'js!SBIS3.CONTROLS.Data.Projection.TreeChildren',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Projection.LoadableTreeItem'
], function (
   ITreeProjection,
   CollectionProjection,
   TreeEnumerator,
   TreeChildren,
   Di,
   Utils
) {
   'use strict';

   /**
    * Проекция в виде дерева - предоставляет методы навигации, фильтрации и сортировки, не меняя при этом исходную коллецию
    * @class SBIS3.CONTROLS.Data.Projection.Tree
    * @extends SBIS3.CONTROLS.Data.Projection.Collection
    * @mixes SBIS3.CONTROLS.Data.Projection.ITree
    * @public
    * @author Мальцев Алексей
    */
   //TODO: ordering

   var TreeProjection = CollectionProjection.extend([ITreeProjection], /** @lends SBIS3.CONTROLS.Data.Projection.Tree.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.Tree',
      $protected: {
         _itemModule: 'projection.tree-item',

         /**
          * @member {SBIS3.CONTROLS.Data.Projection.TreeItem} Корневой элемент дерева
          */
         _root: null,

         /**
          * @member {Object.<String, SBIS3.CONTROLS.Data.Projection.TreeChildren>} Соответствие узлов и их потомков
          */
         _childrenMap: {}
      },

      $constructor: function () {
         if (!this._options.idProperty) {
            throw new Error('Option "idProperty" is required.');
         }

         /*if ($ws.helpers.instanceOfMixin(this._options.collection, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable')) {
            this._itemModule = 'projection.loadable-tree-item';
         }*/
      },

      //region mutable

      /**
       * Возвращает дочерний элемент узла с указанным хэшем
       * @param {String} hash Хеш элемента
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} [parent] Родительский элемент, в котором искать. Если не указан, ищется от корня
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionItem}
       * @state mutable
       */
      getByHash: function(hash, parent) {
         var children = this.getChildren(parent || this.getRoot()),
            index = children.getIndexByValue('hash', hash);
         if (index !== -1) {
            return children.at(index);
         }

         var enumerator = children.getEnumerator(),
            child,
            item;
         while((child = enumerator.getNext())) {
            item = this.getByHash(hash, child);
            if (item !== undefined) {
               return item;
            }
         }
      },

      /**
       * Возвращает индекс дочернего элемента узла с указанным хэшем
       * @param {String} hash Хеш элемента
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} [parent] Родительский элемент, в котором искать. Если не указан, ищется от корня
       * @returns {Number}
       * @state mutable
       */
      getIndexByHash: function (hash, parent) {
         var children = this.getChildren(parent || this.getRoot()),
            index = children.getIndexByValue('hash', hash);
         if (index !== -1) {
            return index;
         }

         var enumerator = children.getEnumerator(),
            child;
         while((child = enumerator.getNext())) {
            index = this.getIndexByHash(hash, child);
            if (index !== -1) {
               return index;
            }
         }
      },

      //endregion mutable

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      /**
       * Возвращает энумератор для перебора элементов проекции
       * @returns {SBIS3.CONTROLS.Data.Projection.TreeEnumerator}
       */
      getEnumerator: function () {
         /*if (this._options.childrenProperty) {
          Enumerator = TreeChildrenByItemPropertyEnumerator;
         } else {
          Enumerator = TreeChildrenByParentIdEnumerator;
         }*/
         return new TreeEnumerator({
            itemsMap: this._itemsMap,
            filterMap: this._filterMap,
            sortMap: this._sortMap,
            collection: this._options.collection,
            root: this.getRoot(),
            idProperty: this._options.idProperty,
            parentProperty: this._options.parentProperty
         });
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region SBIS3.CONTROLS.Data.Projection.ICollection

      //endregion SBIS3.CONTROLS.Data.Projection.ICollection

      //region SBIS3.CONTROLS.Data.Projection.ITree

      getIdProperty: function () {
         return this._options.idProperty;
      },

      getParentProperty: function () {
         return this._options.parentProperty;
      },

      getNodeProperty: function () {
         return this._options.nodeProperty;
      },

      getChildrenProperty: function () {
         return this._options.childrenProperty;
      },

      getRoot: function () {
         if (this._root === null) {
            if (this._options.root && $ws.helpers.instanceOfMixin(this._options.root, 'SBIS3.CONTROLS.Data.Projection.ICollectionItem')) {
               this._root = this._options.root;
            } else {
               var contents = this._options.root;
               if (typeof contents !== 'object') {
                  contents = {};
                  contents[this._options.idProperty] = this._options.root;
               }
               this._root = Di.resolve(this._itemModule, {
                  owner: this,
                  node: true,
                  expanded: true,
                  contents: contents
               });
            }
         }

         return this._root;
      },

      getChildren: function (parent) {
         this._checkItem(parent);

         var hash = parent.getHash();
         if (!(hash in this._childrenMap)) {
            var children = [],
               enumerator = this.getEnumerator();
            enumerator.setCurrent(parent);
            if (enumerator.getCurrent() === parent || parent.isRoot()) {
               var item;
               while ((item = enumerator.getNext())) {
                  if (item.getParent() === parent) {
                     children.push(item);
                  }
               }
            }

            this._childrenMap[hash] = new TreeChildren({
               owner: parent,
               items: children
            });
         }

         return this._childrenMap[hash];
      },

      moveToNext: function () {
         //TODO: отлеживать по level, что вышли "выше"
         var enumerator = this._getServiceEnumerator(),
            initial = this.getCurrent(),
            current,
            parent = initial && initial.getParent() || this.getRoot(),
            hasNext = true,
            hasMove = false,
            sameParent = false;
         while (hasNext && !sameParent) {
            hasNext = !!enumerator.getNext();
            current = enumerator.getCurrent();
            sameParent = current.getParent() === parent;
            hasMove = hasNext && sameParent;
         }
         if (hasMove) {
            this.setCurrent(current);
         } else {
            enumerator.setCurrent(initial);
         }
         return hasMove;
      },

      moveToPrevious: function () {
         //TODO: отлеживать по level, что вышли "выше"
         var enumerator = this._getServiceEnumerator(),
            initial = this.getCurrent(),
            current,
            parent = initial && initial.getParent() || this.getRoot(),
            hasPrevious = true,
            hasMove = false,
            sameParent = false;
         while (hasPrevious && !sameParent) {
            hasPrevious = !!enumerator.getPrevious();
            current = enumerator.getCurrent();
            sameParent = current.getParent() === parent;
            hasMove = hasPrevious && sameParent;
         }
         if (hasMove) {
            this.setCurrent(current);
         } else {
            enumerator.setCurrent(initial);
         }
         return hasMove;
      },

      moveToAbove: function () {
         var current = this.getCurrent();
         if (!current) {
            return false;
         }
         var parent = current.getParent();
         if (!parent || parent.isRoot()) {
            return false;
         }

         this.setCurrent(parent);
         return true;
      },

      moveToBelow: function () {
         var current = this.getCurrent();
         if (!current || !current.isNode()) {
            return false;
         }
         if (!current.isExpanded()) {
            current.setExpanded(true);
         }
         var children = this.getChildren(current);
         if (children.getCount() === 0) {
            return false;
         }

         this.setCurrent(children.at(0));
         return true;
      },

      //endregion SBIS3.CONTROLS.Data.Projection.ITree

      //region Protected methods

      _bindHandlers: function() {
         TreeProjection.superclass._bindHandlers.call(this);

         this._onSourceCollectionChange = this._onSourceCollectionChange.callAround(onSourceCollectionChange.bind(this));
         this._onSourceCollectionItemChange = this._onSourceCollectionItemChange.callAround(onSourceCollectionItemChange.bind(this));
      },

      _convertToItem: function (item) {
         return Di.resolve(this._itemModule, {
            contents: item,
            owner: this,
            node: !!Utils.getItemPropertyValue(item, this._options.nodeProperty)
         });
      },

      /**
       * Проверяет валидность элемента коллекции
       * @param {*} item Элемент коллекции
       * @protected
       */
      _checkItem: function (item) {
         if (!item || !$ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.Projection.ICollectionItem')) {
            throw new Error('Item should implement SBIS3.CONTROLS.Data.Projection.ICollectionItem');
         }
      }

      //endregion Protected methods

   });

   /**
    * Обрабатывает событие об изменении потомков узла дерева исходного дерева
    * @param {Function} prevFn Оборачиваемый метод
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {String} action Действие, приведшее к изменению.
    * @param {*[]} newItems Новые элементы коллеции.
    * @param {Number} newItemsIndex Индекс, в котором появились новые элементы.
    * @param {*[]} oldItems Удаленные элементы коллекции.
    * @param {Number} oldItemsIndex Индекс, в котором удалены элементы.
    * @private
    */
   var onSourceCollectionChange = function (prevFn, event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         this._childrenMap = {};

         Array.prototype.shift.call(arguments);
         prevFn.apply(this, arguments);
   },

   /**
    * Обрабатывает событие об изменении элемента исходной коллекции
    * @param {Function} prevFn Оборачиваемый метод
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {*} item Измененный элемент коллеции.
    * @param {Integer} index Индекс измененного элемента.
    * @param {String} [property] Измененное свойство элемента
    * @private
    */
   onSourceCollectionItemChange = function (prevFn, event, item, index, property) {
      Array.prototype.shift.call(arguments);
      prevFn.apply(this, arguments);
   };

   Di.register('projection.tree', TreeProjection);

   return TreeProjection;
});
