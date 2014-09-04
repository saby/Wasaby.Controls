define('js!SBIS3.CONTROLS.DataGrid', ['js!SBIS3.CONTROLS.ListView'], function(ListView) {
   'use strict';
   /**
    * Контрол отображающий набор данных в виде в таблицы с несколькими колонками.
    * @class SBIS3.CONTROLS.DataGrid
    * @extends SBIS3.CONTROLS.ListView
    */

   var DataGrid = ListView.extend(/** @lends SBIS3.CONTROLS.DataGrid.prototype*/ {
      $protected: {
         _options: {
            /**
             * @typedef {Object} Columns
             * @property {String} title
             * @property {String} field
             * @property {String} width
             * @property {String} className
             * @property {Boolean} fixedSize
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

      }
   });

   return DataGrid;

});