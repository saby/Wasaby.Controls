define('js!SBIS3.CONTROLS.DataGrid', ['js!SBIS3.CONTROLS.ListViewDS', 'html!SBIS3.CONTROLS.DataGrid', 'html!SBIS3.CONTROLS.DataGrid/resources/rowTpl', 'js!SBIS3.CORE.MarkupTransformer'], function(ListView, dotTplFn, rowTpl, MarkupTransformer) {
   'use strict';
   /**
    * Контрол, отображающий набор данных в виде в таблицы с несколькими колонками.
    * @class SBIS3.CONTROLS.DataGrid
    * @extends SBIS3.CONTROLS.ListView
    * @control
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyDataGrid
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
      _dotTplFn : dotTplFn,
      $protected: {
         _rowTpl : rowTpl,
         _rowData : [],
         _options: {
            /**
             * @typedef {Object} Columns
             * @property {String} title Заголовок колонки
             * @property {String} field Имя поля
             * @property {Number} width Ширина колонки
             * Значение необходимо задавать для колонок с фиксированной шириной.
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
             * @see setPage
             * @see getPage
             */
            paging: 'no',
            /**
             * @cfg {Object} Редактирование по месту
             */
            editInPlace: {
               enabled: false,
               addInPlace: false
            }
         }
      },

      $constructor: function() {
         this._thead = $('.controls-DataGrid__thead', this._container.get(0));
         this._colgroup = $('.controls-DataGrid__colgroup', this._container.get(0))
      },

      init: function() {
         DataGrid.superclass.init.call(this);
         if (this._options.editInPlace.enabled && this._options.editInPlace.addInPlace && !this._editInPlace) {
            this._initAddInPlace();
         }
      },
      _initAddInPlace: function() {
         var
            self = this,
            itemsContainer = this._getItemsContainer(),
            tr = '';
         this._addInPlaceButton = new Link({
            name: 'controls-ListView__addInPlace-button',
            icon: 'sprite:icon-16 icon-NewCategory',
            caption: 'Новая запись',
            element: $('<div>').appendTo(this._container.find('.controls-ListView__addInPlace-container'))
         });
         if (this._options.multiselect) {
            tr += '<td class="controls-DataGrid__td"></td>';
         }
         for (var i in this._options.columns) {
            tr += '<td class="controls-DataGrid__td"></td>';
         }
         tr += '</tr>';
         this._addInPlaceButton.subscribe('onActivated', function() {
            self._initEditInPlace();
            self._editInPlace.showEditing(
               $('<tr class="controls-DataGrid__tr controls-ListView__item">' + tr)
                  .appendTo(itemsContainer));
         });
      },
      _initEditInPlace: function() {
         var self = this;
         if (!this._editInPlace) {
            this._dataSet.subscribe('onRecordChange', function(event, record) {
               self._getItemsContainer().find('.controls-ListView__item[data-id="' + record.getKey() + '"]')
                  .empty()
                  .append($(self._getItemTemplate(record)).children());
            });
            this._editInPlace = new EditInPlaceController({
               columns: this._options.columns,
               addInPlaceButton: this._addInPlaceButton,
               element: $('<div>').appendTo(this._container),
               dataSet: this._dataSet,
               ignoreFirstColumn: this._options.multiselect,
               dataSource: this._dataSource
            });
         }
      },
      
      _onChangeHoveredItem: function(hoveredItem) {
         if (this._options.editInPlace.enabled && this._options.columns && this._options.columns.length) {
            this._initEditInPlace();
            this._editInPlace.updateDisplay(hoveredItem);
         }
         DataGrid.superclass._onChangeHoveredItem.apply(this, arguments);
      },
      
      /**
       * Установить страницу по её номеру.
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
       * Получить номер текущей страницы.
       * @remark
       * Метод получения номера текущей страницы представления данных.
       * Работает при использовании постраничной навигации.
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

      _checkHeadContainer: function(target) {
         var headContainer = this._container.find('.controls-DataGrid__thead');
         return headContainer && target.closest(headContainer).length || this._editInPlace && target.closest('.controls-ListView__addInPlace-container').length;
      },

      _getItemsContainer: function(){
         return $('.controls-DataGrid__tbody', this._container);
      },

      _getItemTemplate: function(item){
         if (!this._options.itemTemplate) {

            var rowData = {columns : [], multiselect : this._options.multiselect, hierField: this._options.hierField + '@'};
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
               rowData.columns[i].item = item;
            }
            return this._rowTpl(rowData)
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