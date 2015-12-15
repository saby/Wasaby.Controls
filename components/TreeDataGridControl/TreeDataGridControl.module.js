/* global define, $ws */
define('js!SBIS3.CONTROLS.TreeDataGridControl', [
   'js!SBIS3.CONTROLS.DataGridControl',
   'js!SBIS3.CONTROLS.HierarchyControlMixin',
   'js!SBIS3.CONTROLS.TreeControlMixin',
   'js!SBIS3.CONTROLS.TreeDataGridControl.TreeDataGridView',
   'html!SBIS3.CONTROLS.DataGridControl.DataGridView'
], function(DataGridControl, HierarchyControlMixin, TreeControlMixin, TreeDataGridView, DataGridViewTemplate) {
   'use strict';

   /**
    * Контрол отображающий набор данных, имеющих иерархическую структуру, в виде в таблицы с несколькими колонками.
    * *Это экспериментальный модуль, API будет меняться!*
    * @class SBIS3.CONTROLS.TreeDataGridControl
    * @extends SBIS3.CONTROLS.DataGridControl
    * @mixes SBIS3.CONTROLS.HierarchyControlMixin
    * @mixes SBIS3.CONTROLS.TreeControlMixin
    * @state mutable
    * @author Крайнов Дмитрий Олегович
    * @demo SBIS3.CONTROLS.Demo.MyTreeDataGridControl
    */

   var TreeDataGridControl = DataGridControl.extend([HierarchyControlMixin, TreeControlMixin], /** @lends SBIS3.CONTROLS.TreeDataGridControl.prototype */{
      _moduleName: 'SBIS3.CONTROLS.TreeDataGridControl',
      $protected: {
         _viewConstructor: TreeDataGridView,

         /**
          * @var {SBIS3.CONTROLS.TreeDataGridControl.TreeDataGridView} Представление дерева в виде в таблицы
          */
         _view: undefined
      },

      /**
       * @see SBIS3.CONTROLS.ListControlMixin#_getViewTemplate
       * @private
       */
      _getViewTemplate: function () {
         return DataGridViewTemplate;
      }
   });

   return TreeDataGridControl;
});
