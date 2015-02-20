/**
 * Created with JetBrains PhpStorm.
 * User: aa.adilov
 * Date: 19.11.12
 * Time: 16:59
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.PrintPlugin', [ 'js!SBIS3.CORE.DataViewAbstract', 'js!SBIS3.CORE.Dialog', 'js!SBIS3.CORE.LoadingIndicator' ],
      function(DataViewAbstract, Dialog, LoadingIndicator) {

   var MAX_VALUE = 20000;  //Максимальное количество записей на операцию

/**
 * @class   $ws.proto.DataViewAbstract.PrintPlugin
 * @extends $ws.proto.DataViewAbstract
 * @plugin
 */
$ws.proto.DataViewAbstract.PrintPlugin = DataViewAbstract.extendPlugin(/** @lends $ws.proto.DataViewAbstract.PrintPlugin.prototype */{
   /**
    * @event onPrepareReportData При подготовке данных отчета
    * Происходит для печати записи и реестра перед преобразованием печатаемых данных в XML.
    * <wiTag class=TableView page=7>
    * @param {$ws.proto.EventObject} eventObject Дескриптор события.
    * @param {String} idReport Название отчёта, который собираемся печатать.
    * @param {$ws.proto.RecordSet} data Набор данных, которые собираемся печатать.
    * @returns Можно передать:
    * <ol>
    *    <li>False - отмена печати, механизм печати завершает работу;</li>
    *    <li>асинхронное событие - ждем его успешного завершения и считаем, что его результат ($ws.proto.Record|$ws.proto.RecordSet|Array) - те данные, которые нам нужно преобразовать в XML;</li>
    *    <li>$ws.proto.Record|$ws.proto.RecordSet|Array - считаем результатом события те данные, которые нам нужно преобразовать в XML;</li>
    *    <li>Любой другой результат - продолжаем печать стандартным образом.</li>
    * </ol>
    * @example
    * <pre>
    *    dataView.subscribe('onPrepareReportData', function(event, report, data){
    *       if(report == "Печать")
    *          event.setResult(this.getRecordSet().getRecords());
    *    });
    * </pre>
    */
    /**
     * @event onSelectReportTransform При выборе XSL-трансформации отчета
     * Происходит перед применением указанной в конфигурации табличного браузера xslt-трансформации для печатаемого отчета к сериализованным в XML данным.
     * <wiTag class=TableView page=7>
     * @param {$ws.proto.EventObject} eventObject Дескриптор события.
     * @param {String} idReport Название отчета, который собираемся печатать.
     * @param {Array} data Набор данных, которые собираемся печатать.
     * @param {String} transform Имя файла xslt-трансформации, которую собираемся применять.
     * @param {Boolean} forList Запущена ли печать отчёта записи или реестра.
     * @returns Можно вернуть:
     * <ol>
     *    <li>String - считаем результат события именем xslt-трансформации, которую необходимо применить;</li>
     *    <li>Любой другой результат - продолжаем печать стандартным образом.</li>
     * </ol>
     * @example
     * <pre>
     *    dataView.subscribe('onSelectReportTransform', function(event, report, data, transform){
     *       if(data.length > 1)
     *          event.setResult("xsl/myTransform.xsl");
     *    });
     * </pre>
     */
    /**
     * @event onBeforeShowPrintReports Перед построением списка отчетов для печати
     * Происходит перед тем, как на экран будет выведен список возможных для печати отчетов.
     * <wiTag class=TableView page=7>
     * @param {$ws.proto.EventObject} eventObject Дескриптор события.
     * @param {Array} reports Список названий отчетов, которые собираемся выводить.
     * @param {Array} data Набор данных, которые собираемся печатать.
     * @param {Boolean} forList.
     * @returns Можно вернуть:
     * <ol>
     *    <li>False - отмена печати, механизм печати завершает работу;</li>
     *    <li>String - считаем, что пришедшая строка - название единственного отчета, который нужно напечатать, запускается печать отчета с указанным именем;</li>
     *    <li>Array - считаем пришедший массив новым набором названий отчетов для печати;<>
     *    <li>Любой другой результат - запускаем печать стандартным образом.</li>
     * </ol>
     * @example
     * <pre>
     *    dataView.subscribe('onBeforeShowPrintReports', function(event, reports, data, forList){
    *       if(data.length > 1)
    *          event.setResult("Отчет для записи");
    *    });
     * </pre>
     */
    /**
     * @event onBeforeTransform Перед xslt-трансформацией
     * Происходит перед xslt-трансформацией отчета.
     *
     * @param {Object}   eventObject Дескриптор события, описание в классе $ws.proto.Abstract
     * @param {Document} xml         XML-документ
     * @param {Document} xsl         XSL-документ
     */
   $withoutCondition: [ 'init', 'setUseDefaultPrint' ],
   $protected: {
      _options: {
         /**
          * @cfg {String} printMode
          * <wiTag noShow>
          */
         printMode: '',
         /**
          * @cfg {Object} Список отчетов для печати записи
          * <wiTag class=TableView page=7>
          * Список названий отчетов и соответствующих им xslt-преобразований для одной или нескольких записей.
          * @example
          * <pre>
          *    "reports": {
          *    "Первый отчет для записи" : "Abonenty/xslt/default-record-transform-1.xsl",
          *    "Второй отчет для записи" : "xsl!SBIS3.NAMESPACE.Module/resources/xsl/reestr"
          *    }
          * </pre>
          * @noShow
          * @group Reports
          */
         reports: {},
         /**
          * @cfg {String} Метод БЛ, который будет выполняться для формирования списка при сохранении
          */
         savePrepareMethod: '',
         /**
          * @cfg {String} Списочный метод БЛ, который будет использоваться при сохранении в Excel
          */
         saveToExcelListMethod: '',
         /**
          * @cfg {Object} Список отчетов для печати реестра
          * <wiTag class=TableView page=7>
          * Список названий отчетов и соответствующих им xslt-преобразований для печати реестра записей.
          * @example
          * <pre>
          *    "reports": {
          *    "Первый отчет для реестра" : "Abonenty/xslt/default-list-transform-1.xsl",
          *    "Второй отчет для реестра" : "xsl!SBIS3.NAMESPACE.Module/resources/xsl/reestr"
          *    }
          * </pre>
          * @noShow
          * @group Reports
          */
         reportsForList: {}
      },
      _menuButtons: {
         'print' : ['Печать реестра (Ctrl+P)', 'sprite:icon-16 icon-Print icon-primary', 'print'],
         'printRecord' : ['Печать записи (F4)', 'sprite:icon-16 icon-Print icon-primary', 'printRecord']
      },
      _printMenu: null,                //Список отчетов для печати
      _needPrint: true,
      _reportPrinter: null,            //класс печати
      _useDefaultPrint: false,         // признак использования дефолтной печати
      _loadIndicator: undefined
   },
   $condition: function(){
      return this._useDefaultPrint || !Object.isEmpty(this._options.reports || {}) || !Object.isEmpty(this._options.reportsForList || {});
   },
   $constructor: function(){
      this._convertReportsPath(this._options.reports);
      this._convertReportsPath(this._options.reportsForList);
      requirejs(['Lib/xslt']);
      if (this._options.display.rowOptions) {
         delete this._menuButtons.printRecord;
      }
      this._publish('onPrepareReportData', 'onSelectReportTransform', 'onBeforeShowPrintReports', 'onBeforeTransform');
      this._reportPrinter = new $ws.proto.ReportPrinter({ columns: this._columnMap, titleColumn: this._options.display.titleColumn});
      this._keysWeHandle[$ws._const.key.f4] = true;
      this._keysWeHandle[$ws._const.key.p] = true;
      if (!Object.isEmpty(this._options.reports || {})) {
         this._notify('onNewAction', {
            title: 'Печать записи (F4)',
            icon: $ws._const.theme ? 'sprite:icon-16 icon-Print icon-primary' : 'print.png',
            name: 'printRecord',
            callback: 'printRecord',
            weight: 70
         });
      }
      $ws.single.CommandDispatcher.declareCommand(this, 'print', this.showReportsListForList);
      $ws.single.CommandDispatcher.declareCommand(this, 'printRecord', this.showReportsListForRecord);
   },
   _resolveReportPath: function(path) {
      var newPath,
         expansionAndPath = path.split('!');
      newPath = expansionAndPath[1] + '.' + expansionAndPath[0];
      return $ws.helpers.resolveComponentPath(newPath);
   },
   _convertReportsPath: function(reports) {
      if (!Object.isEmpty(reports || {})) {
         $ws.helpers.forEach(reports, function (value) {
            if ((/^.*!.*$/).test(value)) {
               value = this._resolveReportPath(value);
            }
         });
      }
   },
   _drawToolBar: function(){
      var self = this;
      this._toolbarReady.addCallback(function(toolbar){
         if(self.getReports(true).length !== 0 || (!self._options.display.rowOptions && self.getReports(false).length !== 0)){
            var onSubMenuActivated = function(){
               if (this.hasButton('menu')) {
                  this.getButton('menu').subscribe('onActivated', function(){
                     self._addSubMenuForToolbarElement('print', this.getId() + '_print', true);
                     if (!self._options.display.rowOptions) {
                        self._addSubMenuForToolbarElement('printRecord', this.getId() + '_printRecord', false);
                     }
                  });
               }
            };
            try{
               onSubMenuActivated.apply(toolbar, []);
            }catch(e){
               toolbar.subscribe('onAfterLoad', onSubMenuActivated);
            }
         }
         return toolbar;
      });
   },
   _initActionsFlags: function(){
      var self = this;
      this._actions = this._actions || {};
      this._actions.print = $.proxy(self._showReportsListForList, self);
      this._actions.printRecord = !Object.isEmpty(this._options.reports || {}) && function(row, isRowOptions, event){
         var record;
         if(row instanceof Object && 'jquery' in row){
            if(self._printMenu !== null && self._printMenu.isShow()){
               self._createPrintMenu([]);
            } else {
               record = self._currentRecordSet.getRecordByPrimaryKey(row.attr('rowkey'));
               self._showReportsListForRecord(record, row, event);
            }
         }
         else{
            self._showReportsListForRecord();
         }
      };
   },
   _createRowOptionsSubMenu: function(actionName, menuElement){
      if(actionName == 'printRecord'){
         var rowkey = this._rowOptionsHoverRow.attr('rowkey');
         if(!this._isIdEqual(rowkey, this._rootNode)){
            var record = this.getRecordSet().getRecordByPrimaryKey(rowkey),
                  subMenu = this._prepareReports(false, record);
            if(subMenu === false){
               this._needPrint = false;
            } else if(typeof(subMenu) == 'string'){
               this._needPrint = subMenu;
               subMenu = false;
            }
            if(subMenu){
               menuElement.subMenu = subMenu;
            }
         }
      }
   },
   _addSubMenuForToolbarElement: function(elementName, elementId, forList, menu, record){
      var toolbarMenu = menu ? menu : this._toolbar.getMenu();
      if (toolbarMenu.hasSubMenu(elementId)) {
         toolbarMenu.destroySubMenu(elementId);
      }
      if(toolbarMenu.isVisible()){
         var result = this._prepareReports(forList, forList ? false : ( record ? record : this.getActiveRecord() ), elementName);
         if(result && ( result.constructor === Array || typeof(result) == 'string')){
            toolbarMenu.showItem(elementName);
            if(result.constructor === Array){
               toolbarMenu.addSubMenu(elementName, result);
               this._needPrint = false;
            } else {
               this._needPrint = result;
            }
         } else {
            this._needPrint = false;
            if (!forList) {
               toolbarMenu.hideItem(elementName);
            }
         }
      }
   },
   _prepareReports: function(forList, record, elementName){
      var subMenu = null,
            data = !this.hasSelectedRecords() ? ( record ? record : this.getActiveRecord()) : this.getSelection(),
            reports = this._notify('onBeforeShowPrintReports', this.getReports(forList), data, forList),
            self = this;
      if(reports === false){
         subMenu = false;
      } else {
         var reportsList;
         if(reports instanceof Array){
            reportsList = reports;
         } else{
            reportsList = this.getReports(forList);
         }
         if(reportsList.length == 1){
            subMenu = reportsList[0];
         } else {
            subMenu = [];
            for(var j = 0, l = reportsList.length; j < l; j++ ){
               subMenu.push({
                  caption: reportsList[j],
                  id: self.getId() + '_' + elementName + reportsList[j],
                  handlers: {
                     onActivated: function(event, element){
                        self.printReport(element.caption, forList, self.getActiveRecord());
                     }
                  }
               });
            }
         }
      }
      return subMenu;
   },
   _keyboardHover: function(e, res){
      var needShowPrintMenu = true;
      if(this._printMenu !== null && this._printMenu.isShow()){
         this._createPrintMenu([]);
         needShowPrintMenu = e.which !== $ws._const.key.f4 && !(e.ctrlKey && e.which === $ws._const.key.p);
      }
      if(this.isActive() && !e.altKey && !e.shiftKey && ( !e.ctrlKey && e.which === $ws._const.key.f4 || (e.ctrlKey && e.which === $ws._const.key.p) )){
         if(needShowPrintMenu && (!Object.isEmpty(this._options.reports || {}) && e.which === $ws._const.key.f4 || e.which !== $ws._const.key.f4)){
            this._showReportsList(e, e.which !== $ws._const.key.f4);
            return false;
         }
      }
      return res;
   },
   /**
    * Вызывает построение списка отчетов для реестра
    * @param {$ws.proto.Record} [record] Запись
    * @param {Object} [row] Строка в DOM-дереве
    * @param [event]
    */
   _showReportsListForList: function(){
      if (this._needPrint === true) {
         this._showReportsList(this._createFakeEvent(), true);
      } else if(typeof(this._needPrint) == 'string') {
         this.printReport(this._needPrint, true, null);
      }
   },
   showReportsListForList: function(){
      this._showReportsListForList();
   },
   /**
    * Вызывает построение списка отчетов для записи
    * @param {$ws.proto.Record}  [record]   Запись
    * @param {Object}            [row]      Строка в DOM-дереве
    */
   _showReportsListForRecord: function(record, row, event){
      if (this._needPrint === true) {
         this._showReportsList(typeof(event) == 'object' ? event : this._createFakeEvent(), false, record, row);
      } else if(typeof(this._needPrint) == 'string') {
         this.printReport(this._needPrint, false, record);
      }
   },
   showReportsListForRecord: function(record, row, event){
      this._showReportsListForRecord(record, row, event);
   },
   /**
    * выводит если нужно список отчетов или отправляет отчет на печать
    * @param {Event} e событие
    * @param {Boolean} isReportsForList печатать отчеты для реестра или для записи
    * @param {$ws.proto.Record}  [record] Запись
    * @param {Object}            [row]    Строка из DOM-дерева
    */
   _showReportsList: function(e, isReportsForList, record, row){
      var data = null, self = this, reports;
      if (!isReportsForList) {
         data = record ? record : (!this.hasSelectedRecords() ? this.getActiveRecord() : this.getSelection());
      }
      reports = this._notify('onBeforeShowPrintReports', this.getReports(isReportsForList), data, isReportsForList);
      if(reports !== false){
         var reportsList;
         if(reports instanceof Array){
            reportsList = reports;
            if (reports.length == 1) {
               reports = reports[0];
            }
         } else{
            reportsList = typeof(reports) === 'string' ? [] : '';
         }
         this._createPrintMenu(reportsList, isReportsForList).addCallback(function(instance){
            if(self._printMenu === null){
               if(!reports || reports === true){ // если не можем рассматривать то, что вернули из события как список отчетов, ищем среди описанных
                  var list = self._options[isReportsForList ? 'reportsForList' : 'reports'];
                  for(var report in list){ // если здесь найдется элемент, то он один
                     if(list.hasOwnProperty(report)){
                        reports = report;
                     }
                  }
               }
               reports = reports === true ? undefined : reports;
               self.printReport(reports, isReportsForList);
            } else {
               var activeElement = row ? row : (self._activeElement ? self._activeElement : self._body.find('tr').eq(0)),
                   offset = {},
                   block,
                   point;

               if (self._options.display.rowOptions) {
                  block = self._rowOptionsButtons.printRecord;

                  if (!block || !block.is(':visible')) {
                     block = activeElement;
                  }
               } else {
                  block = activeElement;
               }

               point = block.offset();

               if (isReportsForList) {
                  offset.left = point.left + block.width() - self._printMenu.getMenuWidth();
               } else {
                  offset.left = point.left;
               }

               offset.top = point.top + block.height();

               try{
                  self._printMenu.show(offset);
               } catch(error){
                  self._printMenu.subscribe('onReady', function(){
                     self._printMenu.show(offset);
                  });
               }
            }
            return instance;
         });
      }
   },
   /**
    * <wiTag class=TableView page=7>
    * Возвращает массив названий отчетов, возможных для печати реестра или записи.
    * @param {Boolean} isReportsForList Возвращать названия отчётов для записи или для реестра.
    * @return {Array} Массив названий отчетов.
    * @example
    * <pre>
    *    dataView.getReports(false);
    * </pre>
    */
   getReports: function(isReportsForList){
      return Object.keys((isReportsForList ? this._options.reportsForList : this._options.reports) || {});
   },
   /**
    * Создает меню для выбора из списка отчетов, возможных для печати
    * @return {$ws.proto.Deferred}
    */
   _createPrintMenu:function(reportsList, isReportsForList){
      var self = this,
            reports = [],
            declaredReportsList;
      if(!reportsList || !(reportsList instanceof Array)){
         reportsList = [];
         declaredReportsList = isReportsForList ? this._options.reportsForList : this._options.reports;
         for(var i in declaredReportsList){
            if(declaredReportsList.hasOwnProperty(i)){
               reportsList.push(i);
            }
         }
      }
      for(var k = 0, l = reportsList.length; k < l; k++){
         reports[k] = {
            caption: reportsList[k],
            id: reportsList[k],
            handlers: {
               onActivated: function(id, elem){
                  self.printReport(elem.caption, isReportsForList);
               }
            }
         };
      }
      if(self._printMenu !== null){
         self._printMenu.destroy();
         self._printMenu = null;
      }
      if(reports.length > 1){
         return $ws.core.attachInstance('Control/Menu', {
            data: reports
         }).addCallback(function(instance){
                  self._printMenu = instance;
                  return instance;
               });
      } else {
         return new $ws.proto.Deferred().callback();
      }
   },
   _getCurrentTransform: function(idReport, isReportsForList){
      if(idReport === undefined){
         return 'default-list-transform.xsl';
      } else {
         return isReportsForList ? this._options.reportsForList[idReport] : this._options.reports[idReport];
      }
   },
   _getPreparedData: function (data, doPreparation, allowShowDialog, printCurPage, noIndicator) {
      var defResult = new $ws.proto.Deferred(),
          self = this;
      if (doPreparation) {
         this._prepareReportDataForList(allowShowDialog, printCurPage, noIndicator).addCallback(function (dataForList) {
            var needRS;
            if (dataForList instanceof $ws.proto.Record) {
               dataForList = [dataForList];
               needRS = true;
            } else if (dataForList instanceof Array) {
               needRS = true;
            }
            if (needRS) {
               dataForList = self._transformToRS(dataForList);
            }
            if (dataForList instanceof $ws.proto.RecordSet) {
               defResult.callback(dataForList);
            }
         }).addErrback(function(error){
               $ws.core.setCursor(true);
               $ws.helpers.alert(error, { checkAlreadyProcessed: true }, self);
            });
      } else {
         if (!noIndicator) {
            this._createLoadIndicator('Печать записей...');
         }
         defResult.callback(data);
      }
      return defResult;
   },
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
   /**
    * <wiTag class=TableView page=7>
    * Сохранить реестр или отмеченные записи в pdf.
    * Запускает сохранение указанного отчета из списка отчетов реестра или отчетов записи.
    * @param {String}   idReport         Название сохраняемого отчета
    * @param {Boolean}  isReportForList  Признак того, что сохраняем отчет для записи или для реестра
    */
   saveToPDF: function(idReport, isReportForList) {
      this._saveTo(idReport, isReportForList, 'PDF');
   },
   /**
    * <wiTag class=TableView page=7>
    * Сохранить реестр или отмеченные записи в excel.
    * Запускает сохранение указанного отчета из списка отчетов реестра или отчетов записи.
    * @param {String}   idReport         Название сохраняемого отчета
    * @param {Boolean}  isReportForList  Признак того, что сохраняем отчет для записи или для реестра
    */
   saveToExcel: function(idReport, isReportForList) {
      this._saveTo(idReport, isReportForList, 'EXCEL');
   },
   /**
    * <wiTag class=TableView page=7>
    * Сохранить выбранные колонки реестра или отмеченных записей в excel.
    * Запускает сохранение выбранных колонок по дефолтному отчету реестра.
    */
   saveColumnsToExcel: function() {
      var selected = this.getSelection(true),
          records = selected.length ? selected : this.getRecordSet().getRecords();

      this._createSaveColumnsDialog(records);
   },
   _prepareHTMLForColumns: function() {
      var html = '<table class="ws-select-columns-table">',
          render = function(column) {
             return [
                       '<tr class="ws-selected-columns-tr ws-select-columns-tr-checked" field="', column.field, '">',
                          '<td>', column.title || column.field, '</td>',
                          '<td class="ws-selected-columns-right">',
                             '<span class="ws-select-columns-checkbox ws-select-columns-checked"></span>',
                          '</td>',
                       '</tr>'
                    ].join('');
          };

      $ws.helpers.forEach(this.getFields(true), function(v) {
         html += render(v);
      });

      html += '</table>';

      return html;
   },
   _createSaveColumnsDialog: function(records) {
      var self = this;

      new Dialog({
         template: 'selectColumnsDialog',
         resizable: false,
         handlers: {
            'onAfterLoad': function() {

               this.getChildControlByName('ws-operations-panel-select-columns').setContent(self._prepareHTMLForColumns());

               this.getChildControlByName('okButton').subscribe('onClick', function() {
                  var columns = [],
                      tr = $.makeArray(this.getParent()._container.find('.ws-select-columns-tr-checked')),
                      options;

                  for (var i = 0, l = tr.length; i < l; i++) {
                     columns.push($(tr[i]).attr('field'));
                  }

                  options = {
                     fileType: 'EXCEL',
                     columns: columns
                  };

                  self._saveToFile(options, undefined, undefined, records);
               });

               this._container.find('.ws-select-columns-checkbox').bind('click', function() {

                  var checkbox = $(this),
                      tr = checkbox.closest('tr'),
                      className = 'ws-select-columns-checked',
                      trClass = 'ws-select-columns-tr-checked';

                  if (checkbox.hasClass(className)) {
                     checkbox.removeClass(className);
                     tr.removeClass(trClass);
                  } else {
                     checkbox.addClass(className);
                     tr.addClass(trClass);
                  }
               });
            },
            'onAfterShow' : function() {
               this.moveWindowToCenter();
            }
         }
      });
   },

   _saveToFile: function(options, idReport, data, isReportsForList) {
      var readerParams = this.getDataSource().readerParams,
          listMethod = readerParams ? readerParams.queryName : 'Список',
          isSaveColumns = options.columns && options.columns.length > 0,
          fileName = idReport ? idReport : (isSaveColumns ? 'Выбранные столбцы' : 'Как на экране'),
          xsl = idReport ? this._getCurrentTransform(idReport, isReportsForList) : 'default-list-transform.xsl',
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
          params;

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
         this._notify('onBeforeTransform', xmlDoc, xslDoc);
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
   },
   _checkSaveIndicator: function(object, methodName, params, fileType){
      var self = this,
          saveToFile = function () {
            $ws.helpers.saveToFile(object, methodName, params).addCallback(function(){
               self._destroyLoadIndicator();
            });
          };
      if ($ws.single.ControlStorage.containsByName('ws-load-indicator')) {
         saveToFile();
      } else {
         this._createLoadIndicator('Подождите, идет выгрузка данных в ' + fileType);
         saveToFile();
      }
   },
   _prepareDataToSave: function(fileType, idReport, isReportsForList, records) {
      var selectedRecords = this.getSelection(true),
          data = records ? records : (selectedRecords.length ? selectedRecords : this.getRecordSet().getRecords()),
          self = this,
          options;

      options = {
         fileType: fileType
      };

      this._createLoadIndicator('Подождите, идет выгрузка данных в ' + fileType);

      if (!idReport) {
         self._saveToFile(options, idReport, data, isReportsForList);
      } else {

         this._getPreparedData(data, false, false, undefined, true).addCallback(function (preparedData) {

            data = preparedData;

            var processData = function(eventResult) {
               if (eventResult instanceof $ws.proto.Record) {
                  eventResult = [eventResult];
               }
               if (eventResult instanceof $ws.proto.RecordSet) {
                  eventResult = eventResult.getRecords();
               }
               if (eventResult instanceof Array) {
                  data = eventResult;
               }
               self._saveToFile(options, idReport, data, isReportsForList);
            };

            self._onPrepareReportDataHandler(processData, idReport, data);
         });

      }
   },
   _validateRecordCount: function(title){

      var def = new $ws.proto.Deferred(),
          rs = this.getRecordSet(),
          records = rs.getRecords(),
          selected = this.getSelection(true);

      if (selected.length > 0) {
         def.callback(selected);
      } else {
         if (this.getPagingMode() && rs.getRecordCount() >= rs.getPageSize()) {

            this._selectPrintPages(title).addCallback(function(res){

               if (typeof res === 'number') {

                  if (records.length > res) {
                     records = records.slice(0, res);
                  }

                  def.callback(records);

               } else {

                  res.handlers.onAfterLoad = function() {
                     def.callback(this.getRecords());
                  };

                  new $ws.proto.RecordSet(res);

               }

            });

         } else {
            def.callback(records);
         }
      }

      return def;
   },
   _serializeRecords: function (records) {
      var selection = {
             s: [],
             d: []
          },
          json,
          l;
      if (records && (l = records.length) > 0) {
         for (var i = 0; i < l; i++) {
            if (records[i] instanceof $ws.proto.Record) {
               if (i === 0) {
                  json = records[i].toJSON();
                  selection.s = json.s;
                  selection.d.push(json.d);
               } else {
                  selection.d.push(records[i].getDataRow());
               }
            }
         }
      }
      return selection;
   },
   /**
    * <wiTag class=TableView page=7>
    * Отправляет на печать выбранные записи.
    * Запускает печать указанного отчета из списка отчетов реестра или отчетов записи.
    * При печати записи может напечатать переданные данные, иначе будут выведены на печать отмеченные в данный момент записи.
    * @param {String}   idReport                      Название печатаемого отчета
    * @param {Boolean}  isReportsForList              Признак того, что печатаем отчет для записи или для реестра
    * @param {Array}    [data]                        Данные для печати
    * @param {Boolean}  [printCurPage]                Печатаем текущую страницу
    */
   printReport: function (idReport, isReportsForList, data, printCurPage) {
      var printData = data ? data : (isReportsForList ? this.getRecordSet() : this.getSelection()),
          transform = this._getCurrentTransform(idReport, isReportsForList),
          selectedRecords = this.getSelection(true),
          isHierarchy = this.isHierarchy(),
          doPreparation = false,
          self = this;

      $ws.core.setCursor(false);

      if (self._options.printMode === 'newWindow') {
         self._openPrintWindow(idReport, isReportsForList, transform, self.isHierarchyMode() ? self._currentRootId : undefined, printCurPage);
      } else {
         if (selectedRecords.length === 0) {
            doPreparation = !!((!isHierarchy || (isHierarchy && this._turn === '')) && !this.isTree() && this.getPagingMode());
         } else {
            printData = selectedRecords;
         }

         this._getPreparedData(printData, doPreparation, true, printCurPage).addCallback(function (preparedData) {
            printData = preparedData;
            var processData = function (eventResult) {
               if (eventResult instanceof $ws.proto.Record || eventResult instanceof $ws.proto.RecordSet || eventResult instanceof Array) {
                  printData = eventResult;
               }
               self._showReport(idReport, self._transformToRS(printData), transform, isReportsForList);
            };
            self._onPrepareReportDataHandler(processData, idReport, printData);
         });
      }
   },
   _onPrepareReportDataHandler: function (callback, idReport, data) {
      var eventResult = this._notify('onPrepareReportData', idReport, this._transformToRS(data));
      if (eventResult !== false) {
         if (eventResult instanceof $ws.proto.Deferred) {
            eventResult.addCallback(callback);
         } else {
            callback.apply(this, [eventResult]);
         }
      } else {
         $ws.core.setCursor(true);
      }
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
   },
   _transformToRS: function (object) {
      var data, l;
      if (object instanceof Array && (l = object.length) > 0) {
         var firstRecord = object[0],
             rs = firstRecord.getRecordSet();
         //получим колонки либо от рекордсета первой записи, либо сериализовав ее в json
         data = {
            s: rs ? Array.clone(rs.getColumnsForSerialize()) : firstRecord.toJSON().s,
            d: []
         };
         for (var i = 0; i < l; i++) {
            data.d.push(Array.clone(object[i].getDataRow()));
         }
         object = new $ws.proto.RecordSet({
            readerType: 'ReaderSBIS',
            readerParams: {
               pkColumnName: firstRecord.getKeyField(),
               adapterType : 'TransportAdapterStatic',
               adapterParams: {
                  data: data
               }
            },
            hierarchyField: (rs ? rs : this._currentRecordSet).getHierarchyField()
         });
      }
      return object;
   },
   _getTransform: function(idReport, object, xsl, isReportsForList, fileType) {
      var transform,
          res;

      fileType = fileType ? fileType.toLowerCase() : undefined;

      if (typeof idReport === 'undefined') {
         transform = $ws._const.wsRoot + 'res/xsl/' + xsl;
      } else {
         res = this._notify('onSelectReportTransform', idReport, object, xsl, isReportsForList, fileType);
         if (typeof res === 'string') {
            xsl = res;
         }

         transform = $ws._const.resourceRoot + xsl;
      }

      return transform;
   },
   /**
    * Сериализует данные, применяет xslt-транформацию и выводит полученный результат
    * @param {string} idReport название печатаемого отчета
    * @param {$ws.proto.Record | $ws.proto.RecordSet} object данные для печати
    * @param {String} transform файл xslt-трансформации
    */
   _showReport:function(idReport, object, xsl, isReportsForList){
      xsl = this._getTransform(idReport, object, xsl, isReportsForList);
      var rp = this._reportPrinter,
          rootNode = this.isHierarchyMode() ? this._currentRootId : undefined,
          xslDoc = new $ws.proto.XMLDocument({ name: xsl }).getDocument(),
          xmlDoc = $ws.single.RecordSetToXMLSerializer.serialize(object, rp.getColumns(), rp.getTitleColumn(), rootNode),
          self = this;
      this._useKeyboard = true;
      this._notify('onBeforeTransform', xmlDoc, xslDoc);
      rp.prepareReport(object, xslDoc, rootNode, xmlDoc).addCallback(function(reportText){
         $ws.helpers.showHTMLForPrint(reportText, undefined, undefined, self).addCallback(function(printDialog){
            self._destroyLoadIndicator();
            printDialog.subscribe('onAfterClose', $.proxy(self._mouseMonitor, self));
            self.removeSelection();
         });
      }).addErrback(function(error){
         $ws.helpers.alert(error, { checkAlreadyProcessed: true }, self);
      }).addBoth(function(){
         $ws.core.setCursor(true);
      });
   },
   destroy: function(){
      this._reportPrinter = null;
      this._loadIndicator = undefined;
   },
   /**
    * Запрашивает данные, необходимые для построения печати реестра записей
    * @param {Boolean} allowShowDialog показывать ли диалог с выбором страницы для печати
    * @param {Boolean} printCurPage печатать текущую страницу
    * @param {Boolean} noIndicator показывать индикатор процесса
    * @return {$ws.proto.Deferred} Асинхронный результат получения данных для отчета реестра записей
    */
   _prepareReportDataForList: function(allowShowDialog, printCurPage, noIndicator){
      if (allowShowDialog === undefined) {
         allowShowDialog = true;
      }
      var dResult = new $ws.proto.Deferred(),
          isHierarchy = this.isHierarchy(),
          self = this;
      if(allowShowDialog && (!isHierarchy || (isHierarchy && this._turn === '')) && this._paging){
         self._selectPrintPages().addCallback(function(res){
            if (!noIndicator) {
               self._createLoadIndicator('Печать записей...');
            }
            if(typeof res !== 'number'){
               self._getData(res, dResult);
               $ws.core.setCursor(false);
            }else{
               var rs = self.getRecordSet(),
                     records = [],
                     keys;
               if (isHierarchy && !self._currentRootId) {
                  keys = rs.recordChilds(null);
                  for (var i = 0; i < res; i++) {
                     records.push(rs.getRecordByPrimaryKey(keys[i]));
                  }
               } else {
                  records = rs.getRecords().slice(0, res);
               }
               dResult.callback(records);
            }
            return res;
         }).addErrback(function(){
            $ws.core.setCursor(true);
         });
      }else {
         self._getData(self._pickDataSource(printCurPage), dResult);
      }
      return dResult;
   },
   prepareReportDataForList: function(allowShowDialog){
      return this._prepareReportDataForList(allowShowDialog);
   },
   /**
    * Отображает окно с выбором страницы для печати реестра
    * @param {String} title Заголовок окна
    * @return {$ws.proto.Deferred} Асинхронный результат получения данных
    * @private
    */
   _selectPrintPages: function(title){
      var defResult = new $ws.proto.Deferred(),
          ctx = new $ws.proto.Context().setPrevious(this.getLinkedContext()),
          rs = this._currentRecordSet,
          currentRecordsCount = rs.getRecords().length,
          isHierarchy = this.isHierarchy(),
          self = this,
          currentValue;
      title = title || 'Что напечатать';
      ctx.setValue('recordsCount', currentRecordsCount);
      if (isHierarchy && !this._currentRootId) {
         currentRecordsCount = rs.recordChilds(null).length;
      }
      new Dialog({
         template: 'validateCountDialog',
         caption: title,
         resizable: false,
         context: ctx,
         opener: this,
         handlers: {
            'onAfterLoad': function(){
               var fieldInteger = this.getChildControlByName('recordsCount'),
                   radioButtons = this.getChildControlByName('radioButtons'),
                   dialog = this;
               currentValue = radioButtons.getStringValue();
               this.getChildControlByName('okButton').subscribe('onActivated', function(){
                  if(dialog.validate()){
                     var pageNumber = self.getRecordSet().getPageNumber(),
                         value = fieldInteger.getValue();
                     if(value > currentRecordsCount){
                        $ws.helpers.question('Операция займет продолжительное время. Провести операцию?', {}, self).addCallback(function(answer){
                           if (answer) {
                              defResult.callback(self._getOperationSource(value, currentValue, pageNumber));
                           } else {
                              defResult.errback();
                           }
                        });
                     } else if (isHierarchy && self._currentRootId) {
                        defResult.callback(self._getOperationSource(value, currentValue, pageNumber));
                     } else if (value) {
                        defResult.callback(value);
                     } else {
                        defResult.errback();
                     }
                     dialog.close();
                  }
               });
               this.getChildControlByName('windowTitleClose').subscribe('onActivated', function(){
                  defResult.errback(new Error('cancelled'));
               });
               radioButtons.subscribe('onChange', function(e, item){
                  var itemName = item.toString();
                  if(itemName !== 'countRecords' && fieldInteger.isVisible()) {
                     fieldInteger.hide();
                  }
                  switch(item.toString()){
                     case 'countRecords':
                        fieldInteger.setValue(currentRecordsCount);
                        fieldInteger.show();
                        break;
                     case 'allRecords':
                        fieldInteger.setValue(MAX_VALUE);
                        break;
                     case 'currentPage':
                        fieldInteger.setValue(currentRecordsCount);
                  }
                  currentValue = this.getStringValue();
               });
               $ws.core.setCursor(true);
            },
            'onAfterShow' : function(){
               this.moveWindowToCenter();
            }
         }
      });
      return defResult;
   },
   _getOperationSource: function (rowsPerPage, amount, pageNumber) {
      var dataSourceCopy = $ws.core.merge({}, this.getDataSource());
      dataSourceCopy.filterParams = this.getQuery();
      //Нам нужно запускать загрузку всегда для своего рекордсета
      dataSourceCopy.firstRequest = true;
      dataSourceCopy.filterParams.pageNum = (amount === 'allRecords' || amount === 'countRecords') && pageNumber > 0 ? 0 : pageNumber;
      dataSourceCopy.pageNum = dataSourceCopy.filterParams.pageNum;
      dataSourceCopy.filterParams.usePages = 'parts';
      dataSourceCopy.usePages = 'parts';
      dataSourceCopy.rowsPerPage = rowsPerPage;
      return dataSourceCopy;
   },
   _pickDataSource: function(printCurPage){
      //сделаем копию dataSource, чтобы в исходном ничего не затереть случайно
      var dtSource = $ws.core.clone(this._options.dataSource);
      dtSource.filterParams = this.getQuery();
      if(printCurPage){
         dtSource.filterParams.pageNum = this._currentRecordSet.getPageNumber();
      } else {
         dtSource.filterParams.pageNum = '';
         dtSource.filterParams.usePages = '';
      }
      if(this.isTree()){ // для дерева будем печатать все открытые ветки
         dtSource.filterParams[this._hierColumnParentId] = this.getOpenFolders();
      }
      if (!printCurPage) {
         dtSource.usePages = '';
      }
      dtSource.firstRequest = true;
      return dtSource;
   },
   _getData: function(dataSource, def){
      var self = this;
      return $ws.core.attachInstance('Source:RecordSet', $ws.core.merge(dataSource, { firstRequest : true })).addCallback(function(rs){
         rs.subscribe('onAfterLoad', function(){
            def.callback(rs);
         });
      }).addErrback(function(error){
         $ws.core.setCursor(true);
         $ws.helpers.alert(error, { checkAlreadyProcessed: true }, self);
      });
   },
   /**
    * Открывает новую вкладку браузера, в которой будет отображаться предварительный просмотр печати реестра/записи
    * @param {String} idReport название печатаемого отчета
    * @param {Boolean} isReportsForList признак того, что печатаем отчет для реестра
    * @param {String} transform файл xslt-трансформации
    * @param {String} currentRootId текущий корневой узел
    * @param {Boolean} [url] адрес по которому будет отображаться предварительный просмотр печати реестра/записи
    */
   _openPrintWindow: function(idReport, isReportsForList, transform, currentRootId, url, printCurPage){
      var self = this,
            params = {
               id : this.getId(),
               _events : {}
            },
            columnMap = [];
      if (idReport !== undefined) {
         params.idR = idReport;
      }
      if (isReportsForList !== undefined) {
         params.list = isReportsForList;
      }
      if (transform !== undefined) {
         params.xsl = transform;
      }
      if (currentRootId !== undefined) {
         params.root = currentRootId;
      }
      if(!(Object.isEmpty(this._options.reports || {}))){
         params.reports = this._options.reports;
         params._events.onBeforeShowPrintReports = this._handlersPath('onBeforeShowPrintReports');
         params._events.onPrepareReportData = this._handlersPath('onPrepareReportData');
         params._events.onSelectReportTransform = this._handlersPath('onSelectReportTransform');
      }
      if(self._columnMap !== undefined){
         for(var i = 0, l = self._columnMap.length; i < l; i++){
            columnMap.push({
               title : self._columnMap[i].title,
               field : self._columnMap[i].field
            });
         }
         params.cols = columnMap;
      }
      if (self._options.titleColumn !== undefined) {
         params.tCol = self._options.titleColumn;
      }
      $ws.core.setCursor(true);
      if(!idReport){
         if(self._paging && self._turn === ''){
            self._selectPrintPages().addCallback(function(res){
               if(typeof res !== 'undefined'){
                  var data = res;
                  if (typeof res === 'number') {
                     data = self._currentRecordSet.getRecords().slice(0, res);
                  }
                  params.dS = self._prepareRecordSetForPrint(data);
               }
               self._transmitParamsForPrintWindow(params, url);
               return res;
            });
         }else{
            params.dS = this._prepareRecordSetForPrint(self._pickDataSource(printCurPage));
            self._transmitParamsForPrintWindow(params, url);
         }
      }else{
         var dataSource = self._getDataSource(),
               activeRecords;
         if (dataSource) {
            params.dS = this._prepareRecordSetForPrint(dataSource);
         }
         activeRecords = self.getSelection();
         params.keys = [];
         for (var j = 0, len = activeRecords.length; j < len; j++) {
            params.keys.push(activeRecords[j].getKey());
         }
         self._transmitParamsForPrintWindow(params, url);
      }
   },
   _prepareRecordSetForPrint: function(recordSetConfig){
      var data = $ws.core.merge({}, recordSetConfig);
      delete data.handlers;
      delete data.context;
      if (data.readerType == 'ReaderUnifiedSBIS') {
         delete data.readerType;
      }
      if (data.firstRequest === true) {
         delete data.firstRequest;
      }
      if (!this.isHierarchyMode()) {
         delete data.hierarchyField;
      }
      if (this._options.display.usePaging === '') {
         delete data.rowsPerPage;
         delete data.usePages;
      }
      if (data.readerParams.dbScheme === '') {
         delete data.readerParams.dbScheme;
      }
      if (data.readerParams.queryName === 'Список') {
         delete data.readerParams.queryName;
      }
      if (data.readerParams.readMethodName === 'Прочитать') {
         delete data.readerParams.readMethodName;
      }
      if (data.readerParams.createMethodName === 'Создать') {
         delete data.readerParams.createMethodName;
      }
      if (data.readerParams.updateMethodName === 'Записать') {
         delete data.readerParams.updateMethodName;
      }
      if (data.readerParams.destroyMethodName === 'Удалить') {
         delete data.readerParams.destroyMethodName;
      }
      return data;
   },
   _transmitParamsForPrintWindow :function(params, url){
      var printTemplate = 'printWindow',
            pageURL = url ? url : $ws._const.appRoot + printTemplate + '.html',
            printWindow;
      pageURL += '?printParams=' + encodeURIComponent($ws.helpers.serializeURLData(params));
      printWindow = window.open(pageURL, '_blank');
      if (printWindow) {
         printWindow.focus();
      }
   },
   /**
    * Собирает параметры получения данных для передачи в $ws.proto.RecordSet
    * @return {Object} Объект с данными
    */
   _getDataSource: function(){
      var dataSource = this._options.dataSource;
      dataSource.filterParams = this.getQuery();
      dataSource.filterParams.pageNum = '';
      dataSource.filterParams.usePages = '';
      dataSource.usePages = '';
      dataSource.firstRequest = true;
      if(!Object.isEmpty(this._expanded)){
         var parents = [];
         for(var i in this._expanded){
            if (this._expanded.hasOwnProperty(i)) {
               parents.push(i);
            }
         }
         if (this._rootNode && !this._expanded[this._rootNode]) {
            parents.push(this._rootNode);
         }
         dataSource.filterParams[this._hierColumnParentId] = parents;
      }
      return dataSource;
   },
   _createFakeEvent: function() {
      var event;
      if( document.createEvent ) {
         event = document.createEvent('HTMLEvents');
      } else if( document.createEventObject ) {
         event = document.createEventObject();
      }
      return event;
   },
   setUseDefaultPrint: function(){
      this._useDefaultPrint = true;
   }
});

});