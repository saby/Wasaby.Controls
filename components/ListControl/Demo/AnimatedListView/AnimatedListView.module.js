/* global define, console, doT, $ws, $ */
define('js!SBIS3.CONTROLS.ListControl.Demo.AnimatedListView', [
   'js!SBIS3.CONTROLS.ListControl.ListView',
   'html!SBIS3.CONTROLS.ListControl.Demo.AnimatedListView/AnimatedListItem',
   'css!SBIS3.CONTROLS.ListControl.Demo.AnimatedListView'
], function (ListView, ListItemContainerTemplate) {
   'use strict';

   /**
    * Представление списка с анимацией изменений.
    * @class SBIS3.CONTROLS.ListControl.AnimatedListView
    * @extends SBIS3.CONTROLS.ListControl.ListView
    * @author Крайнов Дмитрий Олегович
    */
   var AnimatedListView = ListView.extend(/** @lends SBIS3.CONTROLS.ListControl.Demo.AnimatedListView.prototype */{
      _moduleName: 'SBIS3.CONTROLS.ListControl.Demo.AnimatedListView',
      $protected: {
         _itemContainerTemplate: ListItemContainerTemplate,
         _rootNodeСssClass: 'controls-ListView controls-ListView__animated',
         _rowHeight: 28,
         _rowsCount: 0,
         _removeTimeout: 500
      },

      //region SBIS3.CONTROLS.ListControl.IListView

      addItem: function (item, at) {
         this._rowsCount++;
         var target = this._getTargetNode(item),
            template = this._getItemTemplate(item);
         this._shiftItemsPositions(target, at, 1);
         var container = this._buildItemContainer(item, template)
            .addClass(this._сssPrefix + 'item__beforeInsert')
            .appendTo(target);
         this._updateTargetNodeHeight(target);
         setTimeout((function() {
            container.removeClass(this._сssPrefix + 'item__beforeInsert');
         }).bind(this), 0);
      },

      removeItem: function (item) {
         this._rowsCount--;
         var target = this._getTargetNode(item),
            old = this._getItemContainer(target, item);
         if (old.length) {
            old.addClass(this._сssPrefix + 'item__afterDelete');
            this._shiftItemsPositions(
               target,
               1 + this._getItemContainerIndex(old),
               -1
            );
            this._updateTargetNodeHeight(target);
            setTimeout((function() {
               this._removeСomponents(old);
               old.remove();
            }).bind(this), this._removeTimeout);
         }
      },

      moveItem: function (item, to) {
         var targetNode = this._getTargetNode(item),
            container = this._getItemContainer(targetNode, item),
            from = this._getItemContainerIndex(container);
         if (from > to) {
            this._shiftItemsPositions(targetNode, to, 1, from - 1);
         } else if (from < to) {
            this._shiftItemsPositions(targetNode, from, -1, to - 1);
         }
         this._setItemContainerIndex(container, to);
         this._updateItemContainerPosition(container);
      },

      //endregion SBIS3.CONTROLS.ListControl.IListView

      //region Protected methods

      //region Rendering

      _getRenderData: function(items) {
         var data = AnimatedListView.superclass._getRenderData.call(this, items);

         this._rowsCount = data.items.length;
         data.height = this._rowsCount * this._rowHeight;
         return data;
      },

      _getItemRenderData: function(item) {
         var data = AnimatedListView.superclass._getItemRenderData.call(this, item);

         data.index = item.getOwner().getIndex(item);
         data.top = this._getItemContainerTop(data.index);
         data.height = this._rowHeight;
         return data;
      },

      //endregion Rendering

      //region DOM

      _updateTargetNodeHeight: function(container) {
         container.css({
            height: this._rowsCount * this._rowHeight
         });
      },

      _updateItemContainerPosition: function(container) {
         container.css({
            top: this._getItemContainerTop(
               this._getItemContainerIndex(container)
            )
         });
      },

      _shiftItemsPositions: function(parent, fromIndex, offset, toIndex) {
         var items = this._getItemsContainers(parent);
         for (var i = 0; i < items.length; i++) {
            var container = $(items[i]),
               index = this._getItemContainerIndex(container);
            if (index >= fromIndex && (toIndex === undefined || index <= toIndex)) {
               this._setItemContainerIndex(container, index + offset);
               this._updateItemContainerPosition(container);
            }
         }
      },

      //endregion DOM

      _getItemContainerIndex: function(container) {
         return parseInt(container.attr('data-index'), 10) || 0;
      },

      _setItemContainerIndex: function(container, index) {
         container.attr('data-index', index);
      },

      _getItemContainerTop: function (index) {
         return parseInt(index) * this._rowHeight;
      }

      //endregion Protected methods

   });

   return AnimatedListView;
});
