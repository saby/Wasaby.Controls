/* global define, console, doT, $ws, $ */
define('js!SBIS3.CONTROLS.ListControl.AnimatedListView', [
   'js!SBIS3.CONTROLS.ListControl.ListView',
   'css!SBIS3.CONTROLS.ListControl.AnimatedListView'
], function (ListView) {
   'use strict';

   /**
    * Представление списка - реализует его визуальный аспект.
    * @class SBIS3.CONTROLS.ListControl.ListView
    * @extends SBIS3.CONTROLS.ListControl.ListView
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var AnimatedListView = ListView.extend(/** @lends SBIS3.CONTROLS.ListControl.AnimatedListView.prototype */{
      _moduleName: 'SBIS3.CONTROLS.ListControl.AnimatedListView',
      $protected: {
         _rootNodeСssClass: 'controls-ListView controls-ListView__animated',
         _rowHeight: 28,
         _rowsCount: 0
      },

      //region SBIS3.CONTROLS.ListControl.IListView

      addItem: function (item, at) {
         this._rowsCount++;
         var target = this._getTargetNode(item),
            template = this._getItemTemplate(item);
         this._shiftItemsPositions(target, at, 1);

         var container = this._buildItemContainer(item, template, at)
            .addClass(this._сssPrefix + 'item__beforeInsert')
            .appendTo(target);
         setTimeout((function() {
            container.removeClass(this._сssPrefix + 'item__beforeInsert');
         }).bind(this), 0);

         this._updateTargetNodeHeight(target);
      },

      removeItem: function (item, at) {
         this._rowsCount--;
         var target = this._getTargetNode(item),
            old = this._getItemContainer(target, at);
         if (old.length) {
            old.addClass(this._сssPrefix + 'item__afterDelete');
            setTimeout((function() {
               this._removeСomponents(old);
               old.remove();
            }).bind(this), 500);
            this._shiftItemsPositions(target, 1 + at, -1);
            this._updateTargetNodeHeight(target);
         }
      },

      moveItem: function (item, from, to) {
         var targetNode = this._getTargetNode(item),
            container = this._getItemContainer(targetNode, from);
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
         data.rowHeight = this._rowHeight;
         data.height = this._rowsCount * this._rowHeight;
         return data;
      },

      _getItemRenderData: function(item, index) {
         var data = AnimatedListView.superclass._getItemRenderData.call(this, item, index);
         data.index = index;
         data.top = this._getItemContainerTop(index);
         return data;
      },

      //endregion Rendering

      //region DOM

      _buildItemContainer: function (item, template, at) {
         var container = AnimatedListView.superclass._buildItemContainer.call(this, item, template, at);
         this._setItemContainerIndex(container, at);
         this._updateItemContainerPosition(container);
         return container;
      },

      _getItemContainerIndex: function(parent, domNode) {
         return parseInt($(domNode).attr('data-index')) || 0;
      },

      _getItemContainer: function(parent, at) {
         return parent.find('> .' + this._сssPrefix + this._itemContainerCssClass + '[data-index=' + at + ']');
      },

      _updateTargetNodeHeight: function(container) {
         container.css({
            height: this._rowsCount * this._rowHeight
         });
      },

      _setItemContainerIndex: function(container, index) {
         container.attr('data-index', index);
      },

      _updateItemContainerPosition: function(container) {
         container.css({
            top: this._getItemContainerTop(container.attr('data-index'))
         });
      },

      _shiftItemsPositions: function(parent, fromIndex, offset, toIndex) {
         var items = this._getItemsContainers(parent);
         for (var i = 0; i < items.length; i++) {
            var container = $(items[i]),
               index = parseInt(container.attr('data-index')) || 0;
            if (index >= fromIndex && (toIndex === undefined || index <= toIndex)) {
               this._setItemContainerIndex(container, index+ offset);
               this._updateItemContainerPosition(container);
            }
         }
      },

      //endregion DOM

      _getItemContainerTop: function (index) {
         return parseInt(index) * this._rowHeight;
      }

      //endregion Protected methods

   });

   return AnimatedListView;
});
