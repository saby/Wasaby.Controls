/* global define */
define('js!WS.Data/Display/Tree', [
   'js!WS.Data/Display/Collection',
   'js!WS.Data/Display/IBindCollection',
   'js!WS.Data/Display/TreeItem',
   'js!WS.Data/Display/TreeChildren',
   'js!WS.Data/Display/ItemsStrategy/AdjacencyList',
   'js!WS.Data/Display/ItemsStrategy/MaterializedPath',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'Core/core-instance',
   'Core/helpers/collection-helpers'
], function (
   Collection,
   IBindCollectionDisplay,
   TreeItem,
   TreeChildren,
   AdjacencyListStrategy,
   MaterializedPathStrategy,
   Di,
   Utils,
   CoreInstance,
   CollectionHelpers
) {
   'use strict';

   /**
    * Проекция в виде дерева - предоставляет методы навигации, фильтрации и сортировки, не меняя при этом исходную коллекцию.
    * Дерево может строиться по алгоритму {@link https://en.wikipedia.org/wiki/Adjacency_list Adjacency List} или {@link https://docs.mongodb.com/v3.2/tutorial/model-tree-structures-with-materialized-paths/ Materialized Path}. Выбор алгоритма выполняется в зависимости от настроек.
    * @class WS.Data/Display/Tree
    * @extends WS.Data/Display/Collection
    * @public
    * @author Мальцев Алексей
    */

   var Tree = Collection.extend(/** @lends WS.Data/Display/Tree.prototype */{
      _moduleName: 'WS.Data/Display/Tree',

      _itemModule: 'display.tree-item',

      /**
       * @cfg {String} Название свойства, содержащего идентификатор узла. Дерево в этом случае строится по алгоритму Adjacency List (список смежных вершин).
       * @name WS.Data/Display/Tree#idProperty
       */
      _$idProperty: '',

      /**
       * @cfg {String} Название свойства, содержащего идентификатор родительского узла. Дерево в этом случае строится по алгоритму Adjacency List (список смежных вершин).
       * @name WS.Data/Display/Tree#parentProperty
       */
      _$parentProperty: '',

      /**
       * @cfg {String} Название свойства, содержащего признак узла. Требуется для различения узлов и листьев.
       * @name WS.Data/Display/Tree#nodeProperty
       */
      _$nodeProperty: '',

      /**
       * @cfg {String} Название свойства, содержащего дочерние элементы узла. Дерево в этом случае строится по алгоритму Materialized Path (материализованный путь).
       * @remark Если задано, то опции {@link idProperty} и {@link parentProperty} не используются.
       * @name WS.Data/Display/Tree#childrenProperty
       */
      _$childrenProperty: '',

      /**
       * @cfg {String} Название свойства, содержащего признак загруженности узла
       * @name WS.Data/Display/Tree#loadedProperty
       * @example
       * Зададим поле "Раздел$" отвечающим за признак загруженности:
       * <pre>
       *    new Tree({
       *       parentProperty: 'Раздел',
       *       loadedProperty: 'Раздел$'
       *    })
       * </pre>
       *
       */
      _$loadedProperty: '',

      /**
       * @cfg {Boolean} Обеспечивать уникальность элементов (элементы с повторяющимися идентфикаторами будут игнорироваться).
       * @name WS.Data/Display/Tree#unique
       */
      _$unique: false,

      /**
       * @cfg {WS.Data/Display/TreeItem|*} Корневой узел или его содержимое
       * @name WS.Data/Display/Tree#root
       */
      _$root: undefined,

      /**
       * @cfg {Boolean} Включать корневой узел в список элементов
       * @name WS.Data/Display/Tree#rootEnumerable
       * @example
       * Получим корень как первый элемент проекции:
       * <pre>
       *    var tree = new Tree({
       *       root: {id: null, title: 'Root'},
       *       rootEnumerable: true
       *    });
       *    tree.at(0).getContents().title;//'Root'
       * </pre>
       *
       */
      _$rootEnumerable: false,

      /**
       * @member {WS.Data/Display/TreeItem} Корневой элемент дерева
       */
      _root: null,

      /**
       * @member {Object.<String, Array.<WS.Data/Display/TreeItem>>} Соответствие узлов и их потомков
       */
      _childrenMap: {},

      constructor: function $Tree(options) {
         this._childrenMap = {};
         Tree.superclass.constructor.call(this, options);

         if (this._$rootEnumerable) {
            this._addRootToItems();
         }

         if (this._$idProperty) {
            this._setImportantProperty(this._$idProperty);
         }
         if (this._$parentProperty) {
            this._setImportantProperty(this._$parentProperty);
         }
         if (this._$childrenProperty) {
            this._setImportantProperty(this._$childrenProperty);
         }
      },

      destroy: function () {
         this._childrenMap = {};

         Tree.superclass.destroy.call(this);
      },

      //region WS.Data/Collection/IEnumerable

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Entity/SerializableMixin

      _getSerializableState: function(state) {
         state = Tree.superclass._getSerializableState.call(this, state);

         state._root = this._root;

         return state;
      },

      _setSerializableState: function(state) {
         return Tree.superclass._setSerializableState(state).callBefore(function() {
            this._root = state._root;
         });
      },

      //region WS.Data/Display/Collection

      /**
       * Устанавливает текущим следующий элемент родительского узла.
       * @return {Boolean} Есть ли следующий элемент в родительском узле
       */
      moveToNext: function () {
         return this._moveTo(true);
      },

      /**
       * Устанавливает текущим предыдущий элемент родительского узла
       * @return {Boolean} Есть ли предыдущий элемент в родительском узле
       */
      moveToPrevious: function () {
         return this._moveTo(false);
      },

      getNext: function (item) {
         return this._getNearbyItem(item, true, this._getUtilityEnumerator());
      },

      getPrevious: function (item) {
         return this._getNearbyItem(item, false, this._getUtilityEnumerator());
      },

      //endregion WS.Data/Display/Collection

      //region Public methods

      /**
       * Возвращает название свойства, содержащего идентификатор узла
       * @return {String}
       */
      getIdProperty: function () {
         return this._$idProperty;
      },

      /**
       * Возвращает название свойства, содержащего идентификатор родительского узла
       * @return {String}
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
         this._getItemsStrategy().getOptions().parentProperty = name;
         this._setImportantProperty(name);
         this._reIndex();
         this._reAnalize();
      },

      /**
       * Возвращает название свойства, содержащего признак узла
       * @return {String}
       */
      getNodeProperty: function () {
         return this._$nodeProperty;
      },

      /**
       * Возвращает название свойства, содержащего дочерние элементы узла
       * @return {String}
       */
      getChildrenProperty: function () {
         return this._$childrenProperty;
      },

      /**
       * Возвращает название свойства, содержащего признак загруженности узла
       * @return {String}
       */
      getLoadedProperty: function () {
         return this._$loadedProperty;
      },

      /**
       * Возвращает признак обеспечивания уникальности элементов
       * @return {Boolean}
       */
      isUnique: function () {
         return this._$unique;
      },

      /**
       * Возвращает признак обеспечивания уникальности элементов
       * @param {String} unique Обеспечивать уникальность элементов
       */
      setUnique: function (unique) {
         if (this._$unique === unique) {
            return;
         }
         this._$unique = unique;
         this._getItemsStrategy().getOptions().unique = unique;

         var session = this._startUpdateSession();
         this._reSort();
         this._finishUpdateSession(session);
      },

      /**
       * Возвращает корневой узел дерева
       * @return {WS.Data/Display/TreeItem}
       */
      getRoot: function () {
         if (this._root === null) {
            this._root = this._getItemsStrategy().convertToItemIf(this._$root, {
               node: true,
               expanded: true
            });
         }

         return this._root;
      },

      /**
       * Устанавливает корневой узел дерева
       * @param {WS.Data/Display/TreeItem|*} root Корневой узел или его содержимое
       */
      setRoot: function (root) {
         this._$root = root;
         this._root = null;
         this._reIndex();
         this._reAnalize();
      },

      /**
       * Возвращает признак, что корневой узел включен в список элементов
       * @return {Boolean}
       */
      isRootEnumerable: function () {
         return this._$rootEnumerable;
      },

      /**
       * Устанавливает признак, что корневой узел включен в список элементов
       * @param {Boolean} enumerable Корневой узел включен в список элементов
       */
      setRootEnumerable: function (enumerable) {
         if (this._$rootEnumerable === enumerable) {
            return;
         }
         this._$rootEnumerable = enumerable;

         var session = this._startUpdateSession();
         if (enumerable) {
            this._addRootToItems();
         } else {
            this._removeRootFromItems();
         }
         this._finishUpdateSession(session);
      },

      /**
       * Возвращает коллекцию потомков элемента коллекции
       * @param {WS.Data/Display/TreeItem} parent Родительский узел
       * @param {Boolean} [withFilter=true] Учитывать {@link setFilter фильтр}
       * @return {WS.Data/Display/TreeChildren}
       */
      getChildren: function (parent, withFilter) {
         return new TreeChildren({
            owner: parent,
            items: this._getChildrenArray(parent, withFilter)
         });
      },

      /**
       * Устанавливает текущим родителя текущего элемента
       * @return {Boolean} Есть ли родитель
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
       * @return {Boolean} Есть ли первый потомок
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

      _createItemsStrategy: function () {
         if (this._$childrenProperty) {
            return new MaterializedPathStrategy(this, {
               itemModule: this._itemModule,
               childrenProperty: this._$childrenProperty,
               nodeProperty: this._$nodeProperty,
               loadedProperty: this._$loadedProperty,
               root: this.getRoot.bind(this)
            });
         } else {
            return new AdjacencyListStrategy(this, {
               itemModule: this._itemModule,
               idProperty: this._$idProperty,
               parentProperty: this._$parentProperty,
               nodeProperty: this._$nodeProperty,
               loadedProperty: this._$loadedProperty,
               unique: this._$unique,
               root: this.getRoot.bind(this)
            });
         }
      },

      _getItemIndex: function (sourceIndex) {
         sourceIndex = Tree.superclass._getItemIndex.call(this, sourceIndex);
         if (this._$rootEnumerable && sourceIndex > -1) {
            sourceIndex++;
         }
         return sourceIndex;
      },

      _getSourceIndex: function (index) {
         index = Tree.superclass._getSourceIndex.call(this, index);
         if (this._$rootEnumerable) {
            if (index < 1) {
               return -1;
            }
            index--;
         }
         return index;
      },

      _buildSortMap: function () {
         var result = Tree.superclass._buildSortMap.call(this);
         if (this._$rootEnumerable) {
            result.unshift(0);//Put root first
         }
         return result;
      },

      _reIndex: function() {
         Tree.superclass._reIndex.call(this);
         this._childrenMap = {};
      },

      _bindHandlers: function() {
         Tree.superclass._bindHandlers.call(this);

         this._onSourceCollectionChange = this._onSourceCollectionChange.callAround(_private.onSourceCollectionChange.bind(this));
         this._onSourceCollectionItemChange = this._onSourceCollectionItemChange.callAround(_private.onSourceCollectionItemChange.bind(this));
      },

      /**
       * Проверяет валидность элемента проекции
       * @param {*} item Элемент проекции
       * @protected
       */
      _checkItem: function (item) {
         if (!item || !CoreInstance.instanceOfModule(item, 'WS.Data/Display/CollectionItem')) {
            throw new Error(this._moduleName + '::_checkItem(): item should be in instance of WS.Data/Display/CollectionItem');
         }
      },

      /**
       * Добавляет корень в _getItems(), запускает перерасчет индексов
       * @protected
       */
      _addRootToItems: function () {
         this._addItems(0, [this.getRoot()]);
         this._reSort();
         if (this._isFiltered()) {
            this._reFilter(0, 1);
         }
      },

      /**
       * Удаляет корень из _getItems(), запускает перерасчет индексов
       * @protected
       */
      _removeRootFromItems: function () {
         this._removeItems(0, 1);
         this._reSort();
      },

      /**
       * Возвращает массив детей для указанного родителя
       * @param {WS.Data/Display/TreeItem} parent Родительский узел
       * @param {Boolean} [withFilter=true] Учитывать {@link setFilter фильтр}
       * @return {Array.<WS.Data/Display/TreeItem>}
       * @protected
       */
      _getChildrenArray: function (parent, withFilter) {
         this._checkItem(parent);

         withFilter = withFilter === undefined ? true : !!withFilter;
         var iid = parent.getInstanceId(),
            key = iid + '|' + withFilter;

         if (!(key in this._childrenMap)) {
            var children = [],
               enumerator;

            if (withFilter) {
               enumerator = this.getEnumerator();
            } else {
               enumerator = this._buildEnumerator(
                  this._getItems(),
                  CollectionHelpers.map(this._filterMap, function() {
                     return true;
                  }),
                  this._sortMap
               );
            }

            enumerator.setCurrent(parent);
            if (enumerator.getCurrent() === parent || parent.isRoot()) {
               var item;
               while (enumerator.moveNext()) {
                  item = enumerator.getCurrent();
                  if (item.getParent() === parent) {
                     children.push(item);
                  } else if (item.getLevel() === parent.getLevel()) {
                     break;
                  }
               }
            }

            this._childrenMap[key] = children;
         }

         return this._childrenMap[key];
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
         enumerator.setCurrent(initial);

         return current;
      },

      _moveTo: function (isNext) {
         var enumerator = this._getCursorEnumerator(),
            initial = this.getCurrent(),
            item = this._getNearbyItem(initial, isNext, enumerator),
            hasMove = !!item;
         if (hasMove) {
            this.setCurrent(item);
         } else {
            enumerator.setCurrent(initial);
         }
         return hasMove;
      },

      _notifyItemsParent: function(treeItem, oldParent, properties) {
         if (properties.hasOwnProperty(this.getParentProperty())) {
            this._notifyItemsParentByItem(treeItem.getParent());
            this._notifyItemsParentByItem(oldParent);
         }
      },

      _notifyItemsParentByItem: function(treeItem) {
         while (treeItem !== this.getRoot()) {
            this.notifyItemChange(treeItem, {children: []});
            treeItem = treeItem.getParent();
         }
      }
      //endregion Protected methods

   });

   var _private = {
      /**
       * Обрабатывает событие об изменении исходной коллекции
       * @param {Function} prevFn Оборачиваемый метод
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} action Действие, приведшее к изменению.
       * @param {*[]} newItems Новые элементы коллекции.
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
       * @param {*} item Измененный элемент коллекции.
       * @param {Number} index Индекс измененного элемента.
       * @param {Object} properties Объект содержащий измененные свойства элемента
       * @private
       */
      onSourceCollectionItemChange: function (prevFn, event, item, index, properties) {
         var treeItem = this.getItemBySourceIndex(index),
            parent = treeItem ? treeItem.getParent() : undefined; //брать родителя надо до изменеия проекции
         this._reIndex();
         prevFn.call(this, event, item, index, properties);
         if (treeItem) {
            this._notifyItemsParent(treeItem, parent, properties);
         }
      }

   };

   Di.register('display.tree', Tree);

   return Tree;
});
