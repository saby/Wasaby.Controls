define('js!SBIS3.CONTROLS.DataGrid', ['js!SBIS3.CONTROLS.ListView', 'html!SBIS3.CONTROLS.DataGrid', 'html!SBIS3.CONTROLS.DataGrid/resources/rowTpl'], function(ListView, dotTplFn, rowTpl, colGroup) {
   'use strict';
   /**
    * Контрол отображающий набор данных в виде в таблицы с несколькими колонками.
    * @class SBIS3.CONTROLS.DataGrid
    * @extends SBIS3.CONTROLS.ListView
    */

   var DataGrid = ListView.extend(/** @lends SBIS3.CONTROLS.DataGrid.prototype*/ {
      $protected: {
         _dotTplFn : dotTplFn,
         _rowData : [],
         _options: {
            /**
             * @typedef {Object} Columns
             * @property {String} title
             * @property {String} field
             * @property {String} width
             * @property {String} className
             * @property {String} captionTemplate Шаблон отображения шапки колонки
             * @property {String} cellTemplate Шаблон отображения ячейки
             */
            /**
             * @cfg {Columns[]} Набор колонок
             */
            columns: [],
            /**
             * @cfg {Boolean} Отображать заголовки колонок
             */
            showHead : true,
            /**
             * @typedef {Object} PagingEnum
             * @variant no
             * @variant part
             * @variant full
             */
            /**
             * @cfg {PagingEnum} Режим постраничной навигации
             */
            paging: 'no'
         }
      },

      $constructor: function() {
      },
      /**
       * Установить страницу
       * @param num номер страницы
       */
      setPage: function(num){

      },

      /**
       * Получить текущую страницу
       */
      getPage: function(){

      },

      _getItemsContainer: function(){
         return $(".controls-DataGrid__tbody", this._container);
      },

      _getItemTemplate: function(item){
         if (!this._options.itemTemplate) {

            var rowData = {columns : []};
            rowData.columns = $ws.core.clone(this._options.columns);
            for (var i = 0; i < rowData.columns.length; i++) {
               rowData.columns[i].value = this._items.getValue(item, rowData.columns[i].field);
            }
            return rowTpl(rowData)
         }
         else {
            return this._options.itemTemplate(item)
         }

      }

   });

   return DataGrid;

});