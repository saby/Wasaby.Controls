define('js!SBIS3.CONTROLS.HierarchyDataGridView', [
   'js!SBIS3.CONTROLS.DataGridView',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'html!SBIS3.CONTROLS.HierarchyDataGridView/resources/rowTpl'
], function (DataGridView, hierarchyMixin, rowTpl) {
   'use strict';
   /**
    * Контрол отображающий набор данных, имеющих иерархическую структуру, в виде в таблицы с несколькими колонками.
    * @class SBIS3.CONTROLS.HierarchyDataGridView
    * @extends SBIS3.CONTROLS.DataGridView
    * @mixes SBIS3.CONTROLS.hierarchyMixin
    * @author Крайнов Дмитрий Олегович
    * @control
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS.HierarchyDataGridView'>
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

   var HierarchyDataGridView = DataGridView.extend([hierarchyMixin], /** @lends SBIS3.CONTROLS.HierarchyDataGridView.prototype*/ {
      $protected: {
         _rowTpl: rowTpl
      },

      $constructor: function () {
         //чтобы не добавлять новый шаблон модуля просто добавим класс тут
         this.getContainer().addClass('controls-HierarchyDataGridView');
      },

      _dataLoadedCallback: function () {
         HierarchyDataGridView.superclass._dataLoadedCallback.call(this, arguments);
      },

      _elemClickHandlerInternal: function (data, id, target) {
         if (data.get(this._options.hierField+'@')) {
            var nodeID = $(target).closest('.controls-ListView__item').data('id');
            this.setCurrentRoot(nodeID);
            this.reload();
         }
      },

      _getProjectionItem: function(id, isNext) {
         var item = HierarchyDataGridView.superclass._getProjectionItem.apply(this, arguments),
            currentItem = this.getItems().getRecordById(id);
         if(item && (item.getContents().get(this._options.hierField) === currentItem.get(this._options.hierField))) {
            //возвращаем следующий элемент только если он и текущий эелемент, находятся в одном узле
            return item;
         }
         return undefined;
      }
   });

   return HierarchyDataGridView;
});