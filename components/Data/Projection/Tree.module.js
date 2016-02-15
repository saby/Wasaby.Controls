/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Tree', [
   'js!SBIS3.CONTROLS.Data.Projection.ITree',
   'js!SBIS3.CONTROLS.Data.Projection.Collection',
   'js!SBIS3.CONTROLS.Data.Projection.TreeChildren',
   'js!SBIS3.CONTROLS.Data.Bind.ICollectionProjection',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Projection.LoadableTreeItem'
], function (
   ITreeProjection,
   CollectionProjection,
   TreeChildren,
   IBindCollectionProjection,
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
            throw new Error(this._moduleName + ': option "idProperty" is required.');
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
               this._root = Di.resolve(this._itemModule, {
                  owner: this,
                  node: true,
                  expanded: true,
                  contents: this._options.root
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

      /**
       * Устанавливает текущим следующий элемент родительского узла.
       * @returns {Boolean} Есть ли следующий элемент в родительском узле
       */
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

      /**
       * Устанавливает текущим предыдущий элемент родительского узла
       * @returns {Boolean} Есть ли предыдущий элемент в родительском узле
       */
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

         this._onSourceCollectionChange = this._onSourceCollectionChange.callAround(_private.onSourceCollectionChange.bind(this));
         this._onSourceCollectionItemChange = this._onSourceCollectionItemChange.callAround(_private.onSourceCollectionItemChange.bind(this));
      },

      _buildSortMap: function () {
         return _private.sorters.tree(
            this._items,
            TreeProjection.superclass._buildSortMap.call(this),
            {
               idProperty: this._options.idProperty,
               parentProperty: this._options.parentProperty,
               collection: this._options.collection,
               root: this.getRoot()
            }
         );
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
            throw new Error(this._moduleName + '::_checkItem(): item should implement SBIS3.CONTROLS.Data.Projection.ICollectionItem');
         }
      }

      //endregion Protected methods

   });

   var _private = {
      sorters: {
         /**
          * Создает индекс сортировки в порядке иерархического индекса "родитель - дети"
          * @param {Array.<SBIS3.CONTROLS.Data.Projection.CollectionItem>} items Элементы проекции.
          * @param {Array.<Number>} currentMap Текущий индекс сортировки
          * @param {Object} options Опции для определения иерархических отношений
          * @return {Array.<Number>}
          * @private
          */
         tree: function (items, currentMap, options) {
            //TODO: enumeration with currentMap order
            var push = Array.prototype.push,
               idProperty = options.idProperty,
               parentProperty = options.parentProperty,
               collection = options.collection,
               buildHierarchy = function(parent) {
                  var result = [],
                     parentData = parent.getContents(),
                     parentId = parentData instanceof Object ? Utils.getItemPropertyValue(
                        parentData,
                        idProperty
                     ) : parentData,
                     children = collection.getIndiciesByValue(
                        parentProperty,
                        parentId
                     );

                  //FIXME: для совместимости с логикой контролов - корневые записи дерева могут вообще не иметь поля с именем parentProperty
                  if (!children.length && parentId === null && parent.isRoot()) {
                     //Считаем, что элементы коллекции без поля parentProperty находятся в корне
                     children = collection.getIndiciesByValue(
                        parentProperty
                     );
                  }

                  var i, child;
                  for (i = 0; i < children.length; i++) {
                     child = items[children[i]];
                     if (child) {
                        child.setParent(parent, true);
                     }
                     result.push(children[i]);
                     if (child) {
                        push.apply(
                           result,
                           buildHierarchy(child)
                        );
                     }
                  }
                  return result;
               };

            return buildHierarchy(options.root);
         }
      },

      /**
       * Обрабатывает событие об изменении исходной коллекции
       * @param {Function} prevFn Оборачиваемый метод
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} action Действие, приведшее к изменению.
       * @param {*[]} newItems Новые элементы коллеции.
       * @param {Number} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {*[]} oldItems Удаленные элементы коллекции.
       * @param {Number} oldItemsIndex Индекс, в котором удалены элементы.
       * @private
       */
      onSourceCollectionChange: function (prevFn, event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
            switch (action) {
               case IBindCollectionProjection.ACTION_ADD:
                  break;

               case IBindCollectionProjection.ACTION_REMOVE:
                  /*var oldItemsProjection = this._getItemsProjection(oldItems, oldItemsIndex),
                     appendItem = function(item) {
                        oldItems.push(item.getContents());
                     },
                     children;
                  for (var i = 0; i < oldItemsProjection.length; i++) {
                     children = this.getChildren(oldItemsProjection[i]);
                     children.each(appendItem);
                  }*/
                  break;

               case IBindCollectionProjection.ACTION_REPLACE:
                  break;

               case IBindCollectionProjection.ACTION_MOVE:
                  break;

               case IBindCollectionProjection.ACTION_RESET:
                  break;
            }

            this._childrenMap = {};
            prevFn.call(this, event, action, newItems, newItemsIndex, oldItems, oldItemsIndex);
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
      onSourceCollectionItemChange: function (prevFn, event, item, index, property) {
         this._childrenMap = {};
         prevFn.call(this, event, item, index, property);
      }
   };

   Di.register('projection.tree', TreeProjection);

   return TreeProjection;
});
