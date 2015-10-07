/* global define, $ws */
define('js!SBIS3.CONTROLS.HierarchyControl.HierarchyPresenter', [
   'js!SBIS3.CONTROLS.CollectionControl.CollectionPresenter',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection'
], function (CollectionPresenter, IBindCollection) {
   'use strict';

   /**
    * Презентер иерархии - реализует ее поведеческий аспект.
    * @class SBIS3.CONTROLS.HierarchyControl.HierarchyPresenter
    * @extends SBIS3.CONTROLS.CollectionControl.CollectionPresenter
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var HierarchyPresenter = CollectionPresenter.extend(/** @lends SBIS3.CONTROLS.HierarchyControl.HierarchyPresenter.prototype */{
      _moduleName: 'SBIS3.CONTROLS.HierarchyControl.HierarchyPresenter',
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Менять текущий раздел по клику на узел
             */
            changeRootOnClick: true
         },

         /**
          * @var {SBIS3.CONTROLS.Data.Projection.Tree} Проекция дерева
          */
         _tree: undefined,

         /**
          * @var {SBIS3.CONTROLS.Data.Collection.ITreeItem} Текущий узел дерева
          */
         _currentRoot: undefined,

         /**
          * @var {Function} Обрабатывает событие об изменении потомков узла проекции дерева
          */
         _onCollectionChange: undefined,

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

      $constructor: function () {
         this.subscribeTo(this._options.view, 'onItemHovered', this._onItemHovered.bind(this));
         this.subscribeTo(this._options.view, 'onItemClicked', this._onItemClicked.bind(this));
         this.subscribeTo(this._options.view, 'onItemDblClicked', this._onItemDblClicked.bind(this));

         this._onCollectionChange = onCollectionChange.bind(this);
         this._onCurrentChange = onCurrentChange.bind(this);
         this._onTreeItemContentsChange = onTreeItemContentsChange.bind(this);
         this._onTreeItemParentChange = onTreeItemParentChange.bind(this);
         this._onBeforeNodeLoad = onBeforeNodeLoad.bind(this);
         this._onAfterNodeLoad = onAfterNodeLoad.bind(this);
      },

      destroy: function () {
         HierarchyPresenter.superclass.destroy.call(this);

         this._onCollectionChange = undefined;
         this._onCurrentChange = undefined;
         this._onTreeItemContentsChange = undefined;
         this._onTreeItemParentChange = undefined;
         this._onBeforeNodeLoad = undefined;
         this._onAfterNodeLoad = undefined;
      },

      //region Public methods

      /**
       * Возвращает признак, что текущий раздел меняется по клику на узел
       * @returns {Boolean}
       */
      isChangeRootOnClick: function () {
         return this._options.changeRootOnClick;
      },

      /**
       * Устанавливает признак, что текущий раздел меняется по клику на узел
       * @param {Boolean} changeRootOnClick
       */
      setChangeRootOnClick: function (changeRootOnClick) {
         this._options.changeRootOnClick = changeRootOnClick;
      },

      //region Collection

      /**
       * Возвращает проекцию
       * @returns {SBIS3.CONTROLS.Data.Projection.Tree}
       */
      getItems: function () {
         return this._tree;
      },

      /**
       * Устанавливает проекцию
       * @param {SBIS3.CONTROLS.Data.Projection.Tree} items
       */
      setItems: function (items) {
         if (!items) {
            throw new Error('Items is not defined');
         }
         if (!$ws.helpers.instanceOfModule(items, 'SBIS3.CONTROLS.Data.Projection.Tree')) {
            throw new Error('Items should implement SBIS3.CONTROLS.Data.Projection.Tree');
         }

         if (this._tree) {
            this.unsubscribeFrom(this._tree, 'onCollectionChange', this._onCollectionChange);
            this.unsubscribeFrom(this._tree, 'onCurrentChange', this._onCurrentChange);
            this.unsubscribeFrom(this._tree, 'onTreeItemContentsChange', this._onTreeItemContentsChange);
            this.unsubscribeFrom(this._tree, 'onTreeItemParentChange', this._onTreeItemParentChange);
         }

         this._tree = this._currentRoot = items;

         this.subscribeTo(this._tree, 'onCollectionChange', this._onCollectionChange);
         this.subscribeTo(this._tree, 'onCurrentChange', this._onCurrentChange);
         this.subscribeTo(this._tree, 'onTreeItemContentsChange', this._onTreeItemContentsChange);
         this.subscribeTo(this._tree, 'onTreeItemParentChange', this._onTreeItemParentChange);
      },

      //endregion Collection

      //region Behavior

      /**
       * Обрабатывает событие о смене выбранного элемента дерева
       * @param {String} hash Хэш элемента дерева
       */
      itemSelected: function (hash) {
         this._tree.setCurrent(
            this._tree.getChildByHash(hash, true)
         );
      },

      /**
       * Сменяет отображаемый корень дерева
       * @param {String} hash Хэш элемента дерева
       */
      changeRootCalled: function (hash) {
         var item = this._tree.getChildByHash(hash, true);
         if (!item.isNode()) {
            return;
         }
         this._setCurrentRoot(
            item
         );
         this.redrawCalled();

         if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable') &&
            (!item.isLoaded() || item.isQueryChanged())
         ) {
            item.load();
         }
      },

      //endregion Behavior

      //endregion Public methods

      //region Protected methods

      //region Behavior

      /**
       * Обрабатывает событие о нахождении указателя над элементом дерева
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента дерева
       */
      _onItemHovered: function (event, hash) {
         this._options.view.hoverItem(
            this._tree.getChildByHash(hash, true)
         );
      },

      /**
       * Обрабатывает событие о клике по элементу дерева
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента дерева
       */
      _onItemClicked: function (event, hash) {
         this.itemSelected(hash);

         if (this._itemAction && this._options.oneClickAction) {
            this._itemAction(this._tree.getChildByHash(hash, true));
         }

         if (this._options.changeRootOnClick) {
            this.changeRootCalled(hash);
         }
      },

      /**
       * Обрабатывает событие о двойном клике по элементу дерева
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента дерева
       */
      _onItemDblClicked: function (event, hash) {
         if (this._itemAction && !this._options.oneClickAction) {
            this._itemAction(this._tree.getChildByHash(hash, true));
         }
      },

      _onKeyPressed: function (event, code) {
         if (this._options.moveCurrentByKeyPress) {
            if (code === $ws._const.key.up) {
               this._tree.moveToPrevious();
            } else if (code === $ws._const.key.down) {
               this._tree.moveToNext();
            }
         }
      },

      //endregion Behavior

      _getItemsForRedraw: function () {
         return this._currentRoot;
      },

      /**
       * Устанавливает текущий отображаемый узел
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} node Узел
       * @private
       */
      _setCurrentRoot: function (node) {
         this._currentRoot = node;
      }

      //endregion Protected methods
   });

   /**
    * Обрабатывает событие об изменении текущего элемента дерева
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} newCurrent Новый текущий элемент
    * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} oldCurrent Старый текущий элемент
    * @private
    */
   var onCurrentChange = function (event, newCurrent, oldCurrent) {
      this._options.view.selectItem(
         newCurrent
      );
   },

   /**
    * Обрабатывает событие об изменении содержимого узла дерева
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} item Элемент дерева
    * @param {*} newContents Новое содержимое
    * @param {*}  Старое содержимое
    * @private
    */
   onTreeItemContentsChange = function (event, item, newContents, oldContents) {
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
      newItems = newItems || [];
      newItemsIndex = newItemsIndex || 0;
      oldItems = oldItems || [];
      oldItemsIndex = oldItemsIndex || 0;

      var i,
         view = this._options.view;

      switch (action) {
         case IBindCollection.ACTION_ADD:
         case IBindCollection.ACTION_REMOVE:
            for (i = 0; i < oldItems.length; i++) {
               view.removeItem(
                  oldItems[i]
               );
            }
            for (i = 0; i < newItems.length; i++) {
               view.addItem(
                  newItems[i],
                  newItemsIndex + i
               );
            }
            view.checkEmpty();
            this._revive();
            break;

         case IBindCollection.ACTION_MOVE:
            for (i = 0; i < newItems.length; i++) {
               view.moveItem(
                  newItems[i],
                  oldItemsIndex + i,
                  newItemsIndex + i
               );
            }
            this._revive();
            break;

         case IBindCollection.ACTION_REPLACE:
         case IBindCollection.ACTION_UPDATE:
            for (i = 0; i < newItems.length; i++) {
               view.updateItem(
                  newItems[i]
               );
            }
            view.selectItem(
               this.getItems().getCurrent()
            );
            this._revive();
            break;

         case IBindCollection.ACTION_RESET:
            var newItemsNode = newItems.length ? newItems[0].getParent() : (oldItems.length ? oldItems[0].getParent() : undefined);
            if (newItemsNode) {
               if (newItemsNode &&
                  !(newItemsNode.isRoot() || newItemsNode === this._currentRoot)
               ) {
                  view.renderNode(newItemsNode);
               } else {
                  this._redraw();
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

   return HierarchyPresenter;
});
