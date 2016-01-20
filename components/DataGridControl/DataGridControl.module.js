/* global define, console, $ws */
define('js!SBIS3.CONTROLS.DataGridControl', [
   'js!SBIS3.CONTROLS.ListControl',
   'js!SBIS3.CONTROLS.DataGridControl.DataGridView',
   'html!SBIS3.CONTROLS.DataGridControl.DataGridView'
], function (ListControl, DataGridView, DataGridViewTemplate) {
   'use strict';

   /**
    * Контрол, отображающий набор данных в виде таблицы с несколькими колонками.
    * *Это экспериментальный модуль, API будет меняться!*
    * @class SBIS3.CONTROLS.DataGridControl
    * @extends SBIS3.CONTROLS.ListControl
    * @state mutable
    * @demo SBIS3.CONTROLS.Demo.MyDataGridView
    * @initial
    * <component data-component='SBIS3.CONTROLS.DataGridControl'>
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

   var DataGridControl = ListControl.extend(/** @lends SBIS3.CONTROLS.DataGridControl.prototype*/ {
      _moduleName: 'SBIS3.CONTROLS.DataGridControl',
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
             * @property {String} cellTemplate Шаблон отображения ячейки
             */
            /**
             * @cfg {Columns[]} Набор колонок
             * @see setColumns
             * @see getColumns
             */
            columns: [],

            /**
             * @cfg {Boolean} Отображать заголовки колонок
             * @example
             * <pre>
             *     <option name="showHead">false</option>
             * </pre>
             */
            showHead: true
         },

         _viewConstructor: DataGridView,

         /**
          * @var {SBIS3.CONTROLS.DataGridControl.DataGridView} Представление списка
          */
         _view: undefined
      },

      $constructor: function () {
         this._checkColumns();
      },

      /**
       * Метод получения текущего описания колонок представления данных.
       * @returns {*|columns} Описание набора колонок.
       * @example
       * <pre>
       *    var columns = DataGridView.getColumns(),
       *        newColumns = [];
       *    for(var i = 0, l = columns.length; i < l; i++){
       *       if(columns[i].title !== "Примечание")
       *          newColumns.push(columns[i]);
       *    }
       *    newColumns.push({
       *       title: 'ФИО',
       *       field: 'РП.ФИО'
       *    });
       *    DataGridView.setColumns(newColumns);
       * </pre>
       */
      getColumns: function () {
         return this._options.columns;
      },

      /**
       * Метод установки либо замены колонок, заданных опцией {@link columns}.
       * @param columns Новый набор колонок.
       * @example
       * <pre>
       *    var columns = dataGrid.getColumns(),
       *        newColumns = [];
       *    for(var i = 0, l = columns.length; i < l; i++){
       *       if(columns[i].title !== "Примечание")
       *          newColumns.push(columns[i]);
       *    }
       *    newColumns.push({
       *       title:'ABJ'?
       *       field: 'РП.ФИО'
       *    });
       *    dataGrid.setColumns(newColumns);
       * </pre>
       */
      setColumns: function (columns) {
         this._options.columns = columns;
         this._checkColumns();
      },

      /**
       * Проверяет настройки колонок, заданных опцией {@link columns}.
       */
      _checkColumns: function () {
         for (var i = 0; i < this._options.columns.length; i++) {
            var column = this._options.columns[i];
            if (column.highlight === undefined) {
               column.highlight = true;
            }
         }
      },

      /**
       * @see SBIS3.CONTROLS.ListControlMixin#_getViewTemplate
       * @private
       */
      _getViewTemplate: function () {
         return DataGridViewTemplate;
      },

      _getViewOptions: function () {
         var options = DataGridControl.superclass._getViewOptions.call(this);

         options.columns = this._options.columns;
         options.showHead = this._options.showHead;
         options.multiselect = this._options.multiselect;

         return options;
      }
   });

   return DataGridControl;
});