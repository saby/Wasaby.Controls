/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Tree', [
   'js!SBIS3.CONTROLS.Data.Projection.ITree',
   'js!SBIS3.CONTROLS.Data.Projection',
   'js!SBIS3.CONTROLS.Data.Projection.Collection',
   'js!SBIS3.CONTROLS.Data.Projection.TreeChildren',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableList',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Projection.LoadableTreeItem'
], function (ITreeProjection, Projection, CollectionProjection, TreeChildren, ObservableList, Utils) {
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
         _itemModule: 'SBIS3.CONTROLS.Data.Projection.TreeItem',

         /**
          * @var {SBIS3.CONTROLS.Data.Projection.TreeItem} Корневой элемент дерева
          */
         _root: undefined,

         /**
          * @var {Object} Стратегия получения дочерних элементов узла
          */
         _childrenStrategy: undefined,

         /**
          * @var {Object} Соответствие элементов и их дочерних узлов
          */
         _childrenMap: {}
      },

      $constructor: function () {
         if (!this._options.idProperty) {
            throw new Error('Option "idProperty" is required.');
         }

         if ($ws.helpers.instanceOfMixin(this._options.collection, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable')) {
            this._itemModule = 'SBIS3.CONTROLS.Data.Projection.LoadableTreeItem';
         }

         this._initChildrenStrategy();

         //TODO: filtering, ordering
      },

      destroy: function () {
         TreeProjection.superclass.destroy.call(this);
      },

      /**
       * Возвращает дочерний элемент узла с указанным хэшем
       * @param {String} hash Хеш элемента
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} [parent] Родительский элемент, в котором искать. Если не указан, ищется от корня
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionItem}
       * @state mutable
       */
      getByHash: function(hash, parent) {
         var children = this.getChildren(parent || this.getRoot()),
            item = children.getByHash(hash);
         if (item === undefined) {
            var enumerator = children.getEnumerator(),
               child;
            while((child = enumerator.getNext())) {
               item = this.getByHash(hash, child);
               if (item !== undefined) {
                  break;
               }
            }
         }
         return item;
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
            index = children.getIndexByHash(hash);
         if (index === -1) {
            var enumerator = children.getEnumerator(),
               child;
            while((child = enumerator.getNext())) {
               index = this.getIndexByHash(hash, child);
               if (index !== -1) {
                  break;
               }
            }
         }
         return index;
      },

      //region SBIS3.CONTROLS.Data.Projection.ICollection

      moveToNext: function () {
         var current = this.getCurrent(),
            parent = current ? current.getParent() : this.getRoot(),
            siblings = this.getChildren(parent),
            index = current ? siblings.getIndex(current) : -1;
         if (index >= siblings.getCount() - 1) {
            return false;
         }

         this.setCurrent(siblings.at(index + 1));
         return true;
      },

      moveToPrevious: function () {
         var current = this.getCurrent();
         if (!current) {
            return false;
         }
         var parent = current.getParent(),
            siblings = this.getChildren(parent),
            index = current ? siblings.getIndex(current) : -1;
         if (index <= 0) {
            return false;
         }

         this.setCurrent(siblings.at(index - 1));
         return true;
      },

      moveToFirst: function () {
         var current = this.getCurrent(),
            parent = current ? current.getParent() : this.getRoot(),
            siblings = this.getChildren(parent),
            first = siblings.at(0);
         if (first === current) {
            return false;
         }

         this.setCurrent(first);
         return true;
      },

      moveToLast: function () {
         var current = this.getCurrent(),
            parent = current ? current.getParent() : this.getRoot(),
            siblings = this.getChildren(parent),
            last = siblings.at(siblings.getCount() - 1);

         if (last === current) {
            return false;
         }

         this.setCurrent(last);
         return true;
      },

      //endregion SBIS3.CONTROLS.Data.Projection.ICollection

      //region SBIS3.CONTROLS.Data.Projection.ITree

      getIdProperty: function () {
         return this._options.idProperty;
      },

      setIdProperty: function (name) {
         this._options.idProperty = name;
      },

      getParentProperty: function () {
         return this._options.parentProperty;
      },

      setParentProperty: function (name) {
         this._options.parentProperty = name;
         this._initChildrenStrategy();
      },

      getNodeProperty: function () {
         return this._options.nodeProperty;
      },

      setNodeProperty: function (name) {
         this._options.nodeProperty = name;
      },

      getChildrenProperty: function () {
         return this._options.childrenProperty;
      },

      setChildrenProperty: function (name) {
         this._options.childrenProperty = name;
         this._initChildrenStrategy();
      },

      getRoot: function () {
         if (this._root === undefined) {
            if (this._options.root && $ws.helpers.instanceOfModule(this._options.root, this._itemModule)) {
               this._root = this._options.root;
            } else {
               var contents = this._options.root;
               if (typeof contents !== 'object') {
                  contents = {};
                  contents[this._options.idProperty] = this._options.root;
               }
               this._root = $ws.single.ioc.resolve(this._itemModule, {
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
            this._childrenMap[hash] = new CollectionProjection({
               collection: new TreeChildren({
                  owner: parent,
                  items: this._childrenStrategy.getChildren(parent) || []
               }),
               itemModule: this._itemModule,
               convertToItem: this._childrenStrategy.getItemConverter(parent).bind(this)
            });
         }

         return this._childrenMap[hash];
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
         var parentIndex = this.getCollection().getIndexByValue(
               this._options.idProperty,
               Utils.getItemPropertyValue(item, this._options.parentProperty)
            ),
            parent;
         if (parentIndex > -1) {
            //FIXME: оптимизировать переиндексацию
            this._getServiceEnumerator().reIndex();
            parent = this.at(parentIndex);
         } else {
            parent = this.getRoot();
         }

         return $ws.single.ioc.resolve(this._itemModule, {
            contents: item,
            owner: this,
            parent: parent,
            node: !!Utils.getItemPropertyValue(item, this._options.nodeProperty)
         });
      },

      /**
       * Инициализирует стратегию получения дочерних элементов узла
       * @private
       */
      _initChildrenStrategy: function() {
         var Strategy;
         if (this._options.childrenProperty) {
            Strategy = TreeChildrenByItemPropertyStrategy;
         } else {
            Strategy = TreeChildrenByParentIdStrategy;
         }
         this._childrenStrategy = new Strategy({
            source: this.getCollection(),
            settings: this._options
         });
      },

      /**
       * Проверяет валидность элемента коллекции
       * @param {*} item Элемент коллекции
       * @private
       */
      _checkItem: function (item) {
         if (!item && !$ws.helpers.instanceOfModule(item, this._itemModule)) {
            throw new Error('Item should be an instance of ' + this._itemModule);
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

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Projection.Tree', function(config) {
      return new TreeProjection(config);
   });

   /**
    * Интерфейс стратегии получения дочерних элементов узла дерева
    * @mixin SBIS3.CONTROLS.Data.Projection.Tree.ITreeChildrenStrategy
    */
   var ITreeChildrenStrategy = /** @lends SBIS3.CONTROLS.Data.Projection.Tree.ITreeChildrenStrategy.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.IEnumerable} Исходная коллекция
             */
            source: undefined,

            /**
             * @cfg {Object} Опции стратегии
             */
            settings: undefined
         }
      },

      /**
       * Возвращает коллекцию потомков для родителя
       * @param {SBIS3.CONTROLS.Data.Projection.ITreeItem} parent Родитель
       * @returns {Array}
       */
      getChildren: function(parent) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает метод конвертации элемета коллеции в элемент проекции
       * @param {SBIS3.CONTROLS.Data.Projection.ITreeItem} parent Родитель
       * @returns {Function}
       */
      getItemConverter: function(parent) {
         throw new Error('Method must be implemented');
      }
   };

   /**
    * Стратегия получения дочерних элементов по идентификатору родителя
    * @class SBIS3.CONTROLS.Data.Projection.Tree.TreeChildrenByParentIdStrategy
    * @mixes SBIS3.CONTROLS.Data.Projection.Tree.ITreeChildrenStrategy
    */
   var TreeChildrenByParentIdStrategy = $ws.core.extend({}, [ITreeChildrenStrategy], /** @lends SBIS3.CONTROLS.Data.Projection.Tree.TreeChildrenByParentIdStrategy.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.Tree.TreeChildrenByParentIdStrategy',
      getChildren: function(parent) {
         return this._options.source.getIndiciesByValue(
            this._options.settings.parentProperty,
            Utils.getItemPropertyValue(
               parent.getContents(),
               this._options.settings.idProperty
            )
         ).map((function(index) {
            return this._options.source.at(index);
         }).bind(this));
      },
      getItemConverter: function() {
         var source = this._options.source;
         return function(item) {
            //FIXME: getIndex не оптимально, оптимизировать
            return this.at(source.getIndex(item));
         };
      }
   });

   /**
    * Стратегия получения дочерних элементов, находящихся в свойстве родительского
    * @class SBIS3.CONTROLS.Data.Projection.Tree.TreeChildrenByItemPropertyStrategy
    * @mixes SBIS3.CONTROLS.Data.Projection.Tree.ITreeChildrenStrategy
    */
   var TreeChildrenByItemPropertyStrategy = $ws.core.extend({}, [ITreeChildrenStrategy], /** @lends SBIS3.CONTROLS.Data.Projection.Tree.TreeChildrenByItemPropertyStrategy.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.Tree.TreeChildrenByItemPropertyStrategy',
      getChildren: function(parent) {
         return parent.isRoot() ?
            this._options.source.toArray() :
            Utils.getItemPropertyValue(
               parent.getContents(),
               this._options.settings.childrenProperty
            );
      },
      getItemConverter: function(parent) {
         return function(item) {
            return $ws.single.ioc.resolve(this._itemModule, {
               contents: item,
               owner: this,
               parent: parent,
               node: !!Utils.getItemPropertyValue(item, this._options.nodeProperty)
            });
         };
      }
   });

   return TreeProjection;
});
