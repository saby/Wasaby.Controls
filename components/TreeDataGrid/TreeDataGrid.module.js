define('js!SBIS3.CONTROLS.TreeDataGrid', [
   'js!SBIS3.CONTROLS.DataGrid',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'js!SBIS3.CONTROLS.TreeMixinDS',
   'html!SBIS3.CONTROLS.TreeDataGrid/resources/rowTpl',
   'html!SBIS3.CONTROLS.TreeDataGrid'
], function(DataGrid, hierarchyMixin, TreeMixin, rowTpl, dotTplFn) {
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
      _dotTplFn : dotTplFn,
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
                  parentContainer = $('.controls-ListView__item[data-id="'+key+'"]', self._getItemsContainer().get(0)).get(0),
                  allContainers = $('.controls-ListView__item', self._getItemsContainer().get(0)),
                  at;
               for (var i = 0; i < allContainers.length; i++) {
                  if (allContainers[i] == parentContainer) {
                     at = {at : i + 1};
                     break;
                  }
               }
               /**/
               self._drawItem(record, targetContainer);
            }
         });
      },
      closeNode : function() {

      }
   });

   return TreeDataGrid;

});