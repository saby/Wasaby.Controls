/* global define, console, doT, $ws, $ */
define('js!SBIS3.CONTROLS.ListControl.ListView', [
   'js!SBIS3.CONTROLS.ListControl.IListView',
   'js!SBIS3.CONTROLS.CollectionControl.CollectionView',
   'html!SBIS3.CONTROLS.ListControl.ListView/resources/ListItem'
], function (IListView, CollectionView, ListItemContainerTemplate) {
   'use strict';

   /**
    * Представление списка - реализует его визуальный аспект.
    * @class SBIS3.CONTROLS.ListControl.ListView
    * @extends SBIS3.CONTROLS.CollectionControl.CollectionView
    * @mixes SBIS3.CONTROLS.ListControl.IListView
    * @author Крайнов Дмитрий Олегович
    */
   var ListView = CollectionView.extend([IListView], /** @lends SBIS3.CONTROLS.ListControl.ListView.prototype */{
      _moduleName: 'SBIS3.CONTROLS.ListControl.ListView',
      $protected: {
         _rootNodeСssClass: 'controls-ListView',
         _сssPrefix: 'controls-ListView__',
         _itemContainerTemplate: ListItemContainerTemplate
      },

      $constructor: function () {
         this._publish('onItemHovered', 'onItemClicked', 'onItemDblClicked');
      },

      //region SBIS3.CONTROLS.ListControl.IListView

      addItem: function (item, at) {
         var target = this._getTargetNode(item),
            nextSibling = at > -1 ? this._getItemContainerByIndex(target, at) : null,
            template = this._getItemTemplate(item);
         if (nextSibling && nextSibling.length) {
            this._buildItemContainer(item, template).insertBefore(nextSibling);
         } else {
            this._buildItemContainer(item, template).appendTo(target);
         }
      },

      updateItem: function (item) {
         var container = this._getItemContainer(this._getTargetNode(item), item),
            template = this._getItemTemplate(item);
         if (container.length) {
            this._removeСomponents(container);
            container.replaceWith(
               this._buildItemContainer(item, template)
            );
         } else {
            $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.CollectionControl.CollectionView::updateItem()', 'Item at this position is not found');
         }
      },

      removeItem: function (item) {
         var container = this._getItemContainer(this._getTargetNode(item), item);
         if (container.length) {
            this._removeСomponents(container);
            container.remove();
         } else {
            $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.CollectionControl.CollectionView::removeItem()', 'Item at this position is not found');
         }
      },

      moveItem: function (item, to) {
         var targetNode = this._getTargetNode(item),
            fromContainer = this._getItemContainer(targetNode, item),
            toContainer = this._getItemContainerByIndex(targetNode, to);
         if (fromContainer.length && toContainer.length) {
            fromContainer.insertBefore(toContainer);
         } else {
            $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.CollectionControl.CollectionView::removeItem()', 'Positions are not found');
         }
      },

      selectItem: function (item) {
         this.getRootNode().find('.' + this._сssPrefix + this._itemContainerSelectedCssClass).removeClass(this._сssPrefix + this._itemContainerSelectedCssClass);
         if (item) {
            this._getItemContainer(this._getTargetNode(item), item).addClass(this._сssPrefix + this._itemContainerSelectedCssClass);
         }
      },

      hoverItem: function (item) {
         this.getRootNode().find('.' + this._сssPrefix + this._itemContainerHoverCssClass).removeClass(this._сssPrefix + this._itemContainerHoverCssClass);
         if (item) {
            this._getItemContainer(this._getTargetNode(item), item).addClass(this._сssPrefix + this._itemContainerHoverCssClass);
         }
      },

      scrollToItem: function (item, at) {
         throw new Error('Under construction');
      },

      isHorizontal: function () {
         return false;
      },

      //endregion SBIS3.CONTROLS.ListControl.IListView

      //region Public methods

      //endregion Public methods

      //region Protected methods

      //region Events

      _onItemMouseEnterOrLeave: function (event) {
         this._notify(
            'onItemHovered',
            $(event.currentTarget).data('hash'),
            event.type === 'mouseenter' ? true : false
         );
      },

      _onItemClick: function (event) {
         if (event.which === 1) {
            this._notify(
               'onItemClicked',
               $(event.currentTarget).data('hash')
            );
         }
      },

      _onItemDblClick: function (event) {
         this._notify(
            'onItemDblClicked',
            $(event.currentTarget).data('hash')
         );
      },

      //endregion Events

      //region DOM

      /**
       * Возвращает узел контейнера элемента среди siblings по его позиции
       * @param {jQuery} parent Родительский узел
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Элемент
       * @returns {jQuery}
       * @private
       */
      _getItemContainer: function(parent, item) {
         return parent.find('>[data-hash="' + item.getHash() + '"]');
      },

      /**
       * Возвращает узел контейнера элемента по его индексу в родителе
       * @param {jQuery} parent Родительский узел
       * @param {Number} at Позиция
       * @returns {jQuery}
       * @private
       */
      _getItemContainerByIndex: function(parent, at) {
         return parent.find('> .' + this._сssPrefix + this._itemContainerCssClass + ':eq(' + at + ')');
      }

      //endregion DOM

      //endregion Protected methods

   });

   return ListView;
});
