/* global define, $ws */
define('js!SBIS3.CONTROLS.HierarchyControlMixin', [
   'js!SBIS3.CONTROLS.HierarchyControl.HierarchyView',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableTree',
   'js!SBIS3.CONTROLS.Data.Collection.LoadableTree'
], function (HierarchyView, IBindCollection, ObservableTree, LoadableTree) {
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
             * @cfg {String} Название поля, содержащее идентификатор родительского узла. Используется только в случае, если указан {@link dataSource}.
             * @remark Нужно только для того, чтобы передать в конструктор {@link SBIS3.CONTROLS.Data.Collection.LoadableTree}
             *
             */
            parentField: '',

            /**
             * @cfg {String} Название свойства, содержащее признак узла. Используется только в случае, если указан {@link dataSource}.
             * @remark Нужно только для того, чтобы передать в конструктор {@link SBIS3.CONTROLS.Data.Collection.LoadableTree}
             */
            nodeField: '',

            /**
             * @cfg {*} Идентификатор корневого узла, который будет отправлен в запросе на получение корневых записей
             * @remark Нужно только для того, чтобы передать в конструктор {@link SBIS3.CONTROLS.Data.Collection.LoadableTree}
             */
            rootNodeId: undefined,

            /**
             * @cfg {String} Название поля, содержащее дочерние элементы узла. Используется только в случае, если {@link items} является массивом, для поиска в каждом элементе-узле дочерних элементов.
             * @remark Нужно только для того, чтобы передать в конструктор {@link SBIS3.CONTROLS.Data.Collection.ObservableTree}
             *
             */
            childrenField: '',

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
          * @var {SBIS3.CONTROLS.Data.Collection.ITreeItem} Текущий узел дерева
          */
         _currentRoot: undefined,

         /**
          * @var {Function} Обрабатывает событие об изменении содержимого узла проекции дерева
          */
         _onTreeItemContentsChange: undefined,

         /**
          * @var {Function} Обрабатывает событие об изменении родителя узла проекции дерева
          */
         _onTreeItemParentChange: undefined,

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
            this._onCollectionChange = onCollectionChange.bind(this);
            this._onTreeItemContentsChange = onTreeItemContentsChange.bind(this);
            this._onTreeItemParentChange = onTreeItemParentChange.bind(this);
            this._onBeforeNodeLoad = onBeforeNodeLoad.bind(this);
            this._onAfterNodeLoad = onAfterNodeLoad.bind(this);
         },

         _setItems: function () {
            this._setCurrentRoot(this._items);
         },
         
         _setItemsEventHandlers: function () {
            this.subscribeTo(this._itemsProjection, 'onTreeItemContentsChange', this._onTreeItemContentsChange);
            this.subscribeTo(this._itemsProjection, 'onTreeItemParentChange', this._onTreeItemParentChange);
         },
         
         _unsetItemsEventHandlers: function () {
            this.unsubscribeFrom(this._itemsProjection, 'onTreeItemContentsChange', this._onTreeItemContentsChange);
            this.unsubscribeFrom(this._itemsProjection, 'onTreeItemParentChange', this._onTreeItemParentChange);
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
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} node Узел
       * @private
       */
      _setCurrentRoot: function (node) {
         this._currentRoot = node;
      },

      _convertDataSourceToItems: function (source) {
         return new LoadableTree({
            source: source,
            parentField: this._options.parentField,
            nodeField: this._options.nodeField,
            rootNodeId: this._options.rootNodeId
         });
      },

      _convertItems: function (items) {
         if (items instanceof Array) {
            items = new ObservableTree({
               children: items,
               childrenField: this._options.childrenField
            });
         }

         if (!$ws.helpers.instanceOfMixin(items, 'SBIS3.CONTROLS.Data.Collection.ITreeItem')) {
            throw new Error('Items should be an instance of SBIS3.CONTROLS.Data.Collection.ITreeItem');
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
    * Обрабатывает событие об изменении содержимого узла дерева
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} item Элемент дерева
    * @param {*} newContents Новое содержимое
    * @param {*}  Старое содержимое
    * @private
    */
   var onTreeItemContentsChange = function (event, item, newContents, oldContents) {
   },

   /**
    * Обрабатывает событие об изменении родителя узла дерева
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} item Элемент дерева
    * @param {*} newParent Новый родитель
    * @param {*} oldParent Старый родитель
    * @private
    */
   onTreeItemParentChange = function (event, item, newParent, oldParent) {
   },

   /**
    * Обрабатывает событие об изменении потомков узла дерева исходного дерева
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {String} action Действие, приведшее к изменению.
    * @param {SBIS3.CONTROLS.Data.Collection.ObservableTreeItem[]} [newItems] Новые элементы коллеции.
    * @param {Integer} [newItemsIndex] Индекс, в котором появились новые элементы.
    * @param {SBIS3.CONTROLS.Data.Collection.ObservableTreeItem[]} [oldItems] Удаленные элементы коллекции.
    * @param {Integer} [oldItemsIndex] Индекс, в котором удалены элементы.
    * @private
    */
   onCollectionChange = function (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
      var i;

      switch (action) {
         case IBindCollection.ACTION_ADD:
         case IBindCollection.ACTION_REMOVE:
            for (i = 0; i < oldItems.length; i++) {
               this._view.removeItem(
                  oldItems[i]
               );
            }
            for (i = 0; i < newItems.length; i++) {
               this._view.addItem(
                  newItems[i],
                  newItemsIndex + i
               );
            }
            this._view.checkEmpty();
            this.reviveComponents();
            break;

         case IBindCollection.ACTION_MOVE:
            for (i = 0; i < newItems.length; i++) {
               this._view.moveItem(
                  newItems[i],
                  oldItemsIndex + i,
                  newItemsIndex + i
               );
            }
            this.reviveComponents();
            break;

         case IBindCollection.ACTION_REPLACE:
         case IBindCollection.ACTION_UPDATE:
            for (i = 0; i < newItems.length; i++) {
               this._view.updateItem(
                  newItems[i]
               );
            }
            this._view.selectItem(
               this.getItems().getCurrent()
            );
            this.reviveComponents();
            break;

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
            }
            break;
      }
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

