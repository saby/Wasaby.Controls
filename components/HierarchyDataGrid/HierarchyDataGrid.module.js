define('js!SBIS3.CONTROLS.HierarchyDataGrid', [
   'js!SBIS3.CONTROLS.DataGrid',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'html!SBIS3.CONTROLS.HierarchyDataGrid/resources/rowTpl'
], function (DataGrid, hierarchyMixin, rowTpl) {
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

   var HierarchyDataGrid = DataGrid.extend([hierarchyMixin], /** @lends SBIS3.CONTROLS.TreeDataGrid.prototype*/ {
      $protected: {
         _rowTpl: rowTpl
      },

      $constructor: function () {
         //чтобы не добавлять новый шаблон модуля просто добавим класс тут
         this.getContainer().addClass('controls-HierarchyDataGrid');
      },

      _dataLoadedCallback: function () {
         HierarchyDataGrid.superclass._dataLoadedCallback.call(this, arguments);
      },

      _elemClickHandlerInternal: function (id, data, target) {
         if (data.get(this._options.hierField+'@')) {
            var nodeID = $(target).closest('.controls-ListView__item').data('id');
            this.setCurrentRoot(nodeID);
         }
      },

      setCurrentRoot: function(key) {
         var self = this;
         this._loadNode(key).addCallback(function(dataSet) {
            if (!self._dataSet){
               self._dataSet = dataSet;
            } else {
               self._dataSet.setRawData(dataSet.getRawData());
            }
            self._dataLoadedCallback();
            self._notify('onDataLoad', dataSet);
            var record;
            self._curRoot = key;
            self._redraw();
         })
      }
   });

   return HierarchyDataGrid;
});