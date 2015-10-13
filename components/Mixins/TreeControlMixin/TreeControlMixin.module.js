/* global define, $ws */
define('js!SBIS3.CONTROLS.TreeControlMixin', [
   'js!SBIS3.CONTROLS.TreeControl.TreeView',
   'js!SBIS3.CONTROLS.ListControlMixin',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection',
   'html!SBIS3.CONTROLS.TreeControl.TreeView',
   'js!SBIS3.CONTROLS.PagerMore'
], function (TreeView, ListControlMixin, IBindCollection, TreeViewTemplate, PagerMore) {
   'use strict';

   /**
    * Миксин, задающий любому контролу поведение работы с деревом
    * *Это экспериментальный модуль, API будет меняться!*
    * @mixin SBIS3.CONTROLS.TreeControlMixin
    * @public
    * @state mutable
    * @author Крайнов Дмитрий Олегович
    */
   
   var EXPAND_EVENT = {
      click: 'click',
      dblclick: 'dblclick',
      hover: 'hover'
   };

   var TreeControlMixin = /**@lends SBIS3.CONTROLS.TreeControlMixin.prototype  */{
      $protected: {
         _options: {
            /**
             * @cfg {Boolean}
             * Разрешить проваливаться в папки
             * Если выключено, то папки можно открывать только в виде дерева, проваливаться в них нельзя
             */
            allowEnterToFolder: true,

            /**
             * @cfg {Boolean} Режим разворота
             * @noShow
             */
            expand: false,

            /**
             * @cfg {Object} Открытые по умолчанию узлы
             * @noShow
             */
            openedPath: {}
         },

         _viewConstructor: TreeView,

         /**
          * @var {SBIS3.CONTROLS.TreeControl.TreeView} Представление дерева
          */
         _view: undefined,

         /**
         * @var {String} Определяет по какому событию разворачивать узел. Возможные значения click, dblclick, hover
         */
         _expandEvent: EXPAND_EVENT.dblclick,

         /**
          * @var {Function} Обрабатывает событие об разворачивании/сворачивании узла проекции дерева
          */
         _onTreeNodeToggle: undefined,

         /**
          * @var {Object} Инстансы контролов постраничной навигации для каждого узла
          */
         _pagers: {}
      },

      after: {
         _bindHandlers: function () {
            this._onCollectionChange = this._onCollectionChange.callAround(onCollectionChange.bind(this));
            this._onTreeNodeToggle = onTreeNodeToggle.bind(this);
         },

         _initView: function() {
            this._changeRootOnClick = this._options.allowEnterToFolder;
            
            this.subscribeTo(this._view, 'onLeverageClicked', this._onLeverageClicked.bind(this));

            var event = 'onItemDblClicked';
            switch (this._expandEvent) {
               case EXPAND_EVENT.hover:
                  event = 'onItemHovered';
                  break;
               case EXPAND_EVENT.click:
                  event = 'onItemClicked';
                  break;
            }
            this.subscribeTo(this._view, event, expandHandler.bind(this));
         },
         
         _setItemsEventHandlers: function () {
            this.subscribeTo(this._itemsProjection, 'onTreeNodeToggle', this._onTreeNodeToggle);
         },
         
         _unsetItemsEventHandlers: function () {
            this.unsubscribeFrom(this._itemsProjection, 'onTreeNodeToggle', this._onTreeItemContentsChange);
         }
      },

      //region Protected methods

      //region View
      
      _getViewTemplate: function() {
         return TreeViewTemplate;
      },
      
      //endregion View

      //region Behavior

      _keyboardHover: function (e) {
         if (this._moveCurrentByKeyPress) {
            if (e.which === $ws._const.key.left) {
               if (this._itemsProjection.getCurrent().isExpanded()) {
                  this._itemsProjection.getCurrent().setExpanded(false);
               }
               //this._itemsProjection.moveToAbove();
               return false;
            } else if (e.which === $ws._const.key.right) {
               if (!this._itemsProjection.getCurrent().isExpanded()) {
                  this._itemsProjection.getCurrent().setExpanded(true);
               }
               //this._projection.moveToBelow();
               return false;
            } else if (e.which === $ws._const.key.up) {
               if (this._itemsProjection.moveToPrevious()) {
                  if (this._itemsProjection.getCurrent().isNode() &&
                     this._itemsProjection.getCurrent().isExpanded()
                  ) {
                     if (this._itemsProjection.moveToBelow()) {
                        this._itemsProjection.moveToLast();
                     }
                  }
               } else {
                  this._itemsProjection.moveToAbove();
               }
               return false;
            } else if (e.which === $ws._const.key.down) {
               if (this._itemsProjection.getCurrent().isNode() &&
                  this._itemsProjection.getCurrent().isExpanded() &&
                  this._itemsProjection.getCurrent().getChildren().getCount() > 0
               ) {
                  this._itemsProjection.moveToBelow();
               } else {
                  if (!this._itemsProjection.moveToNext()) {
                     this._itemsProjection.moveToAbove();
                     this._itemsProjection.moveToNext();
                  }
               }
               return false;
            }
         }

         return ListControlMixin._keyboardHover.call(this, e);
      },

      /**
       * Сворачивает/разворачивает узел дерева
       * @param {String} hash Хэш элемента дерева
       * @param {Boolean} [expanded] Свернуть/развернуть. Если undefined, то переключить.
       */
      _setNodeExpanded: function (hash, expanded) {
         var item = this._itemsProjection.getChildByHash(hash, true);
         if (!item.isNode()) {
            return;
         }
         if (expanded === undefined) {
            item.toggleExpanded();
         } else {
            item.setExpanded(expanded);
         }
      },

      /**
       * Обрабатывает событие о клике по узлу, отвечающему за разворот
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента дерева
       */
      _onLeverageClicked: function (event, hash) {
         this._setItemSelected(hash);
         this._setNodeExpanded(hash);
      }
      
      //endregion Behavior
      
      //endregion Protected methods
   };

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
      var newItemsNode = newItems.length ? newItems[0].getParent() : (oldItems.length ? oldItems[0].getParent() : undefined);
      
      switch (action) {
         case IBindCollection.ACTION_RESET:
            if (newItemsNode &&
               !(newItemsNode.isRoot() || newItemsNode === this._currentRoot)
            ) {
               if (this._options.pageSize > 0 &&
                  $ws.helpers.instanceOfMixin(newItemsNode, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable') &&
                  newItemsNode.hasMore()
               ) {
                  //TODO: перенести в шаблон в новом шаблонизаторе
                  this._pagers[newItemsNode.getHash()] = new PagerMore({
                     element: this._view.getPagerContainer(newItemsNode),
                     items: newItemsNode,
                     pageSize: this._options.pageSize,
                     pagerType: 'more'
                  });
               }
               
               this._view.renderNode(newItemsNode);
               this.reviveComponents();
               return;
            }
            break;
      }

      prevFn.call(this, event, action, newItems, newItemsIndex, oldItems, oldItemsIndex);
      
      if (newItemsNode) {
         this._checkPagerState(this._pagers[newItemsNode.getHash()]);
      }
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

      this._view.setNodeExpanded(
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
   expandHandler = function(event, hash, state) {
      this._setNodeExpanded(hash, state);
   };

   return TreeControlMixin;
});

