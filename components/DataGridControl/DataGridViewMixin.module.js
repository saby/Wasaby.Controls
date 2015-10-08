/* global define, $ws */
define('js!SBIS3.CONTROLS.DataGridControl.DataGridViewMixin', [
   'js!SBIS3.CONTROLS.Data.Utils',
   'html!SBIS3.CONTROLS.DataGridControl/resources/Row'
], function (Utils, RowTemplate) {
   'use strict';

   /**
    * Миксин, обеспечивающий рендер таблицы
    * @mixin SBIS3.CONTROLS.DataGridControl.DataGridViewMixin
    * @author Крайнов Дмитрий Олегович
    */
   return /** @lends SBIS3.CONTROLS.DataGridControl.DataGridViewMixin.prototype */{
      $protected: {
         _options: {
            /**
             * @typedef {Object} Columns
             * @property {String} title Заголовок колонки
             * @property {String} field Имя поля
             * @property {String} width Ширина колонки
             * Значение необходимо задавать для колонок с фиксированной шириной.
             * @property {Boolean} highlight=true Подсвечивать фразу при поиске
             * @property {String} className Имя класса, который будет применён к каждой ячейке столбца
             * @property {String} headTemplate Шаблон отображения шапки колонки
             * @property {String} headTooltip Всплывающая подсказка шапки колонки
             * @property {String|Function} cellTemplate Шаблон отображения ячейки
             */

            /**
             * @cfg {Columns[]} Набор колонок
             * @see setColumns
             * @see getColumns
             */
            columns: []
         },

         /**
          * @var {Function} Шаблон строки
          */
         _rowTemplate: RowTemplate
      },

      around: {
         _getRenderData: function (parentFnc, items) {
            var args = arguments;
            Array.prototype.shift.call(args);
            var data = parentFnc.apply(this, args);

            data.multiselect = this._options.multiselect;
            data.startScrollColumn = this._options.startScrollColumn;
            data.showHead = this._options.showHead;
            data.columns = this._getColumnsRenderData(items);
            return data;
         },

         _getItemRenderData: function(parentFnc, item) {
            var args = arguments;
            Array.prototype.shift.call(args);
            var data = parentFnc.apply(this, args);

            if (!this._options.itemTemplate) {
               data.template = this._rowTemplate;

               var cells = [],
                  columns = $ws.core.clone(this._options.columns),
                  cell,
                  i;
               for (i = 0; i < columns.length; i++) {
                  cell = columns[i];
                  cell.value = Utils.getItemPropertyValue(item.getContents(), columns[i].field);
                  if (cell.value === undefined) {
                     cell.value = '';
                  }
                  cell.template = this._buildTemplate(
                     columns[i].cellTemplate || '{{=it.value}}',
                     item.getContents()
                  );
                  cells.push(cell);
               }
               data.cells = cells;

               data.multiselect = this._options.multiselect;
               data.arrowActivatedHandler = this._options.arrowActivatedHandler;
               //data.data.decorators: this._decorators,
               //data.data.color: this._options.colorField ? item.get(this._options.colorField) : '',
               //data.data.startScrollColumn: this._options.startScrollColumn
            }

            return data;
         }
      },

      _getColumnsRenderData: function(items) {
         var columns = $ws.core.clone(this._options.columns),
            column,
            i;
         for (i = 0; i < columns.length; i++) {
            column = columns[i];
            column.template = this._buildTemplate(
               column.headTemplate || '<div class="controls-DataGridView__th-content">' + $ws.helpers.escapeHtml(column.title) + '</div>',
               column
            );
         }
         return columns;
      }
   };
});
