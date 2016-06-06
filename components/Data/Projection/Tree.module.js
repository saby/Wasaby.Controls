/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Tree', [
   'js!SBIS3.CONTROLS.Data.Projection.Collection',
   'js!SBIS3.CONTROLS.Data.Bind.ICollectionProjection',
   'js!SBIS3.CONTROLS.Data.Projection.TreeChildren',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Projection.LoadableTreeItem'
], function (
   CollectionProjection,
   IBindCollectionProjection,
   TreeChildren,
   Di,
   Utils
) {
   'use strict';

   /**
    * Проекция в виде дерева - предоставляет методы навигации, фильтрации и сортировки, не меняя при этом исходную коллецию
    * @class SBIS3.CONTROLS.Data.Projection.Tree
    * @extends SBIS3.CONTROLS.Data.Projection.Collection
    * @public
    * @author Мальцев Алексей
    */

   var TreeProjection = CollectionProjection.extend(/** @lends SBIS3.CONTROLS.Data.Projection.Tree.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.Tree',

      _itemModule: 'projection.tree-item',

      /**
       * @cfg {String} Название свойства, содержащего идентификатор узла.
       * @name SBIS3.CONTROLS.Data.Projection.Tree#idProperty
       */
      _$idProperty: '',

      /**
       * @cfg {String} Название свойства, содержащего идентификатор родительского узла.
       * @name SBIS3.CONTROLS.Data.Projection.Tree#parentProperty
       */
      _$parentProperty: '',

      /**
       * @cfg {String} Название свойства, содержащего признак узла.
       * @name SBIS3.CONTROLS.Data.Projection.Tree#nodeProperty
       */
      _$nodeProperty: '',

      /**
       * @cfg {String} Название свойства, содержащего дочерние элементы узла.
       * @name SBIS3.CONTROLS.Data.Projection.Tree#childrenProperty
       */
      _$childrenProperty: '',

      /**
       * @cfg {SBIS3.CONTROLS.Data.Projection.TreeItem|*} Корневой узел или его содержимое
       * @name SBIS3.CONTROLS.Data.Projection.Tree#root
       */
      _$root: undefined,

      /**
       * @cfg {String} Название свойства, содержащего признак загруженности узла
       * <pre>
       *    new Tree({
       *       parentProperty: 'Раздел'
       *       loadedProperty: 'Раздел$'
       *    })
       * </pre>
       *
       */
      _$loadedProperty: '',

      /**
       * @member {SBIS3.CONTROLS.Data.Projection.TreeItem} Корневой элемент дерева
       */
      _root: null,

      /**
       * @member {Object.<String, Array.<SBIS3.CONTROLS.Data.Projection.TreeItem>>} Соответствие узлов и их потомков
       */
      _childrenMap: {},

      constructor: function $TreeProjection(options) {
         this._childrenMap = {};
         TreeProjection.superclass.constructor.call(this, options);

         /*if ($ws.helpers.instanceOfMixin(this._$collection, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable')) {
            this._itemModule = 'projection.loadable-tree-item';
         }*/
         if (this._$idProperty) {
            this._setImportantProperty(this._$idProperty);
         } else {
            Utils.logger.info(this._moduleName +'::constructor(): option "idProperty" is not defined - only root elements will be presented');
         }
         if (this._$parentProperty) {
            this._setImportantProperty(this._$parentProperty);
         }
      },

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region SBIS3.CONTROLS.Data.Projection.Collection

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

      //endregion SBIS3.CONTROLS.Data.Projection.Collection

      //region Public methods

      /**
       * Возвращает название свойства, содержащего идентификатор узла
       * @returns {String}
       */
      getIdProperty: function () {
         return this._$idProperty;
      },

      /**
       * Возвращает название свойства, содержащего идентификатор родительского узла
       * @returns {String}
       */
      getParentProperty: function () {
         return this._$parentProperty;
      },

      /**
       * Устанавливает название свойства, содержащего идентификатор родительского узла
       * @param {String} name
       */
      setParentProperty: function (name) {
         this._unsetImportantProperty(this._$parentProperty);
         this._$parentProperty = name;
         this._setImportantProperty(name);
         this._reIndex();
         this._reAnalize();
      },

      /**
       * Возвращает название свойства, содержащего признак узла
       * @returns {String}
       */
      getNodeProperty: function () {
         return this._$nodeProperty;
      },

      /**
       * Возвращает название свойства, содержащего дочерние элементы узла
       * @returns {String}
       */
      getChildrenProperty: function () {
         return this._$childrenProperty;
      },

      /**
       * Возвращает корневой узел дерева
       * @returns {SBIS3.CONTROLS.Data.Projection.TreeItem}
       */
      getRoot: function () {
         if (this._root === null) {
            if (this._$root && $ws.helpers.instanceOfModule(this._$root, 'SBIS3.CONTROLS.Data.Projection.CollectionItem')) {
               this._root = this._$root;
            } else {
               this._root = Di.resolve(this._itemModule, {
                  owner: this,
                  node: true,
                  expanded: true,
                  contents: this._$root,
                  loadedProperty: this._$loadedProperty
               });
            }
         }

         return this._root;
      },

      /**
       * Устанавливает корневой узел дерева
       * @param {SBIS3.CONTROLS.Data.Projection.TreeItem|*} root Корневой узел или его содержимое
       * @returns {SBIS3.CONTROLS.Data.Projection.TreeItem}
       */
      setRoot: function (root) {
         this._$root = root;
         this._root = null;
         this._reIndex();
         this._reAnalize();
      },

      /**
       * Возвращает коллекцию потомков элемента коллеции
       * @param {SBIS3.CONTROLS.Data.Projection.TreeItem} parent Родительский узел
       * @returns {SBIS3.CONTROLS.Data.Projection.TreeChildren}
       */
      getChildren: function (parent) {
         return new TreeChildren({
            owner: parent,
            items: this._getChildrenArray(parent)
         });
      },

      /**
       * Устанавливает текущим родителя текущего элемента
       * @returns {Boolean} Есть ли родитель
       */
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

      /**
       * Устанавливает текущим первого непосредственного потомка текущего элемента
       * @returns {Boolean} Есть ли первый потомок
       */
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

      //endregion Public methods

      //region Protected methods

      _reIndex: function() {
         TreeProjection.superclass._reIndex.call(this);
         this._childrenMap = {};
      },

      _bindHandlers: function() {
         TreeProjection.superclass._bindHandlers.call(this);

         this._onSourceCollectionChange = this._onSourceCollectionChange.callAround(_private.onSourceCollectionChange.bind(this));
         this._onSourceCollectionItemChange = this._onSourceCollectionItemChange.callAround(_private.onSourceCollectionItemChange.bind(this));
      },

      _buildSortMap: function () {
         var sortMap = TreeProjection.superclass._buildSortMap.call(this);
         return _private.sorters.tree(
            this._items,
            sortMap,
            {
               idProperty: this._$idProperty,
               parentProperty: this._$parentProperty,
               root: this.getRoot()
            }
         );
      },

      _convertToItem: function (item) {
         return Di.resolve(this._itemModule, {
            contents: item,
            owner: this,
            node: !!Utils.getItemPropertyValue(item, this._$nodeProperty),
            loadedProperty: this._$loadedProperty
         });
      },

      /**
       * Проверяет валидность элемента проекции
       * @param {*} item Элемент проекции
       * @protected
       */
      _checkItem: function (item) {
         if (!item || !$ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Projection.CollectionItem')) {
            throw new Error(this._moduleName + '::_checkItem(): item should be in instance of SBIS3.CONTROLS.Data.Projection.CollectionItem');
         }
      },

      /**
       * Возвращает массив детей для указанного родителя
       * @param {SBIS3.CONTROLS.Data.Projection.TreeItem} parent Родительский узел
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
            initial = initial || enumerator.getCurrent(),
            sameParent = false,
            method = isNext ? 'getNext' : 'getPrevious';
         //TODO: отлеживать по level, что вышли "выше"
         enumerator.setCurrent(item);
         while (hasItem && !sameParent) {
            hasItem = !!enumerator[method]();
            var nearbyItem = enumerator.getCurrent();
            sameParent = nearbyItem ? nearbyItem.getParent() === parent : false;
            current = (hasItem && sameParent) ? nearbyItem : undefined;
         }
         if (current && $ws.helpers.instanceOfModule(current.getContents(), 'SBIS3.CONTROLS.Data.Model') && current.getContents().isDeleted()) {
            current = this._getNearbyItem(current, isNext, enumerator, initial);
         }
         enumerator.setCurrent(initial);
         return current;
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

            var index, count, itemIndex, parentId;
            for (index = 0, count = currentMap.length; index < count; index++) {
               itemIndex = currentMap[index];
               parentId = Utils.getItemPropertyValue(
                  items[itemIndex].getContents(),
                  parentProperty
               );
               if (!hierIndex.hasOwnProperty(parentId)) {
                  hierIndex[parentId] = [];
               }
               hierIndex[parentId].push(itemIndex);
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
         this._reIndex();
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
         this._reIndex();
         prevFn.call(this, event, item, index, property);
      }
   };

   Di.register('projection.tree', TreeProjection);

   return TreeProjection;
});
