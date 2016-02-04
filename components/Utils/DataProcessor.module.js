/**
 * Created by ad.chistyakova on 14.04.2015.
 */
define('js!SBIS3.CONTROLS.Utils.DataProcessor', [
   'js!SBIS3.CONTROLS.Utils.DataSetToXMLSerializer',
   'js!SBIS3.CORE.LoadingIndicator'
], function(Serializer, LoadingIndicator) {

   return $ws.core.extend({}, {

      $protected: {
         _options: {
            dataSet: undefined,
            report: undefined,
            xsl : 'default-list-transform.xsl', //что делать с item  ?
            columns: [],
            hierField: undefined,
            openedPath : {},
            root : undefined,
            filter: {},
            offset: 0
         },
         _reportPrinter : null,
         _loadIndicator: undefined
      },

      $constructor: function() {
      },
      print: function () {
         var self = this;
         this._prepareSerializer('Печать записей...').addCallback(function(reportText){
            $ws.helpers.showHTMLForPrint({
               htmlText: reportText,
               //opener: self,
               handlers: {
                  onAfterClose: function() {
                     self._destroyLoadIndicator();
                  }
               }
            }).addCallback(function(printDialog){
               self._destroyLoadIndicator();
            });
         });
      },
      /**
       *
       * @param fileType - Имя объекта выгрузки (Например Excel)
       * @param methodName - Име метода объекта выгрцзки (например Сохранить)
       * @param fileName - Имя файла
       * @param [cfg] Если задана конфигурация выгрузки, то в метод уйдет только заданная конфигурация (она же фильтр)
       * @param useGET
       */
      unload: function (fileType, methodName, fileName, cfg, useGET) {
         var self = this,
             uniqueToken = ('' + Math.random()).substr(2)* 10;
         //fileName = idReport ? idReport : (isSaveColumns ? 'Выбранные столбцы' : 'Как на экране'), ??
         if (!cfg) {
            this._prepareSerializer('Подождите, идет выгрузка данных в ' + fileType).addCallback(function(reportText){
               $ws.helpers.saveToFile(fileType, methodName, {
                  'html': reportText,
                  'Название': fileName,//idReport || Standart
                  'fileDownloadToken': uniqueToken
               }, undefined, useGET).addErrback(function(error){
                  return error;
               }).addBoth(function(){
                  self._destroyLoadIndicator();
               });
            });
         } else {
            $ws.helpers.saveToFile(fileType, methodName, cfg, undefined, true);
         }

      },
      /**
       * Метод для формирования параметров фильтрации выгружаемого на сервере файла.
       * Чтобы сформировать свои параметры этот метод можно переопределить
       * @remark Обязательно должны быть заданы в опциях this._options и columns. Так же самостоятельно придется добавить имя файла
       * @example
       * <pre>
       *    //В своем прикладном модуле (myModule), отнаследованном от OperationUnload
       *    prepareGETOperationFilter: function(selectedNumRecords){
       *       var cfg = myModule.superclass.processSelectedOperation.apply(this, arguments);
       *       //Сформируем свой набор колонок для выгрузки
       *       cfg['Поля'] = this.getUserFields();
       *       cfg['Заголовки'] = this.getUserTitles();
       *       return cfg;
       *    }
       * </pre>
       * @param selectedNumRecords сколько записей нужно выгружать
       * @returns {{}}
       */
      getFullFilter : function(selectedNumRecords){
         var dataSource = this._options.dataSource,
            columns = $ws.core.clone(this._options.columns),
            fields = [],
            titles = [],
            filter,
            queryParams,
            cfg = {},
            openedPath,
            hierField;

         for (var i = 0; i < columns.length; i++) {
            fields.push(columns[i].field);
            titles.push(columns[i].title || columns[i].field);
         }
         //openedPath[key] = true;
         filter = $ws.core.clone(this._options.filter || {});
         if (this._options.hierField !== undefined){
            hierField = this._options.hierField;
            cfg['Иерархия'] = hierField;
            openedPath = this._options.openedPath;
            // - getOpenedPath - 'это работает только у дерева!!
            if (openedPath && !Object.isEmpty(openedPath)) {

               filter[hierField] = filter[hierField] === undefined ? [this._options.root] : filter[hierField];
               filter[hierField] = filter[hierField] instanceof Array ? $ws.core.clone(filter[hierField]) : [filter[hierField]];
               for (i in openedPath) {
                  if (openedPath.hasOwnProperty(i) && Array.indexOf( filter[hierField], i) < 0) {
                     filter[hierField].push(i);
                  }
               }
            }
         }
         queryParams =  dataSource.prepareQueryParams(filter, null, this._options.offset , selectedNumRecords || this._options.dataSet.getCount(), false);
         cfg = $ws.core.merge(cfg, {
            //TODO дать настройку ?
            'ИмяМетода' : dataSource._options.service + '.' + dataSource._options.queryMethodName,
            'Фильтр': queryParams['Фильтр'],
            'Сортировка' : queryParams['Сортировка'],
            'Навигация' : queryParams['Навигация'],
            'Поля': fields,
            //TODO возможно стоит тоже дать настройку ?
            'Заголовки' : titles,
            'fileDownloadToken' : ('' + Math.random()).substr(2)* 1
         });
         return cfg;
      },
      _prepareSerializer: function(title){
         var serializer = new Serializer({
                  columns: this._options.columns,
                  report: this._options.report
               });
         this._createLoadIndicator(title);
         return serializer.prepareReport(this._options.xsl, this._options.dataSet);
      },
      _createLoadIndicator: function (message) {
         this._loadIndicator = new LoadingIndicator({
            'message': message,
            'name': 'ws-load-indicator'
         });
      },
      _destroyLoadIndicator: function ( ) {
         if (this._loadIndicator) {
            this._loadIndicator.hide();
            this._loadIndicator.destroy();
            this._loadIndicator = undefined;
         }
      }
   });
});

