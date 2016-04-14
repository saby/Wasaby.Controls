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
          * @member {Object.<String, Array.<SBIS3.CONTROLS.Data.Projection.TreeItem>>} Соответствие узлов и их потомков
          */
         _childrenMap: {}
      },

      $constructor: function () {
         /*if ($ws.helpers.instanceOfMixin(this._options.collection, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable')) {
            this._itemModule = 'projection.loadable-tree-item';
         }*/
         if (this._options.idProperty) {
            this._setImportantProperty(this._options.idProperty);
         }
         if (this._options.parentProperty) {
            this._setImportantProperty(this._options.parentProperty);
         }
      },

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region SBIS3.CONTROLS.Data.Projection.ICollection

      /**
       * Устанавливает текущим следующий элемент родительского узла.
       * @returns {Boolean} Есть ли следующий элемент в родительском узле
       */
      moveToNext: function () {
         return this._moveTo(true);
      },

      /**
       * Устанавливает текущим предыдущий элемент родительского узла
       * @returns {Boolean} Есть ли предыдущий элемент в родительском узле
       */
      moveToPrevious: function () {
         return this._moveTo(false);
      },

      getNext: function (item) {
         return this._getNearbyItem(item, true, this._getNavigationEnumerator());
      },

      getPrevious: function (item) {
         return this._getNearbyItem(item, false, this._getNavigationEnumerator());
      },

      //endregion SBIS3.CONTROLS.Data.Projection.ICollection

      //region SBIS3.CONTROLS.Data.Projection.ITree

      getIdProperty: function () {
         return this._options.idProperty;
      },

      getParentProperty: function () {
         return this._options.parentProperty;
      },

      setParentProperty: function (name) {
         this._unsetImportantProperty(this._options.parentProperty);
         this._options.parentProperty = name;
         this._setImportantProperty(name);
         this._childrenMap = {};
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

      setRoot: function (root) {
         this._options.root = root;
         this._root = null;
      },

      getChildren: function (parent) {
         return new TreeChildren({
            owner: parent,
            items: this._getChildrenArray(parent)
         });
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
         var children = this._getChildrenArray(current);
         if (children.length === 0) {
            return false;
         }

         this.setCurrent(children[0]);
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
       * Проверяет валидность элемента проекции
       * @param {*} item Элемент проекции
       * @protected
       */
      _checkItem: function (item) {
         if (!item || !$ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.Projection.ICollectionItem')) {
            throw new Error(this._moduleName + '::_checkItem(): item should implement SBIS3.CONTROLS.Data.Projection.ICollectionItem');
         }
      },

      /**
       * Возвращает массив детей для указанного родителя
       * @param {SBIS3.CONTROLS.Data.Projection.ITreeItem} parent Родительский узел
       * @returns {Array.<SBIS3.CONTROLS.Data.Projection.TreeItem>}
       * @protected
       */
      _getChildrenArray: function (parent) {
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

            this._childrenMap[hash] = children;
         }

         return this._childrenMap[hash];
      },

      _getNearbyItem: function (item, isNext, enumerator) {
         var current,
            parent = item && item.getParent() || this.getRoot(),
            hasItem = true,
            sameParent = false,
            method = isNext ? 'getNext' : 'getPrevious';
         //TODO: отлеживать по level, что вышли "выше"
         enumerator.setCurrent(item);
         while (hasItem && !sameParent) {
            hasItem = !!enumerator[method]();
            current = enumerator.getCurrent();
            sameParent = current ? current.getParent() === parent : false;
         }
         if (hasItem && sameParent) {
            if(current && $ws.helpers.instanceOfModule(current.getContents(), 'SBIS3.CONTROLS.Data.Model') && current.getContents().isDeleted()){
               return this._getNearbyItem(current, isNext, enumerator);
            } else {
               return current;

            }
         }
         return undefined;
      },

      _moveTo: function (isNext){
         var enumerator = this._getServiceEnumerator(),
            initial = this.getCurrent(),
            item = this._getNearbyItem(initial, isNext, enumerator),
            hasMove = !!item;
         if (hasMove) {
            this.setCurrent(item);
         } else {
            enumerator.setCurrent(initial);
         }
         return hasMove;
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
               logStamp = 'SBIS3.CONTROLS.Data.Projection.Tree::sorters.tree',
               idProperty = options.idProperty,
               parentProperty = options.parentProperty,
               hierIndex = {},
               parentsProcessing = {},
               buildHierarchy = function(parent) {
                  var result = [],
                     parentData = parent.getContents(),
                     parentId = parentData instanceof Object ? Utils.getItemPropertyValue(
                        parentData,
                        idProperty
                     ) : parentData,
                     children = hierIndex[parentId] || [];

                  if (parentsProcessing[parentId]) {
                     Utils.logger.error(logStamp +': recursive traversal detected: parent with id "' + parentId + '" is already in progress.');
                  } else {
                     //FIXME: для совместимости с логикой контролов - корневые записи дерева могут вообще не иметь поля с именем parentProperty
                     if (!children.length && parentId === null && parent.isRoot()) {
                        //Считаем, что элементы коллекции без поля parentProperty находятся в корне
                        children = hierIndex[undefined] || [];
                     }

                     var i, child;
                     for (i = 0; i < children.length; i++) {
                        child = items[children[i]];
                        if (child) {
                           child.setParent(parent, true);
                        }
                        result.push(children[i]);
                        if (child && idProperty && parentProperty) {
                           parentsProcessing[parentId] = true;
                           push.apply(
                              result,
                              buildHierarchy(child)
                           );
                           parentsProcessing[parentId] = false;
                        }
                     }
                  }

                  return result;
               };

            var index, count, parentId;
            for (index = 0, count = items.length; index < count; index++) {
               parentId = Utils.getItemPropertyValue(
                  items[index].getContents(),
                  parentProperty
               );
               if (!hierIndex.hasOwnProperty(parentId)) {
                  hierIndex[parentId] = [];
               }
               hierIndex[parentId].push(index);
            }

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
