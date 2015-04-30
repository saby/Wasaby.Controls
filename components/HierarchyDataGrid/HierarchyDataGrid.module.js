define('js!SBIS3.CONTROLS.HierarchyDataGrid', [
   'js!SBIS3.CONTROLS.DataGrid',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'js!SBIS3.CONTROLS.PathSelector',
   'html!SBIS3.CONTROLS.HierarchyDataGrid/resources/rowTpl'
], function (DataGrid, hierarchyMixin, PathSelector, rowTpl) {
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
         _pathSelector: undefined,
         _rowTpl: rowTpl
      },

      $constructor: function () {
         //чтобы не добавлять новый шаблон модуля просто добавим класс тут
         this.getContainer().addClass('controls-HierarchyDataGrid');
      },

      _dataLoadedCallback: function () {
         if (!this._pathSelector) {
            this._drawPathSelector();
         }
      },

      _drawPathSelector: function () {
         var pathSelectorContainer = $('<div class="controls-HierarchyDataGrid__PathSelector"><div class="controls-HierarchyDataGrid__PathSelector__block"></div></div>');

         this.getContainer().prepend(pathSelectorContainer);

         this._pathSelector = new PathSelector({
            element: pathSelectorContainer,
            dataSet: this._dataSet,
            handlers: {
               'onPathChange': this._onPathSelectorChange.bind(this)
            }
         });
      },


      _nodeDataLoaded: function (key, dataSet) {
         var record;
         if (record = this._dataSet.getRecordByKey(key)) {
            var title = record.get('title');
            HierarchyDataGrid.superclass._nodeDataLoaded.call(this, key, dataSet);
            this._pathSelector.push({
               'title': title,
               'id': this._curRoot
            });
         } else {
            HierarchyDataGrid.superclass._nodeDataLoaded.call(this, key, dataSet);
         }
      },

      _onPathSelectorChange: function (event, id) {
         this.openNode(id);
      }


   });

   return HierarchyDataGrid;

});