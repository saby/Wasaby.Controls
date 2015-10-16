/* global define, $ws, $ */
define('js!SBIS3.CONTROLS.TreeControl.TreeView', [
   'js!SBIS3.CONTROLS.TreeControl.ITreeView',
   'js!SBIS3.CONTROLS.HierarchyControl.HierarchyView',
   'html!SBIS3.CONTROLS.TreeControl.TreeView/resources/TreeViewItem'
], function (ITreeView, HierarchyView, TreeViewItemContainerTemplate) {
   'use strict';

   /**
    * Представление дерева - реализует его визуальный аспект.
    * @class SBIS3.CONTROLS.TreeControl.TreeView
    * @extends SBIS3.CONTROLS.HierarchyControl.HierarchyView
    * @mixes SBIS3.CONTROLS.TreeControl.ITreeView
    * @author Крайнов Дмитрий Олегович
    */
   var TreeView = HierarchyView.extend([ITreeView], /** @lends SBIS3.CONTROLS.TreeControl.TreeView.prototype */{
      _moduleName: 'SBIS3.CONTROLS.TreeControl.TreeView',
      $protected: {
         _rootNodeСssClass: 'controls-TreeView',
         _сssPrefix: 'controls-ListView__',
         _itemContainerTemplate: TreeViewItemContainerTemplate,

         /**
          * @var {String} CSS-класс содержимого элемента дерева
          */
         _treeItemContentsСssClass: 'treeItem',

         /**
          * @var {String} CSS-префикс класса, узел с дочерними элементами
          */
         _treeChildrenСssPrefix: 'items-treeChildren',

         /**
          * @var {String} CSS-префикс класса, указывающего уровень вложенности
          */
         _treeLevelСssPrefix: 'items-treeLevel',

         /**
          * @var {String} CSS-класс узла, по клику на который происходит разворачивание/сворачивание
          */
         _treeLeverageСssClass: 'treeLeverage',

         /**
          * @var {String} CSS-класс развернутого узла
          */
         _treeExpandedСssClass: 'itemContainer-treeNodeExpanded',

         /**
          * @var {String} CSS-класс сввернутого узла
          */
         _treeCollapsedСssClass: 'itemContainer-treeNodeCollapsed'
      },

      $constructor: function () {
         this._publish('onLeverageClicked');
      },

      //region SBIS3.CONTROLS.ListControl.IListView

      getPagerContainer: function (items) {
         if (items.getCollection().isRoot()) {
            return TreeView.superclass.getPagerContainer.call(this, items);
         }

         var container = this._getTreeChildrenContainer(items);

         container = container.find('.' + this._сssPrefix + this._pagerClass);
         if (container.length === 0) {
            container = $('<div/>')
               .addClass(this._сssPrefix + this._pagerClass)
               .insertAfter(this.getRootNode());
         }
         return container;
      },

      //endregion SBIS3.CONTROLS.ListControl.IListView

      //region SBIS3.CONTROLS.TreeControl.ITreeView

      renderNode: function (node) {
         this._getTreeChildrenContainer(node).replaceWith(
            this._execTemplate(
               this._options.template,
               this._getRenderData(node)
            )
         );
      },

      setNodeExpanded: function (node, expanded) {
         var nodeContainer = this._getItemContainer(this._getTargetNode(node), node);
         nodeContainer
            .toggleClass(this._сssPrefix + this._treeExpandedСssClass, expanded)
            .toggleClass(this._сssPrefix + this._treeCollapsedСssClass, !expanded);

         this.checkEmpty(this._getTreeChildrenContainer(node));
      },

      //endregion SBIS3.CONTROLS.TreeControl.ITreeView

      //region Public methods

      //endregion Public methods

      //region Protected methods

      //region Events

      _attachEventHandlers: function (node) {
         node = node||this.getRootNode();
         HierarchyView.superclass._attachEventHandlers.call(this,node);
         node.on('mouseup', '.' + this._сssPrefix + this._treeLeverageСssClass, this._onLeverageClick.bind(this));
      },

      /**
       * Обрабатывает событие о клике по узлу, отвечающему за разворот
       * @private
       */
      _onLeverageClick: function (event) {
         if (event.which === 1) {
            event.stopPropagation();
            this._notify(
               'onLeverageClicked',
               $(event.currentTarget).data('hash')
            );
         }
      },

      //endregion Events

      //region Rendering

      _getRenderData: function(items) {
         var data = TreeView.superclass._getRenderData.call(this, items),
            level = items.getLevel() - this._levelOffset;

         data['class'] += ' ' + this._сssPrefix + this._treeChildrenСssPrefix;
         data['class'] += ' ' + this._сssPrefix + this._treeLevelСssPrefix;
         data['class'] += ' ' + this._сssPrefix + this._treeLevelСssPrefix + '-' + level;

         data.hash = items.getHash();
         data.level = level;

         return data;
      },

      _getItemRenderData: function(item) {
         var itemData = TreeView.superclass._getItemRenderData.call(this, item);

         itemData.contentsClass = this._сssPrefix + this._treeItemContentsСssClass;

         if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.Tree.ITreeItem')) {
            itemData.level = item.getLevel() - this._levelOffset;
            if (item.isNode()) {
               itemData.containerClass += ' ' + this._сssPrefix + (item.isExpanded() ? this._treeExpandedСssClass : this._treeCollapsedСssClass);
               itemData.leverageClass = this._сssPrefix + this._treeLeverageСssClass;

               itemData.expanded = item.isExpanded();
               itemData.children = this._getRenderData(item);
               itemData.childrenTemplate = this.getTemplate();
            }
         }

         return itemData;
      },

      //endregion Rendering


      //region DOM

      _buildItemContainer: function(item, template) {
         var container = TreeView.superclass._buildItemContainer.call(this, item, template);

         if (item.isNode()) {
            container.addClass(this._сssPrefix + (item.isExpanded() ? this._treeExpandedСssClass : this._treeCollapsedСssClass));
         }
         return container;
      },

      /**
       * Возвращает узел c индикатором загрузки
       * @param {SBIS3.CONTROLS.Data.Tree.TreeItem} target Узел, который загружается
       * @returns {jQuery}
       * @private
       */
      _getLoadingNode: function(target) {
         var treeNode = target.getOwner();
         var parent = this._getItemContainer(this._getTargetNode(treeNode), treeNode);
         if (!parent.length) {
            parent = this.getRootNode();
         }
         return this._buildLoadingNode(parent);
      }

      //endregion DOM

      //endregion Protected methods

   });

   return TreeView;
});
