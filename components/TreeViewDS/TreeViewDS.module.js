define('js!SBIS3.CONTROLS.TreeViewDS', [
   'js!SBIS3.CONTROLS.ListViewDS',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'js!SBIS3.CONTROLS.TreeMixinDS',
   'js!SBIS3.CORE.MarkupTransformer'
], function (ListViewDS, hierarchyMixin, TreeMixinDS, MarkupTransformer) {
   'use strict';
   /**
    * Контрол, отображающий данные имеющие иерархическую структуру. Позволяет отобразить данные в произвольном виде с возможностью открыть или закрыть отдельные узлы
    * @class SBIS3.CONTROLS.TreeViewDS
    * @extends SBIS3.CONTROLS.ListViewDS
    * @mixes SBIS3.CONTROLS.TreeMixinDS
    */

   var TreeViewDS = ListViewDS.extend([hierarchyMixin, TreeMixinDS], /** @lends SBIS3.CONTROLS.TreeViewDS.prototype*/ {
      $protected: {
         _options: {
            //FixME: так как приходит набор от листвью. пока он не нужен
            itemsActions: []
         }
      },

      _getTargetContainer: function (record) {
         var
            parentKey = this.getParentKey(this._dataSet, record),
            curList;

         if (parentKey) {
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

      _nodeDataLoaded : function(key, ds) {
         console.log('_nodeDataLoaded TreeViewDS');
         TreeViewDS.superclass._nodeDataLoaded.apply(this, arguments);
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
