/* global define, console, doT, $ws, $ */
define('js!SBIS3.CONTROLS.DataGridControl.DataGridView', [
   'js!SBIS3.CONTROLS.ListControl.View',
   'js!SBIS3.CONTROLS.DataGridControl.DataGridViewMixin'
], function (ListView, DataGridViewMixin) {
   'use strict';

   /**
    * Представление таблицы - реализует ее визуальный аспект.
    * @class SBIS3.CONTROLS.DataGridControl.DataGridView
    * @extends SBIS3.CONTROLS.ListControl.View
    * @mixes SBIS3.CONTROLS.DataGridControl.DataGridViewMixin
    * @author Крайнов Дмитрий Олегович
    */
   var DataGridView = ListView.extend([DataGridViewMixin], /** @lends SBIS3.CONTROLS.DataGridControl.DataGridView.prototype */{
      _moduleName: 'SBIS3.CONTROLS.DataGridControl.DataGridView'
   });

   return DataGridView;
});