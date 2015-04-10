/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.PrintPlugin', [ 'js!SBIS3.CONTROLS.ListViewDS' ],
   function(ListViewDS) {

   var MAX_VALUE = 20000;  //Максимальное количество записей на операцию

   /**
    * @class   $ws.proto.ListViewDS.PrintPlugin
    * @extends $ws.proto.ListViewDS
    * @plugin
    * $ws.proto.ListViewDS.PrintPlugin
    */
   ListViewDS.PrintPlugin = ListViewDS.extendPlugin(/** @lends $ws.proto.ListViewDS.PrintPlugin.prototype */{
      //$withoutCondition: [ 'init', 'setUseDefaultPrint' ],
      $protected: {
         _options: {

         }
      },
      $condition: function(){
         //return this._useDefaultPrint || !Object.isEmpty(this._options.reports || {}) || !Object.isEmpty(this._options.reportsForList || {});
         return true;
      },
      $constructor: function(){
         console.log('print Constructor');
      },
      _saveToFile: function(options, idReport, data, isReportsForList) {
         var readerParams = this.getDataSource().readerParams,
               listMethod = readerParams ? readerParams.queryName : 'Список',
               isSaveColumns = options.columns && options.columns.length > 0,
               fileName = idReport ? idReport : (isSaveColumns ? 'Выбранные столбцы' : 'Как на экране'),
               xsl,
               fileType = options.fileType,
               userSaveToExcelListMethod = fileType === 'EXCEL' && typeof this._options.saveToExcelListMethod === 'string' && this._options.saveToExcelListMethod.length,
               object = fileType,
               methodName = fileType === 'PDF' ?
                     (typeof this._options.savePrepareMethod === 'string' && this._options.savePrepareMethod.length ?
                           this._options.savePrepareMethod :
                           'Сохранить') :
                     (idReport ?
                           'СохранитьПоHTML' :
                           (isReportsForList || userSaveToExcelListMethod ?
                                 'Сохранить' :
                                 'СохранитьВыборочно')),
               filter = this.getQuery(),
               rp = this._reportPrinter,
               uniqueToken = ('' + Math.random()).substr(2)* 1,
               self = this,
               rootNode,
               xmlDoc,
               xslDoc,
               params,
               columns;


         xsl = this._notify('onPrepareReportName', fileType, idReport);
         if (!xsl) {
            xsl = this._getCurrentTransform(idReport, isReportsForList);
         }

         if (object === 'EXCEL') {
            object = 'Excel';
         }

         if (this.isHierarchyMode()) {
            rootNode = this._currentRootId;
         }
         if (fileType === 'EXCEL' && !idReport) {
            if (isReportsForList && !idReport) {
               params = {
                  'ИмяМетода': userSaveToExcelListMethod ?
                        this._options.saveToExcelListMethod :
                        (readerParams ? readerParams.linkedObject + '.' + listMethod : ''),
                  'Фильтр': $ws.helpers.prepareFilter(filter),
                  'Сортировка': $ws.helpers.prepareSorting(filter)
               };
            } else {
               params = {
                  'Записи': data ? (data instanceof Array ? this._serializeRecords(data) : data) : this.getRecordSet()
               };
            }
            params['Поля'] = isSaveColumns ? options.columns : this.getFields();
         }
         if (params && !Object.isEmpty(params)) {
            params['Название'] = fileName;
            params.fileDownloadToken = uniqueToken;
         }
         if (fileType === 'PDF' || (fileType === 'EXCEL' && idReport !== undefined)) {
            data = this._transformToRS(data);
            xsl = this._getTransform(idReport, data, xsl, isReportsForList, fileType);
            xslDoc = new $ws.proto.XMLDocument({ name: xsl }).getDocument();
            xmlDoc = $ws.single.RecordSetToXMLSerializer.serialize(data, rp.getColumns(), rp.getTitleColumn(), rootNode);
            columns = this._notify('onBeforeTransform', xmlDoc, xslDoc);
            rp.setColumns(typeof columns === 'array' ? columns : this._columnMap);
            rp.prepareReport(data, xslDoc, rootNode, xmlDoc).addCallback(function(reportText){
               self._checkSaveIndicator(object, methodName, {
                  'html': reportText,
                  'Название': fileName,
                  'fileDownloadToken': uniqueToken
               }, fileType);
            });
         } else if (params && !Object.isEmpty(params) && object && methodName) {
            this._checkSaveIndicator(object, methodName, params, fileType);
         }
         this.removeSelection();
      }
   });

});
