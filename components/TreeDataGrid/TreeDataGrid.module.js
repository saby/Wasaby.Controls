define('js!SBIS3.CONTROLS.TreeDataGrid', ['js!SBIS3.CONTROLS.DataGrid', 'js!SBIS3.CONTROLS.TreeMixin'], function(DataGrid, TreeMixin) {
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

   var TreeDataGrid = DataGrid.extend([TreeMixin], /** @lends SBIS3.CONTROLS.TreeDataGrid.prototype*/ {
      $protected: {
      },

      $constructor: function() {
      }
   });

   return TreeDataGrid;

});