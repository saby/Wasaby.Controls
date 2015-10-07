/* global define, $ws */
define('js!SBIS3.CONTROLS.TreeControl.TreePresenter', [
   'js!SBIS3.CONTROLS.HierarchyControl.HierarchyPresenter',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection'
], function (HierarchyPresenter, IBindCollection) {
   'use strict';

   /**
    * Презентер дерева - реализует его поведеческий аспект.
    * @class SBIS3.CONTROLS.TreeControl.TreePresenter
    * @extends SBIS3.CONTROLS.HierarchyControl.HierarchyPresenter
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var EXPAND_EVENT = {
         'click':'click',
         'dblclick':'dblclick',
         'hover':'hover'
      };
   var TreePresenter = HierarchyPresenter.extend(/** @lends SBIS3.CONTROLS.TreeControl.TreePresenter.prototype */{
      _moduleName: 'SBIS3.CONTROLS.TreeControl.TreePresenter',
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.TreeControl.ITreeView} Управляемое представление
             * @name SBIS3.CONTROLS.TreeControl.TreePresenter#view
            */
            /**
            * @cfg {String} Определяет по какому событию разворачивать узел. Возможные значения click, dblclick, hover
            */
            expandEvent: EXPAND_EVENT.dblclick
         },

         /**
          * @var {Function} Обрабатывает событие об разворачивании/сворачивании узла проекции дерева
          */
         _onTreeNodeToggle: undefined
      },

      $constructor: function () {
         if (!$ws.helpers.instanceOfMixin(this._options.view, 'SBIS3.CONTROLS.TreeControl.ITreeView')) {
            throw new Error('View should implement SBIS3.CONTROLS.TreeControl.ITreeView');
         }

         this.subscribeTo(this._options.view, 'onLeverageClicked', this._onLeverageClicked.bind(this));

         var event = 'onItemDblClicked';
         switch(this._options.expandEvent){
            case EXPAND_EVENT.hover:
               event = 'onItemHovered';
               break;
            case EXPAND_EVENT.click:
               event = 'onItemClicked';
               break;
         }
         this.subscribeTo(this._options.view, event, expandHandler.bind(this));
         this._onCollectionChange = this._onCollectionChange.callAround(onCollectionChange.bind(this));

         this._onTreeNodeToggle = onTreeNodeToggle.bind(this);
      },

      destroy: function () {
         TreePresenter.superclass.destroy.call(this);

         this._onCollectionChange = undefined;
         this._onTreeNodeToggle = undefined;
      },

      //region Public methods

      /**
       * Возвращает управляемое представление
       * @returns {SBIS3.CONTROLS.TreeControl.ITreeView}
       */
      getView: function () {
         return TreePresenter.superclass.getView.call(this);
      },

      //region Collection

      setItems: function (items) {
         if (this._tree) {
            this.unsubscribeFrom(this._tree, 'onTreeNodeToggle', this._onTreeNodeToggle);
         }

         TreePresenter.superclass.setItems.call(this, items);

         this.subscribeTo(this._tree, 'onTreeNodeToggle', this._onTreeNodeToggle);
      },

      //endregion Collection

      //region Behavior

      /**
       * Сменяет отображаемый корень дерева
       * @param {String} hash Хэш элемента дерева
       * @param {Boolean} [expanded] Свернуть/развернуть. Если undefined, то переключить.
       */
      nodeExpanded: function (hash, expanded) {
         var item = this._tree.getChildByHash(hash, true);
         if (!item.isNode()) {
            return;
         }
         if (expanded === undefined) {
            item.toggleExpanded();
         } else {
            item.setExpanded(expanded);
         }
      },

      //endregion Behavior

      //endregion Public methods

      //region Protected methods

      //region Behavior

      _onKeyPressed: function (event, code) {
         if (this._options.moveCurrentByKeyPress) {
            if (code === $ws._const.key.left) {
               if (this._tree.getCurrent().isExpanded()) {
                  this._tree.getCurrent().setExpanded(false);
               }
               //this._tree.moveToAbove();
               return;
            } else if (code === $ws._const.key.right) {
               if (!this._tree.getCurrent().isExpanded()) {
                  this._tree.getCurrent().setExpanded(true);
               }
               //this._tree.moveToBelow();
               return;
            } else if (code === $ws._const.key.up) {
               if (this._tree.moveToPrevious()) {
                  if (this._tree.getCurrent().isNode() && this._tree.getCurrent().isExpanded()) {
                     if (this._tree.moveToBelow()) {
                        this._tree.moveToLast();
                     }
                  }
               } else {
                  this._tree.moveToAbove();
               }
               return;
            } else if (code === $ws._const.key.down) {
               if (this._tree.getCurrent().isNode() && this._tree.getCurrent().isExpanded() && this._tree.getCurrent().getChildren().getCount() > 0) {
                  this._tree.moveToBelow();
               } else {
                  if (!this._tree.moveToNext()) {
                     this._tree.moveToAbove();
                     this._tree.moveToNext();
                  }
               }
               return;
            }
         }

         TreePresenter.superclass._onKeyPressed.call(this, event, code);
      },

      /**
       * Обрабатывает событие о клике по узлу, отвечающему за разворот
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента дерева
       */
      _onLeverageClicked: function (event, hash) {
         this.itemSelected(hash);
         this.nodeExpanded(hash);
      }

      //endregion Behavior

      //endregion Protected methods
   });

   /**
    * Обрабатывает событие об изменении потомков узла дерева исходного дерева
    * @param {Function} prevFn Оборачиваемый метод
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {String} action Действие, приведшее к изменению.
    * @param {SBIS3.CONTROLS.Data.Collection.ObservableTreeItem[]} [newItems] Новые элементы коллеции.
    * @param {Integer} [newItemsIndex] Индекс, в котором появились новые элементы.
    * @param {SBIS3.CONTROLS.Data.Collection.ObservableTreeItem[]} [oldItems] Удаленные элементы коллекции.
    * @param {Integer} [oldItemsIndex] Индекс, в котором удалены элементы.
    * @private
    */
   var onCollectionChange = function (prevFn, event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
      switch (action) {
         case IBindCollection.ACTION_RESET:
            var newItemsNode = newItems.length ? newItems[0].getParent() : (oldItems.length ? oldItems[0].getParent() : undefined);
            if (newItemsNode &&
               !(newItemsNode.isRoot() || newItemsNode === this._currentRoot)
            ) {
               this._options.view.renderNode(newItemsNode);
               this._revive();
               return;
            }
            break;
      }

      prevFn.call(this, event, action, newItems, newItemsIndex, oldItems, oldItemsIndex);
   },

   /**
    * Обрабатывает событие о разворачивании/сворачивании узла
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} node Узел
    * @param {Boolean} expanded Развернут или свернут узел.
    * @private
    */
   onTreeNodeToggle = function (event, node, expanded) {
      if (expanded &&
         $ws.helpers.instanceOfMixin(node, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable') &&
         (!node.isLoaded() || node.isQueryChanged())
      ) {
         node.load();
      }

      this._options.view.setNodeExpanded(
         node,
         expanded
      );
   },
   /**
    * Разворачивает узел, этот обработчик вешается на событие click, dblclick или hover,
    * согласно выбранному способу разворота.
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {String} hash Хэш элемента дерева
   */
   expandHandler = function(event, hash, state){
      this.nodeExpanded(hash, state);
   };

   return TreePresenter;
});
