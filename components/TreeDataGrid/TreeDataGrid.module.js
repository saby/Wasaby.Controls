define('js!SBIS3.CONTROLS.TreeDataGrid', [
   'js!SBIS3.CONTROLS.DataGrid',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'js!SBIS3.CONTROLS.TreeMixinDS',
   'html!SBIS3.CONTROLS.TreeDataGrid/resources/rowTpl'
], function(DataGrid, hierarchyMixin, TreeMixin, rowTpl) {
   'use strict';
   /**
    * Контрол отображающий набор данных, имеющих иерархическую структуру, в виде в таблицы с несколькими колонками.
    * @class SBIS3.CONTROLS.TreeDataGrid
    * @extends SBIS3.CONTROLS.DataGrid
    * @mixes SBIS3.CONTROLS.TreeMixin
    * @public
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.TreeDataGrid'>
    *    <options name="columns" type="array">
    *       <options>
    *          <option name="title">Поле 1</option>
    *          <option name="width">100</option>
    *       </options>
    *       <options>
    *          <option name="title">Поле 2</option>
    *       </options>
    *    </options>
    * </component>
    */

   var TreeDataGrid = DataGrid.extend([hierarchyMixin, TreeMixin], /** @lends SBIS3.CONTROLS.TreeDataGrid.prototype*/ {
      $protected: {
         _rowTpl : rowTpl
      },

      $constructor: function() {
      },

      _nodeDataLoaded : function(key, dataSet) {
         /*TODO Копипаст с TreeView*/
         var
            self = this,
            itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.js-controls-TreeView__expand', itemCont).first().addClass('controls-TreeView__expand__open');

         dataSet.each(function (record) {
            var targetContainer = self._getTargetContainer(record);
            if (targetContainer) {
               /*TODO пока придрот для определения позиции вставки*/
               var
                  parentContainer = $('.controls-ListView__item[data-id="'+key+'"]', self._getItemsContainer().get(0)),
                  allContainers = $('.controls-ListView__item', self._getItemsContainer().get(0)),
                  at = {at: 0};
               for (var i = 0; i < allContainers.length; i++) {
                  if (allContainers[i] == parentContainer.get(0)) {
                     at = {at : i + 1};
                  } else
                  if ($(allContainers[i]).data('parent') == parentContainer.data('id')){
                     at.at ++;
                  }
               }
               /**/
               self._drawItem(record, at);
            }
         });
      },

      _nodeClosed : function(key) {
         var childKeys = this._dataSet.getChildItems(key, true);
         for (var i = 0; i < childKeys.length; i++) {
            $('.controls-ListView__item[data-id="' + childKeys[i] + '"]', this._container.get(0)).remove();
         }

      },

      _elemClickHandler: function (id, data, target) {
         var self=this;
         if ($(target).hasClass('controls-TreeView__expand--inside')) {
            var nodeID = $(target).closest('.controls-ListView__item').data('id');
            this._insideFolder=true;

            this._loadNode(nodeID).addCallback(function (dataSet) {
               self._setCurRootNode(nodeID, dataSet);
            });

         } else {
            this._insideFolder=false;
            TreeDataGrid.superclass._elemClickHandler.call(this, id, data, target);
         }
      },

      _addItemAttributes : function(container, item) {
         TreeDataGrid.superclass._addItemAttributes.call(this, container, item);
         var parentKey = this.getParentKey(this._dataSet, item);
         container.attr('data-parent', parentKey);
         /*TODO пока придрот*/
         if(parentKey) {
            var
               parentCont = $('.controls-ListView__item[data-id="' + parentKey + '"]', this._container.get(0)).get(0),
               parentMargin = parseInt($('.controls-TreeView__expand', parentCont).css('margin-left'), 10) || 0;
            $('.controls-TreeView__expand', container).css('margin-left', parentMargin + 16);
         }

      }
   });

   return TreeDataGrid;

});