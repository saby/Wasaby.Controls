/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Tree', [
   'js!SBIS3.CONTROLS.Data.Projection.ITree',
   'js!SBIS3.CONTROLS.Data.Projection',
   'js!SBIS3.CONTROLS.Data.Projection.Collection',
   'js!SBIS3.CONTROLS.Data.Tree.TreeChildren',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableList',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Tree.LoadableTreeItem'
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
         _itemModule: 'SBIS3.CONTROLS.Data.Tree.LoadableTreeItem',

         /**
          * @var {SBIS3.CONTROLS.Data.Tree.TreeItem} Корневой элемент дерева
          */
         _root: undefined,

         /**
          * @var {Object} Соответствие элементов и их дочерних узлов
          */
         _childrenMap: {}
      },

      $constructor: function () {
         if (!this._options.idProperty) {
            throw new Error('Option "idProperty" is required.');
         }

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

      getRoot: function () {
         if (this._root === undefined) {
            if (this._options.root && $ws.helpers.instanceOfModule(this._options.root, this._itemModule)) {
               this._root = this._options.root;
            } else {
               this._root = $ws.single.ioc.resolve(this._itemModule, {
                  owner: this,
                  node: true,
                  contents: this._options.root
               });
            }
         }

         return this._root;
      },

      getChildren: function (item) {
         this._checkItem(item);
         var hash = item.getHash();
         if (!(hash in this._childrenMap)) {
            var projection = this,
               collection = this.getCollection(),
               nodeProperty = this._options.nodeProperty;
            this._childrenMap[hash] = new CollectionProjection({
               collection: new TreeChildren({
                  owner: item,
                  items: this.getCollection().getItemsByPropertyValue(
                     this._options.parentProperty,
                     Utils.getItemPropertyValue(
                        item.getContents(),
                        this._options.idProperty
                     )
                  )
               }),
               itemModule: this._itemModule,
               convertToItem: function (child) {
                  //FIXME: переделать, так слишком накладно
                  var index = collection.getIndex(child);
                  return projection.at(index);
               }
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

      _convertToItem: function (item) {
         var parentIndex = this.getCollection().getItemIndexByPropertyValue(
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
       * Проверяет валидность элемента коллекции
       * @param {*} item Элемент коллекции
       * @private
       */
      _checkItem: function (item) {
         if (!item && !$ws.helpers.instanceOfModule(item, this._itemModule)) {
            throw new Error('Item should be an instance of ' + this._itemModule);
         }
      },

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
