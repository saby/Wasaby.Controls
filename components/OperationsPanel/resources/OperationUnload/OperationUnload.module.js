/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationUnload', [
   'js!SBIS3.CONTROLS.PrintUnloadBase',
   'js!SBIS3.CONTROLS.Utils.DataProcessor'
], function(PrintUnloadBase) {

   var OperationUnload = PrintUnloadBase.extend({

      $protected: {
         _options: {
            icon: 'sprite:icon-24 action-hover icon-Save icon-primary',
            title: 'Выгрузить',
            linkText: 'Выгрузить',
            caption: 'Выгрузить',
            items: [
               {
                  id : 'PDF',
                  title : 'Список в PDF',
                  test: 'saver',
                  icon : 'sprite:icon-24 icon-PDF2 icon-multicolor action-hover'
               },
               {
                  id : 'Excel',
                  title : 'Список в Excel',
                  icon : 'sprite:icon-24 icon-Excel icon-multicolor action-hover'
               }
            ]
         },
         _controlsId: {
            'PDF' : true,
            'Excel'  : true
         }
      },

      $constructor: function() {
         //Почему-то нельзя в опциях указать handlers {'onMenuActivated' : function(){}} Поэтогму подписываемся здесь
         this.subscribe('onMenuItemActivate', this._menuItemActivated);
         this._clickHandler = this._clickHandler.callNext(this._clickHandlerOverwritten);
      },
      _clickHandlerOverwritten: function() {
         var items = this.getItems(),
             item, extraText, itemId;
         console.log('_clickHandler');
         //view.deleteRecords(records);
         extraText =  this._isSelectedState() ? ' сохраненных ' : ' ';
         while (item = items.getNextItem(itemId)) {
            itemId = item.id;
            //Меняем текст только у платформенных пунктов меню
            if (this._controlsId[itemId]) {
               item.title = 'Список'  + extraText + 'в ' + itemId;
               //item.caption = 'Список'  + extraText + 'в ' + itemId;
               //TODO Возможно, когда-нибудь будет правильный метод для перерисовки внутренностей меню и внизу можно будет вызывать полную перерисовку picker без его уничтожения
               this._picker._container.find('>[data-id="' + itemId + '"]').find('.controls-MenuItem__text').text( item.title );
            }
         }
         //Относится к TODO в while выше
         //this._drawItemsCallback();

         //selectedItems = this._view.getSelectedItems(),
         //      records = selectedItems.length ? selectedItems : this._view._dataSet._indexId
      },
      _menuItemActivated: function(event, itemId){
         debugger;
         this._prepareOperation('Что сохранить в ' + itemId);
      },
      _isSelectedState: function(){
         return this._view.getSelectedItems().length > 0;
      },
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //$ws.helpers.saveToFile(object, methodName, params).addCallback(function(){
      //      self._destroyLoadIndicator();
      //   });
      //------------------____from Print-Plugin
      _saveTo: function(idReport, isReportForList, fileType) {
         var self = this,
               title = 'Что сохранить в ' + fileType;

         this._validateRecordCount(title).addCallback(function(records) {
            self._prepareDataToSave(fileType,
                  fileType === 'EXCEL' && typeof self._options.saveToExcelListMethod === 'string' && self._options.saveToExcelListMethod.length ? undefined : idReport,
                  isReportForList,
                  records);
         });
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

   return OperationUnload;

});