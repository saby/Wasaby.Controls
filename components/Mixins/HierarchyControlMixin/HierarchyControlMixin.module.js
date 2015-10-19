/* global define, $ws */
define('js!SBIS3.CONTROLS.HierarchyControlMixin', [
   'js!SBIS3.CONTROLS.HierarchyControl.HierarchyView',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection',
   'js!SBIS3.CONTROLS.Data.Tree.Tree',
   'js!SBIS3.CONTROLS.Data.Tree.LoadableTree'
], function (HierarchyView, IBindCollection, Tree, LoadableTree) {
   'use strict';

   /**
    * Миксин, задающий любому контролу поведение работы с иерархией
    * *Это экспериментальный модуль, API будет меняться!*
    * @mixin SBIS3.CONTROLS.HierarchyControlMixin
    * @public
    * @state mutable
    * @author Крайнов Дмитрий Олегович
    */

   var HierarchyControlMixin = /**@lends SBIS3.CONTROLS.HierarchyControlMixin.prototype  */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.HierarchyControl.IHierarchyItems|Array} Узел дерева, отображаемый контролом
             * @name SBIS3.CONTROLS.HierarchyControlMixin#items
             */

            /**
             * @cfg {String} Название свойства, содержащего идентификатор родительского узла. Используется только в случае, если указан {@link dataSource}.
             * @remark Нужно только для того, чтобы передать в конструктор {@link SBIS3.CONTROLS.Data.Tree.LoadableTree}
             *
             */
            parentProperty: '',

            /**
             * @cfg {String} Название свойства, содержащего признак узла. Используется только в случае, если указан {@link dataSource}.
             * @remark Нужно только для того, чтобы передать в конструктор {@link SBIS3.CONTROLS.Data.Tree.LoadableTree}
             */
            nodeProperty: '',

            /**
             * @cfg {*} Идентификатор корневого узла, который будет отправлен в запросе на получение корневых записей
             * @remark Нужно только для того, чтобы передать в конструктор {@link SBIS3.CONTROLS.Data.Tree.LoadableTree}
             */
            rootNodeId: undefined,

            /**
             * @cfg {String} Название свойства, содержащего дочерние элементы узла. Используется только в случае, если {@link items} является массивом, для поиска в каждом элементе-узле дочерних элементов.
             * @remark Нужно только для того, чтобы передать в конструктор {@link SBIS3.CONTROLS.Data.Tree.Tree}
             */
            childrenProperty: '',

            /**
             * @cfg {String} Какие типы узлов выводим 'all'|'folders'|'records'. По умолчанию 'all'
             * @noShow
             */
            displayType: 'all'
         },

         /**
          * @var {SBIS3.CONTROLS.Collection.ITreeItem} Узел дерева, отображаемый контролом
          */
         _items: undefined,

         /**
          * @var {SBIS3.CONTROLS.Data.Projection.Tree} Проекция дерева
          */
         _itemsProjection: undefined,

         _viewConstructor: HierarchyView,

         /**
          * @var {SBIS3.CONTROLS.HierarchyControl.HierarchyView} Представление иерархии
          */
         _view: undefined,
         
         /**
          * @var {Boolean} Менять текущий раздел по клику на узел
          */
         _changeRootOnClick: true,

         /**
          * @var {SBIS3.CONTROLS.Data.Tree.ITreeItem} Текущий узел дерева
          */
         _currentRoot: undefined,

         /**
          * @var {Function} Обрабатывает событие о начале загрузки узла
          */
         _onBeforeNodeLoad: undefined,

         /**
          * @var {Function} Обрабатывает событие об окончании загрузки узла
          */
         _onAfterNodeLoad: undefined
      },

      after: {
         _bindHandlers: function () {
            this._onCollectionChange = this._onCollectionChange.callAround(onCollectionChange.bind(this));
            //this._onCollectionChange = onCollectionChange.bind(this);
            this._onBeforeNodeLoad = onBeforeNodeLoad.bind(this);
            this._onAfterNodeLoad = onAfterNodeLoad.bind(this);
         },

         _setItems: function () {
            this._setCurrentRoot(this._items);
         }
      },

      //region Public methods

      /**
       * Сменяет отображаемый корень дерева
       * @param {String} hash Хэш элемента дерева
       */
      changeRoot: function (hash) {
         var item = this._itemsProjection.getChildByHash(hash, true);
         if (!item.isNode()) {
            return;
         }
         this._setCurrentRoot(
            item
         );
         this.redraw();

         if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable') &&
            (!item.isLoaded() || item.isQueryChanged())
         ) {
            item.load();
         }
      },

      //endregion Public methods

      //region Protected methods

      //region Collection
      
      /**
       * Устанавливает текущий отображаемый узел
       * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem} node Узел
       * @private
       */
      _setCurrentRoot: function (node) {
         this._currentRoot = node;
      },

      _convertDataSourceToItems: function (source) {
         return new LoadableTree({
            source: source,
            parentProperty: this._options.parentProperty,
            nodeProperty: this._options.nodeProperty,
            rootNodeId: this._options.rootNodeId
         });
      },

      _convertItems: function (items) {
         if (items instanceof Array) {
            items = new Tree({
               children: items,
               childrenProperty: this._options.childrenProperty
            });
         }

         if (!$ws.helpers.instanceOfMixin(items, 'SBIS3.CONTROLS.Data.Tree.ITreeItem')) {
            throw new Error('Items should be an instance of SBIS3.CONTROLS.Data.Tree.ITreeItem');
         }

         return items;
      },
      
      _getItemsForRedraw: function () {
         return this._currentRoot;
      },

      //endregion Collection

      //region Behavior
      
      _setItemSelected: function (hash) {
         this._itemsProjection.setCurrent(
            this._itemsProjection.getChildByHash(hash, true)
         );
      },

      _onItemHovered: function (event, hash) {
         this._view.hoverItem(
            this._itemsProjection.getChildByHash(hash, true)
         );
      },

      _onItemClicked: function (event, hash) {
         this._setItemSelected(hash);

         if (this._oneClickAction) {
            this._itemAction(this._itemsProjection.getChildByHash(hash, true));
         }

         if (this._changeRootOnClick) {
            this.changeRoot(hash);
         }
      },

      _onItemDblClicked: function (event, hash) {
         if (!this._oneClickAction) {
            this._itemAction(this._itemsProjection.getChildByHash(hash, true));
         }
      }

      //endregion Behavior

      //endregion Protected methods
   };
   
   /**
    * Обрабатывает событие об изменении потомков узла дерева исходного дерева
    * @param {Function} prevFn Оборачиваемый метод
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {String} action Действие, приведшее к изменению.
    * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem[]} [newItems] Новые элементы коллеции.
    * @param {Integer} [newItemsIndex] Индекс, в котором появились новые элементы.
    * @param {SBIS3.CONTROLS.Data.Tree.ITreeItem[]} [oldItems] Удаленные элементы коллекции.
    * @param {Integer} [oldItemsIndex] Индекс, в котором удалены элементы.
    * @private
    */
   var onCollectionChange = function (prevFn, event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
      switch (action) {
         case IBindCollection.ACTION_RESET:
            var newItemsNode = newItems.length ? newItems[0].getParent() : (oldItems.length ? oldItems[0].getParent() : undefined);
            if (newItemsNode) {
               if (newItemsNode &&
                  !(newItemsNode.isRoot() || newItemsNode === this._currentRoot)
               ) {
                  this._view.renderNode(newItemsNode);
               } else {
                  this.redraw();
               }
               return;
            }
            break;
      }

      prevFn.call(this, event, action, newItems, newItemsIndex, oldItems, oldItemsIndex);
   },
   
   /**
    * Обработчик перед загрузкой загрузки узла
    * @private
    */
   onBeforeNodeLoad = function () {
      this.itemsLoading();
   },

   /**
    * Обработчик после загрузки загрузки узла
    * @private
    */
   onAfterNodeLoad = function () {
      this.itemsLoaded();
   };

   return HierarchyControlMixin;
});

