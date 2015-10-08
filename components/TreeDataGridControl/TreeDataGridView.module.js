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
         _rowTemplate: RowTemplate,
         _rootNode: undefined
      },

      //region Public methods

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

      //endregion Public methods

      //region Protected methods

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
         return this._getTreeChildrenContainer().find('> tr[data-parent-hash="' + node.getHash() + '"]');
      },

      _checkTreeChildrenVisibility: function(node, expanded) {
         this._getTreeChildrenContainers(node).toggleClass('ws-hidden', !expanded);
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