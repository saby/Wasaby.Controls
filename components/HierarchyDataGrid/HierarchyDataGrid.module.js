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
         HierarchyDataGrid.superclass._dataLoadedCallback.call(this, arguments);
      },

      _drawPathSelector: function () {
         var pathSelectorContainer = $('<div class="controls-HierarchyDataGrid__PathSelector"><div class="controls-HierarchyDataGrid__PathSelector__block"></div></div>');

         this.getContainer().prepend(pathSelectorContainer);

         this._pathSelector = new PathSelector({
            element: pathSelectorContainer,
            dataSet: this._dataSet,
            handlers: {
               'onPathChange': this._onPathSelectorChange.bind(this)
            },
            rootNodeId: this._options.root
         });
      },

      _onPathSelectorChange: function (event, id) {
         this.setCurrentRoot(id);
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
            if (record = self._dataSet.getRecordByKey(key)) {
               var title = record.get(self._options.displayField);
               self._pathSelector.push({
                  'title': title,
                  'id': self._curRoot
               });
            }
            self._curRoot = key;
            self._redraw();
         })
      }

   });

   return HierarchyDataGrid;

});