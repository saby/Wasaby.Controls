define('js!SBIS3.CONTROLS.DataGrid', ['js!SBIS3.CONTROLS.ListViewDS', 'html!SBIS3.CONTROLS.DataGrid', 'html!SBIS3.CONTROLS.DataGrid/resources/rowTpl', 'js!SBIS3.CORE.MarkupTransformer'], function(ListView, dotTplFn, rowTpl, MarkupTransformer) {
   'use strict';
   /**
    * Контрол, отображающий набор данных в виде в таблицы с несколькими колонками.
    * @class SBIS3.CONTROLS.DataGrid
    * @extends SBIS3.CONTROLS.ListView
    * @control
    * @public
    * @demo SBIS3.Demo.Control.MyDataGrid
    * @initial
    * <component data-component='SBIS3.CONTROLS.DataGrid'>
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

   var DataGrid = ListView.extend(/** @lends SBIS3.CONTROLS.DataGrid.prototype*/ {
      $protected: {
         _dotTplFn : dotTplFn,
         _rowData : [],
         _options: {
            /**
             * @typedef {Object} Columns
             * @property {String} title Заголовок колонки
             * @property {String} field Имя поля
             * @property {Number} Ширина колонки
             * Значение необходимо задавать для колонок с фиксированной шириной. 
             * 
             * @property {String} className Имя класса, который будет применён к каждой ячейке столбца
             * @property {String} captionTemplate Шаблон отображения шапки колонки
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
            showHead : true,
            /**
             * @typedef {Object} PagingEnum
             * @variant no Не используется
             * @variant part Частичная
             * @variant full Полная
             */
            /**
             * @cfg {PagingEnum} Режим постраничной навигации
             * @remark
             * При частичной постраничной навигации заранее неизвестно общее количество страниц.
             * @example
             * <pre>
             *     <option name="paging">full</option>
             * </pre>
             */
            paging: 'no'
         }
      },

      $constructor: function() {
         this._thead = $('.controls-DataGrid__thead', this._container.get(0));
         this._colgroup = $('.controls-DataGrid__colgroup', this._container.get(0))
      },
      /**
       * Установить страницу.
       * @remark
       * Метод установки номера страницы, с которой нужно открыть представление данных.
       * Работает при использовании постраничной навигации.
       * @param num Номер страницы.
       * @example
       * <pre>
       *    if(dataGrid.getPage() > 0)
       *       dataGrid.setPage(0);
       * </pre>
       * @see getPage
       * @see paging
       */
      setPage: function(num){

      },

      /**
       * Получить текущую страницу.
       * @example
       * <pre>
       *    if(dataGrid.getPage() > 0)
       *       dataGrid.setPage(0);
       * </pre>
       * @see paging
       * @see setPage
       */
      getPage: function(){

      },

      _getItemsContainer: function(){
         return $('.controls-DataGrid__tbody', this._container);
      },

      _getItemTemplate: function(item){
         if (!this._options.itemTemplate) {

            var rowData = {columns : [], multiselect : this._options.multiselect};
            rowData.columns = $ws.core.clone(this._options.columns);
            for (var i = 0; i < rowData.columns.length; i++) {
               var value;
               if (rowData.columns[i].cellTemplate) {
                  var cellTpl = rowData.columns[i].cellTemplate;
                  value = MarkupTransformer(doT.template(cellTpl)({item : item, field : rowData.columns[i].field}));
               }
               else {
                  value = item.get(rowData.columns[i].field);
                  value = ((value != undefined) && (value != null)) ? value : '';
               }
               rowData.columns[i].value = value;
            }
            return rowTpl(rowData)
         }
         else {
            return this._options.itemTemplate(item)
         }

      },

      _getItemActionsContainer : function(id) {
         return $(".controls-ListView__item[data-id='" + id + "']", this._container.get(0)).find('.controls-DataGrid__td').last();
      },
       /**
        * Метод получения текущего описания колонок представления данных.
        * @returns {*|columns} Описание набора колонок.
        * @example
        * <pre>
        *    var columns = dataGrid.getColumns(),
        *        newColumns = [];
        *    for(var i = 0, l = columns.length; i < l; i++){
        *       if(columns[i].title !== "Примечание")
        *          newColumns.push(columns[i]);
        *    }
        *    newColumns.push({
        *       title: 'ФИО',
        *       field: 'РП.ФИО'
        *    });
        *    dataGrid.setColumns(newColumns);
        * </pre>
        */
      getColumns : function() {
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
        *       title: 'ФИО',
        *       field: 'РП.ФИО'
        *    });
        *    dataGrid.setColumns(newColumns);
        * </pre>
        */
      setColumns : function(columns) {
         this._options.columns = columns;
         this._thead.empty();
         this._colgroup.empty();

         for (var i = 0; i < columns.length; i++) {
            var column = $('<col/>');
            if (columns[i]['width']) column.attr('width', columns[i]['width']);
            this._colgroup.append(column);

            var th = $('<th class="controls-DataGrid__th"></th>').text(columns[i].title);
            this._thead.append(th);
         }

         this._redraw();
      },

      _getLeftOfItemContainer : function(container) {
         return $(".controls-DataGrid__td", container.get(0)).first();
      }

   });

   return DataGrid;

});