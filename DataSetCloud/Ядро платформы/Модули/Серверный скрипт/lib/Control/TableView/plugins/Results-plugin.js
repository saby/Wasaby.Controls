/**
 * Created with JetBrains PhpStorm.
 * User: aa.adilov
 * Date: 27.11.12
 * Time: 15:24
 * To change this template use File | Settings | File Templates.
 */

define("js!SBIS3.CORE.ResultsPlugin", ["js!SBIS3.CORE.TableView"], function(TableView){

/**
 * @class   $ws.proto.TableView.ResultsPlugin
 * @extends $ws.proto.TableView
 * @plugin
 */
$ws.proto.TableView.ResultsPlugin = TableView.extendPlugin(/** @lends $ws.proto.TableView.ResultsPlugin.prototype */{
   $withoutCondition: [ '_mapColumns' ],
   $protected: {
      _options: {
         display: {
            /**
             * @cfg {Boolean} Всегда отображать строку с итогами
             * <wiTag group="Данные" page=8>
             * <wiTag class=HierarchyView page=1>
             * Данная опция позволяет отображать строку итогов в случае отсутствия записей.
             * Возможные значения:
             * <ol>
             *    <li>true - отображать итоги всегда;</li>
             *    <li>false - не отображать итоги при пустом браузере.</li>
             * </ol>
             * @see resultText
             * @see resultsRender
             * @group Results
             */
            alwaysDisplayResults: false,
            /**
             * @cfg {Function} Функция рендеринга итогов
             * В качестве аргумента принимает jQuery объект строки итогов.
             * <wiTag page=8>
             * <wiTag class=HierarchyView page=1>
             * @example
             * <pre>
             *    resultsRender: function(resultRow){
             *       resultRow.addClass('ws-bold');
             *    }
             * </pre>
             * @group Results
             */
            resultsRender : '',
            /**
             * @cfg {String} Тип итогов
             * <wiTag class=HierarchyView page=1>
             * По каким записям считать итоги.
             * @variant leaves по листьям
             * @variant folders  по узлам
             * @variant foldersAndLeaves по узлам и листьям
             * @see resultText
             * @group Results
             */
            resultType : 'foldersAndLeaves',
            /**
             * @cfg {String} Заголовок строки итогов
             * <wiTag page=8>
             * <wiTag class=HierarchyView page=1>
             * @see alwaysDisplayResults
             * @see resultsRender
             * @group Results
             */
            resultText : '&Sigma;'
         }
      },
      _resultFields: [],                     //Список полей, по которым считаем итоги
      _resultTypes: {
         'leaves': 'По листьям',
         'folders': 'По узлам',
         'foldersAndLeaves': 'По узлам и листьям'
      },
      _resultBrowser: undefined,             //Таблица для отображения "итогов"
      _resultContainer: undefined,           //Контейнер с итогами
      _hasResults: false,                    //есть ли сейчас итоги в таблице
      _hasResultFields: undefined                //если ли у нас столбцы, по которым считаются итоги
   },
   $condition: function(){
      return !!this._hasResultFields || this._hasResults;
   },
   $constructor: function() {
      this._publish('onResultUpdate');
   },
   _setTablesWidth: function (tablesWidth) {
      if (this._resultBrowser) {
         this._resultBrowser.width(tablesWidth);
      }
   },
   /*
    * для столбцов с итогами добавить параметр isResultField
    */
   _mapColumns: function(){
      var configColumns = this._options.display.columns,
          recivedColumns = this._currentRecordSet && this._currentRecordSet.getColumns(),
          columns = configColumns ? configColumns : recivedColumns;
      this._hasResultFields = false;
      if (columns) {
         for (var i = 0, l = columns.length; i < l; i++) {
            this._columnMap[i].isResultField = columns[i].isResultField === undefined ? false : columns[i].isResultField;
            if (!this._hasResultFields && this._columnMap[i].isResultField)
               this._hasResultFields = true;
         }
      }
      this._initResultFieldsList();
      if(this._options.dataSource.filterParams === undefined){
         this._options.dataSource.filterParams = {};
         this._options.dataSource.filterParams["_Итоги"] = this._options.filterParams["_Итоги"];
      }
   },
   _beforeDrawActions: function(){
      if (this._resultContainer) {
         this._resultContainer.toggleClass('ws-hidden',
               !((this._options.display.alwaysDisplayResults || this._currentRecordSet.getRecordCount() > 0) && !this._minimized));
      }
   },
   _createContainer: function(){
      var results = [
         '<div class="ws-browser-head-results">',
            '<tr>' ,
               '<td>' ,
                  '<div class="ws-browser-results-block">' ,
                     '<table class="ws-table-fixed ws-browser-foot results" cellspacing="0">' ,
                        '<colgroup>' ,
                           this._renderColgroups(),
                        '</colgroup>' ,
                        '<tbody></tbody>' ,
                     '</table>' ,
                  '</div>' ,
               '</td>' ,
            '</tr>',
         '</div>'].join('');

      this._headContainer.append(results);
      this._resultBrowser = this._rootElement.find('.ws-browser-foot.results');
      this._resultContainer = this._rootElement.find('.ws-browser-results-block');
   },
   _useShowingFooter: function ( ) {
      return true;
   },
   _getHeadHtml: function (html) {
      return html || [
            '<div class="ws-browser-head-container">',
            '</div>'].join('');
   },
   _refreshResults: function(){
      this._updateResults();
      return true;
   },
   /**
    * Изменяет итоги в таблице
    */
   _updateResults: function(){
      var oldResultsLength = this._resultBrowser.find('.ws-browser-results').length;
      if (this._resultFields.length !== 0){
         if(oldResultsLength === 0) // если итогов не было, то вставим для них строчку
            this._resultBrowser.prepend('<tr class="ws-browser-results"></tr><td class="ws-browser-checkbox-holder"/>');
         else
            this._resultBrowser.find('.ws-browser-results td').remove(); // иначе просто вычистим все столбцы
         var colsCount = this._columnMap.length;
         var results = this._currentRecordSet.getResults(),
             resultTR, resultTD, textContainer, colDef, data;
         resultTR = $('<tr class="ws-browser-results"/>');
         for(var i = 0; i < colsCount; i++){
            colDef = this._columnMap[i];
            data = '';
            resultTD = $(this._createTdTemplate(i));
            if(colDef.isResultField && results !== null && results.hasColumn(colDef.field)){
               resultTD.attr('title', colDef.title);
               data = results.get(colDef.field);
               data = data === null ? 0 : data;
               switch (colDef.type){
                  case "Деньги":
                     data = $ws.render.defaultColumn.money(data);
                     break;
                  case "oid":
                  case "int2":
                  case "int4":
                  case "int8":
                  case "Число целое":
                     data = $ws.render.defaultColumn.integer(data); // формат числа
                     break;
               }
            }
            textContainer = resultTD.find('.ws-browser-cell-container');
            if(i === 0){
               if(this._needShowSelectionCheckbox())
                  resultTD.attr("colspan", 2);
               textContainer.append($('<span class="ws-browser-sigma">' + this._options.display.resultText + '</span><div>' + data + '</div>'));
            } else {
               //резвые люди в итогах возвращают массив, не ясно зачем и почему, но защитимся от этого
               textContainer.html(data ? data.toString() : '');
            }
            resultTR.append($(resultTD));
         }
         if (this._getVerticalScrollShowed()) {
            resultTR.append($('<td class="ws-browser-header-cell-scroll-placeholder" width="' + this._scrollWidth + '"/>'));
         }
         if(typeof(this._options.display.resultsRender) === 'function')
            this._options.display.resultsRender.apply(this, [resultTR, results]);
         this._resultBrowser.find('.ws-browser-results').replaceWith(resultTR);
         this._hasResults = true;
         this._notify('onResultUpdate');
         this._setHeight();
      } else {
         if(oldResultsLength !== 0){// если до этого были итоги, то удалим их
            this._resultBrowser.find('.ws-browser-results').remove();
            this._hasResults = false;
            this._setHeight();
         }
      }
      //Нужно обновить этот размер, чтоб не вызывался лишний пакетный пересчёт в DataViewAbstract._checkContainerHeightForRecalk,
      //и не запускался лишний пересчёт авторазмеров в ответ на onResizeHandler
      this._setContainerHeightForRecalk();
   },
   /**
    * Обработчик скролла в теле браузера
    * @param {Number} scrollLeft прокрутка содержимого по-горизонтали
    */
   _onScrollActions: function(scrollLeft){
      this._resultBrowser.parent().scrollLeft(scrollLeft);
   },
   /*
    * Запоминает по каким полям нужно считать итоги
    */
   _initResultFieldsList: function(){
      this._resultFields = [];
      for(var j = 0, k = this._options.display.columns.length; j < k; j++){
         if(this._options.display.columns[j].isResultField === true)
            this._resultFields.push(this._options.display.columns[j].field);
      }
      if(this._resultFields && this._resultFields.length !== 0){
         if(!this._options.display.resultType)
            this._options.display.resultType = 'leaves';
         this._options.filterParams["_Итоги"] = {
            'ПоляРасчета': this._resultFields,
            'ВидРасчета': this._resultTypes[this._options.display.resultType]
         };
         this._systemParams["_Итоги"] = this._options.filterParams["_Итоги"];
      } else {
         delete this._systemParams["_Итоги"];
      }
   },
   _onDataLoaded: function(eventState, recordSet, isSuccess, error){
      if(isSuccess)
         this._updateResults();
   },

   _setWidth: function() {
      this._updateResultsColgroup();
   },

   setColumns: function(){
      var self = this;
      this._dReady.addCallback(function(){
         var oldResultFields = {},
               needReload = false,
               i, l, k;
         l = self._resultFields.length;
         for(i = 0; i < l; i++){
            oldResultFields[self._resultFields[i]] = true;
         }
         self._initResultFieldsList();
         k = self._resultFields.length;
         if(l !== 0 && k !== 0){
            if(l == k){
               for(i = 0; i < k; i++){
                  if(!oldResultFields[self._resultFields[i]]){
                     needReload = true;
                     return;
                  }
               }
            } else {
               needReload = true;
            }
         }
         if(needReload){
            var newFilter = self.getQuery();
            newFilter["_Итоги"] = self._options.filterParams["_Итоги"];
            self.setQuery(newFilter);
         } else
            self._updateResults();
      });
   },
   _updateResultsColgroup: function(){
      if(this._resultBrowser){
         var resultBrowserColgroup = this._resultBrowser.find('colgroup');
         resultBrowserColgroup.empty().append($(this._renderColgroups(true)));
         var resultCols = resultBrowserColgroup.find('col.ws-browser-col');
         this._bodyColumns.each(function(i){
            if(resultCols[i]) {
               resultCols[i].setAttribute('width', this.getAttribute('width'));
            }
         });
      }
   },
   _createTdTemplate: function(colIndex){
      var td = document.createElement('td'),
            colDef = colIndex >= 0 ? this._columnMap[colIndex] : {
               type: 'Строка',
               render: null,
               field: this._options.display.titleColumn,
               title: this._options.display.titleColumn,
               className: '',
               allowEditAtThePlace: this._titleColumnIndex == -1 ? false : this._columnMap[this._titleColumnIndex].allowEditAtThePlace,
               textAlign: 'left',
               fixedSize: false
            },
            className = $ws._const.Browser.type2ClassMap[colDef.type] || colDef.type,
            classes = [ ];

      if(this._options.display.cutLongRows)
         classes.push('ws-browser-cell-cut');

      if(colDef.textAlign !== 'auto')
         classes.push('ws-browser-' + colDef.textAlign);
      else {
         if(className)
            classes.push('ws-browser-type-' + className);
      }
      if(colDef.className)
         classes.push(colDef.className);

      if(classes.length > 0)
         td.className = classes.join(' ');

      var container = document.createElement('div');
      container.className = 'ws-browser-cell-container' + (this._options.display.cutLongRows ? ' ws-browser-div-cut' : '');

      if(this.isHierarchyMode() && colIndex <= 0){
         var elem = document.createElement('div');
         elem.className = "ws-browser-text-container";
         container.appendChild(elem);
      }
      td.appendChild(container);
      return td;
   }
});
});
