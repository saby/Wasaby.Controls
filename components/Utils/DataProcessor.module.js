/**
 * Created by ad.chistyakova on 14.04.2015.
 */
define('js!SBIS3.CONTROLS.Utils.DataProcessor', [
   'js!SBIS3.CONTROLS.Data.Source.SbisService',
   'js!SBIS3.CONTROLS.Utils.DataSetToXMLSerializer',
   'js!SBIS3.CORE.LoadingIndicator',
   'i18n!SBIS3.CONTROLS.Utils.DataProcessor'
], function(Source, Serializer, LoadingIndicator) {
   /**
    * Обработчик данных для печати и выгрузки(экспорта) в Excel, PDF.
    * Печать осуществляется по готову xsl шаблону через xslt-преобразование
    * Экспорт в Excel и PDF можно выполнить несколькими способами:
    * 1) подготовить данные на клиенте и через xslt преобразовать в HTML, а дальше отправить на сервер
    * 2) Подготовить либо данные, либо просто фильтр для списочного метода и отправить на сервер, где будет происходить
    * обработка данных и их преобразование в Excel или PDF. В данном случае будет использован сервис file-transfer
    * @class SBIS3.CONTROLS.Utils.DataProcessor
    * @author Крайнов Дмитрий Олегович
    * @public
    */
   return $ws.core.extend(/** @lends SBIS3.CONTROLS.Utils.DataProcessor.prototype */{}, {

      $protected: {
         _options: {
            /**
             * @cfg DataSet - набор с данными
             */
            dataSet: undefined,
            /**
             * @noShow
             */
            report: undefined,
            /**
             * @cfg {String} Путь до файла xsl
             */
            xsl : 'default-list-transform.xsl', //что делать с item  ?
            /**
             * @cfg {Array} Набор колонок датасета
             */
            columns: [],
            /**
             * @cfg {String} Поле иерархии для обработки иерархических списков
             */
            hierField: undefined,
            /**
             * @cfg {Object} Список раскрытых узлов дерева (если нужно выгружать )
             */
            openedPath : {},
            /**
             * @cfg {String} Корень иерархии
             */
            root : undefined,
            /**
             * Предустановленный фильтр для списочного метода
             * @cfg {Object} поле иерархии для обработки иерархических списков
             */
            filter: {},
            /**
             * Сдвиг навигации
             * @cfg {Number}
             */
            offset: 0,
            /**
             * @cfg (number) Минимальная ширина предварительного окна печати
             */
            minWidth : 0
         },
         _reportPrinter : null,
         _loadIndicator: undefined
      },

      $constructor: function() {
      },
      /**
       * Отправить на печать готовый dataSet
       */
      print: function () {
         var self = this;
         this._prepareSerializer(rk('Печать записей...')).addCallback(function(reportText){
            $ws.helpers.showHTMLForPrint({
               htmlText: reportText,
               minWidth : self._options.minWidth,
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
       * @deprecated метод unload переименован в exportData
       * @param fileType - Имя объекта выгрузки (Например Excel)
       * @param methodName - Име метода объекта выгрцзки (например Сохранить)
       * @param fileName - Имя файла
       * @param [cfg] Если задана конфигурация выгрузки, то в метод уйдет только заданная конфигурация (она же фильтр)
       * @param useGET
       */
      unload: function (fileType, methodName, fileName, cfg, useGET) {
         this.exportData(fileType, methodName, fileName, cfg, useGET);
      },
      /**
       * Выгрузить данные, создав HTML на клиенте через xslt-преобразоование
       * @param fileType - Имя объекта выгрузки (Например Excel)
       * @param methodName - Име метода объекта выгрцзки (например Сохранить)
       * @param fileName - Имя файла
       * @param [cfg] Если задана конфигурация выгрузки, то в метод уйдет только заданная конфигурация (она же фильтр)
       * @param useGET
       */
      exportData: function (fileType, methodName, fileName, cfg, useGET) {
         var self = this,
            uniqueToken = ('' + Math.random()).substr(2)* 10;
         //fileName = idReport ? idReport : (isSaveColumns ? 'Выбранные столбцы' : 'Как на экране'), ??
         if (!cfg) {
            this._prepareSerializer(rk('Подождите, идет выгрузка данных в') + ' ' + fileType).addCallback(function(reportText){
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
       * Выгрузить данные с помощью готовой HTML-верстки
       * @param fileName
       * @param {String} fileType PDF или Excel
       * @param [methodName] - имя метода объекта fileType
       * @param {Object} cfg - параметры метода methodName {FileName : имя файла, html: html верстка ввиде строки}
       * @param {number} pageOrientation 1 - потртетная, 2 - альбомная
       */
      exportHTML: function(fileName, fileType, methodName, cfg, pageOrientation){
         var self = this;
         this._prepareSerializer(rk('Подождите, идет выгрузка данных в') + ' ' + fileType).addCallback(function(reportText){
            var newCfg = {
               'FileName': fileName,
               'html': reportText
            };
            if (pageOrientation) {
               newCfg.PageOrientation = pageOrientation;
            }
            self.exportFileTransfer(fileType, methodName || 'SaveHTML', cfg || newCfg).addErrback(function(error){
               return error;
            }).addBoth(function(){
               self._destroyLoadIndicator();
            });

         });
      },
      /**
       * Выгрузить данные в Excel или PDF по фильтру списочного метода
       * @param fileName
       * @param {String} fileType PDF или Excel
       * @param [methodName] имя метода объекта fileType
       * @param {Object} cfg - параметры метода methodName
       * @param {number} pageOrientation 1 - потртетная, 2 - альбомная
       */
      exportList: function(fileName, fileType, methodName, cfg, pageOrientation){
         var self = this;
         cfg = cfg || {};
         if (fileName) {
            cfg.FileName = fileName;
         }
         if (pageOrientation) {
            cfg.PageOrientation = pageOrientation;
         }
         this._createLoadIndicator(rk('Подождите, идет выгрузка данных в') + ' ' + fileType);
         this.exportFileTransfer(fileType, methodName || 'SaveList', cfg).addBoth(function(){
            self._destroyLoadIndicator();
         });
      },
      /**
       * Выгрузить данные в Excel или PDF по набору данных
       * @param fileName
       * @param {String} fileType PDF или Excel
       * @param [methodName] - имя метода объекта fileType
       * @param {Object} cfg - параметры метода methodName
       * @param {number} pageOrientation 1 - потртетная, 2 - альбомная
       */
      exportDataSet: function(fileName, fileType, methodName, cfg, pageOrientation){
         var self = this,
            columns  = $ws.core.clone(this._options.columns),
            records,
            rawData  = {s : [], d : []},
            fields = [], titles = [];
         if (!cfg) {
            for (var i = 0; i < columns.length; i++) {
               fields.push(columns[i].field);
               titles.push(columns[i].title || columns[i].field);
            }

            //TODO после метода filter сейчас dataSet возвращает getRawData = null, ошибка выписана, после исправления просто передать рекордсет
            //и перевести на SbisService.call
            records = this._options.dataSet.toArray();
            for (i = 0; i < records.length; i++) {
               var raw = records[i].getRaw();
               rawData.d.push(raw.d);
            }
            rawData.s = raw.s;
            //--------------------------------

            cfg = {
               FileName : fileName,
               Fields : fields,
               Titles : titles,
               Data : rawData
            };
            if (pageOrientation) {
               cfg.PageOrientation = pageOrientation;
            }
         }

         this._createLoadIndicator(rk('Подождите, идет выгрузка данных в') + ' ' + fileType);
         this.exportFileTransfer(fileType, methodName || 'SaveRecordSet', cfg).addBoth(function(){
            self._destroyLoadIndicator();
         });
      },
      /**
       * Универсальная выгрузка данных через сервис file-transfer
       * @param object
       * @param methodName
       * @param cfg
       * @returns {$ws.proto.Deferred}
       */
      exportFileTransfer: function(object, methodName, cfg){
         var self = this,
            blob = new $ws.proto.BLObject({
               name: object
            });
         //TODO поменять, когда рекордсеты заработают
         //var dataSource = new Source({
         //   endpoint: {
         //      contract: object
         //   }
         //});
         //return dataSource.call(methodName, cfg).addCallback(function(ds){
         //   self.downloadFile(ds.getScalar());
         //   return ds;
         //}).addErrback(function (error){
         //   $ws.single.ioc.resolve('ILogger').log('DataProcessor. Ошибка выгрузки данных', error.details);
         //   return error;
         //});
         return blob.call(methodName, cfg, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function(id){
            self.downloadFile(id);
         }).addErrback(function (error){
            $ws.single.ioc.resolve('ILogger').log(rk('DataProcessor. Ошибка выгрузки данных'), error.details);
            return error;
         });
      },
      /**
       * Загрузить файл по готовому id
       * @param id - уникальный идентификатор файла на сервисе file-transfer
       */
      downloadFile : function(id){
         window.open($ws.helpers.prepareGetRPCInvocationURL( 'File','Download', {'id': id}, undefined, '/file-transfer/service/'), '_self');
      },
      /**
       * Метод для формирования параметров фильтрации выгружаемого на сервере файла.
       * Чтобы сформировать свои параметры этот метод можно переопределить
       * @remark Обязательно должны быть заданы в опциях this._options и columns. Так же самостоятельно придется добавить имя файла
       * @example
       * <pre>
       *    //В своем прикладном модуле (myModule), отнаследованном от OperationUnload
       *    prepareGETOperationFilter: function(selectedNumRecords){
       *       var cfg = myModule.superclass.processSelectedPageSize.apply(this, arguments);
       *       //Сформируем свой набор колонок для выгрузки
       *       cfg['Поля'] = this.getUserFields();
       *       cfg['Заголовки'] = this.getUserTitles();
       *       return cfg;
       *    }
       * </pre>
       * @param selectedNumRecords сколько записей нужно выгружать
       * @param {boolean} eng - заполнять специальный фильтр для file-transfer (на английском)
       * @returns {{}}
       */
      getFullFilter : function(selectedNumRecords, eng){
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
            cfg[eng ? 'HierarchyField' : 'Иерархия'] = hierField;
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
         cfg[eng ? 'MethodName': 'ИмяМетода'] = dataSource.getEndpoint().contract + '.' + dataSource.getBinding().query;
         cfg[eng ? 'Filter' : 'Фильтр'] = queryParams['Фильтр'] || {};
         cfg[eng ? 'Sorting' : 'Сортировка'] =  queryParams['Сортировка'];
         cfg[eng ? 'Pagination' : 'Навигация'] = !selectedNumRecords ? null : queryParams['Навигация'];
         cfg[eng ? 'Fields' : 'Поля'] = fields;
         cfg[eng ? 'Titles' : 'Заголовки'] = titles;
         if (!eng) {
            cfg['fileDownloadToken'] = ('' + Math.random()).substr(2)* 1;
         }
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

