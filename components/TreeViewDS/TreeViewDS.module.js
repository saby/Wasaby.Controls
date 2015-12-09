define('js!SBIS3.CONTROLS.TreeViewDS', [
   'js!SBIS3.CONTROLS.ListView',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'js!SBIS3.CONTROLS.TreeMixinDS',
   'js!SBIS3.CORE.MarkupTransformer'
], function (ListView, hierarchyMixin, TreeMixinDS, MarkupTransformer) {
   'use strict';
   /**
    * Контрол, отображающий данные имеющие иерархическую структуру. Позволяет отобразить данные в произвольном виде с возможностью открыть или закрыть отдельные узлы
    * @class SBIS3.CONTROLS.TreeViewDS
    * @control
    * @public
    * @extends SBIS3.CONTROLS.ListView
    * @mixes SBIS3.CONTROLS.hierarchyMixin
    * @mixes SBIS3.CONTROLS.TreeMixinDS
    * @demo SBIS3.CONTROLS.Demo.MyTreeView
    * @author Крайнов Дмитрий Олегович
    */

   var TreeViewDS = ListView.extend([hierarchyMixin, TreeMixinDS], /** @lends SBIS3.CONTROLS.TreeViewDS.prototype*/ {
      $protected: {
         _options: {
            //FixME: так как приходит набор от листвью. пока он не нужен
            itemsActions: []
         }
      },

      _getTargetContainer: function (record) {
         var
            parentKey = this._dataSet.getParentKey(record, this._options.hierField),
            curList;

         if (parentKey && (parentKey !== this._curRoot)) {
            var parentItem = $('.controls-ListView__item[data-id="' + parentKey + '"]', this.getContainer().get(0));
            curList = $('.controls-TreeView__childContainer', parentItem.get(0)).first();
            if (!curList.length) {
               curList = $('<div></div>').appendTo(parentItem).addClass('controls-TreeView__childContainer');
            }

            // !! для статичных данных тоже надо указыавть является ли запись разделом. нужно чтобы отрисовать корректно запись, которая является узлом
            if (record.get(this._options.hierField + '@')) {
               $('.controls-TreeView__item', parentItem).first().addClass('controls-TreeView__hasChild');
            }
         } else {
            curList = this._getItemsContainer();
         }

         return curList;
      },

      _getItemActionsPosition: function(item) {
         var treeItem = item.container.find('.js-controls-TreeView-itemContent'),
             parentResult = TreeViewDS.superclass._getItemActionsPosition.apply(this, arguments);

         return {
            top: item.position.top + (treeItem.length ? treeItem[0].offsetHeight - 20 : 0),
            right: parentResult.right
         }
      },

      _drawLoadedNode : function(key) {
         TreeViewDS.superclass._drawLoadedNode.apply(this, arguments);
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.controls-TreeView__childContainer', itemCont).first().css('display', 'block');
      },

      _nodeClosed : function(key) {
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.controls-TreeView__childContainer', itemCont).css('display', 'none').empty();
      }
   });

   return TreeViewDS;

});
