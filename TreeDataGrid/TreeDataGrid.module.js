define('js!SBIS3.CONTROLS.TreeDataGrid', ['js!SBIS3.CONTROLS.DataGrid', 'js!SBIS3.CONTROLS._TreeMixin'], function(DataGrid, _TreeMixin) {
   'use strict';
   /**
    * Контрол отображающий набор данных, имеющих иерархическую структуру, в виде в таблицы с несколькими колонками.
    * @class SBIS3.CONTROLS.TreeDataGrid
    * @extends SBIS3.CONTROLS.DataGrid
    * @mixes SBIS3.CONTROLS._TreeMixin
    */

   var TreeDataGrid = DataGrid.extend([_TreeMixin], /** @lends SBIS3.CONTROLS.TreeDataGrid.prototype*/ {
      $protected: {
      },

      $constructor: function() {
      }
   });

   return TreeDataGrid;

});