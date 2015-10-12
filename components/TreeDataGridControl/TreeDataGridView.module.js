/* global define, console, doT, $ws, $ */
define('js!SBIS3.CONTROLS.TreeDataGridControl.TreeDataGridView', [
   'js!SBIS3.CONTROLS.TreeControl.TreeView',
   'js!SBIS3.CONTROLS.DataGridControl.DataGridViewMixin',
   'html!SBIS3.CONTROLS.TreeDataGridControl/resources/Row'
], function (TreeView, DataGridViewMixin, RowTemplate) {
   'use strict';

   /**
    * Представление таблицы - реализует ее визуальный аспект.
    * @class SBIS3.CONTROLS.TreeDataGridControl.TreeDataGridView
    * @extends SBIS3.CONTROLS.TreeControl.TreeView
    * @mixes SBIS3.CONTROLS.DataGridControl.DataGridViewMixin
    * @author Крайнов Дмитрий Олегович
    */
   var TreeDataGridView = TreeView.extend([DataGridViewMixin], /** @lends SBIS3.CONTROLS.TreeDataGridControl.TreeDataGridView.prototype */{
      _moduleName: 'SBIS3.CONTROLS.TreeDataGridControl.TreeDataGridView',
      $protected: {
         _options: {
            /**
             * @cfg {Number} Число колонок
             */
            columnsCount: 0
         },
         _rowTemplate: RowTemplate,
         _rootNode: undefined
      },

      //region SBIS3.CONTROLS.CollectionControl.ICollectionView

      addItem: function (item, at) {
         var target = this._getTargetNode(item),
            siblings = this._getTreeChildrenContainers(item.getParent()),
            nextSibling = at > -1 ? siblings.get(at) : undefined,
            template = this._getItemTemplate(item);
         if (nextSibling) {
            this._buildItemContainer(item, template).insertBefore(nextSibling);
         } else {
            this._buildItemContainer(item, template).insertAfter(siblings.last());
         }
      },

      moveItem: function (item, to) {
         var targetNode = this._getTargetNode(item),
            fromContainer = this._getItemContainer(targetNode, item),
            toContainer = this._getTreeChildrenContainers(item.getParent()).get(to);
         if (fromContainer.length && toContainer) {
            fromContainer.insertBefore(toContainer);
         } else {
            $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.CollectionControl.CollectionView::removeItem()', 'Positions are not found');
         }
      },

      getPagerContainer: function (items) {
          if (!$ws.helpers.instanceOfMixin(items, 'SBIS3.CONTROLS.Data.Collection.ITreeItem')) {
            return TreeDataGridView.superclass.getPagerContainer.call(this, items);
         }

         var targetNode = this._getTargetNode(items),
             pagerContaner = targetNode.find('.' + this._сssPrefix + this._pagerClass + '[data-parent-hash="' + items.getHash() + '"]');
         if (pagerContaner.length === 0) {
            var itemContainer = this._getItemContainer(targetNode, items);
            pagerContaner = $('<tr><td colspan="' + this._options.columnsCount + '"><div></div></td></tr>')
               .addClass(this._сssPrefix + this._pagerClass)
               .attr('data-parent-hash', items.getHash());
            if (itemContainer.length) {
               pagerContaner.insertAfter(itemContainer);
            } else {
               pagerContaner.appendTo(targetNode);
            }
         }
         return pagerContaner.find('div').first();
      },

      //endregion SBIS3.CONTROLS.CollectionControl.ICollectionView

      //region SBIS3.CONTROLS.TreeControl.ITreeView

      render: function (items) {
         this._rootNode = items;
         TreeDataGridView.superclass.render.call(this, items);
      },

      renderNode: function (node) {
         this._getTreeChildrenContainers(node).remove();

         var container = this._getItemContainer(this._getTargetNode(node), node);
         this._execTemplate(
            this._options.template,
            this._getRenderData(node)
         ).find('tbody > tr').insertAfter(container);
      },

      setNodeExpanded: function (node, expanded) {
         TreeDataGridView.superclass.setNodeExpanded.call(this, node, expanded);
         this._checkTreeChildrenVisibility(node, expanded);
      },

      //region SBIS3.CONTROLS.TreeControl.ITreeView

      _getItemRenderData: function(item) {
         var itemData = TreeDataGridView.superclass._getItemRenderData.call(this, item);

         if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.Collection.ITreeItem')) {
            itemData.containerClass += this._isTreeItemVisible(item) ? '' : ' ws-hidden';
            itemData.parentHash = item.getParent().getHash();

            itemData.levels = [];
            while (itemData.levels.length < itemData.level - 1) {
               itemData.levels.push(true);
            }

            if (item.isNode()) {
               itemData.childrenTemplate = this._rowTemplate;
            }
         }

         return itemData;
      },

      _getTreeChildrenContainer: function() {
         return this.getRootNode().find('.' + this._сssPrefix + this._itemsNodeCssClass);
      },

      _getTreeChildrenContainers: function(node) {
         return this._getTreeChildrenContainer().find('> tr.' + this._сssPrefix + this._itemContainerCssClass + '[data-parent-hash="' + node.getHash() + '"]');
      },

      _checkTreeChildrenVisibility: function(node, expanded) {
         this._getTreeChildrenContainers(node).toggleClass('ws-hidden', !expanded);
         this.getPagerContainer(node).closest('tr').toggleClass('ws-hidden', !expanded);
         
         node.getChildren().each(function(child) {
            if (child.isNode()) {
               this._checkTreeChildrenVisibility(child, expanded && child.isExpanded());
            }
         }, this);
      },

      _isTreeItemVisible: function(item) {
         if (item.getParent().isRoot() || item.getParent() === this._rootNode) {
            return true;
         }
         return item.getParent().isExpanded() && this._isTreeItemVisible(item.getParent());
      }

      //endregion Protected methods
   });

   return TreeDataGridView;
});
