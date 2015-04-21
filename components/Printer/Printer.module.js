/**
 * Created by ad.chistyakova on 14.04.2015.
 */
define('js!SBIS3.CONTROLS.Printer', [  'js!SBIS3.CORE.LoadingIndicator', 'js!SBIS3.CORE.Dialog',
   'is!browser?js!' + $ws._const.wsRoot + 'Lib/xslt.js'
], function(LoadingIndicator, Dialog) {

   return $ws.core.extend({}, {

      $protected: {
         _options: {
            dataSet: undefined,
            report: undefined,
            xsl : 'default-list-transform.xsl', //что делать с item  ?
            columns: []
         },
         _reportPrinter : null,
         _loadIndicator: undefined
      },

      $constructor: function() {
         this._reportPrinter = new $ws.proto.ReportPrinter({
            columns: this._options.columns //this._options.dataSet.getColumns(),
            //titleColumn: this._options.display.titleColumn //view._dataSet jпозже будет определяется из датасет (нужно для иерархических данных)
            });
         //TODO возможно кнопка печати может стать кнопкой меню, в зависимости от набора отчетов на печать
      },
      print: function () {
         this._createLoadIndicator('Печать записей...');
         this.showReport(this._options.xsl);
      },
      showReport: function(xsl){
         xsl =   this._getTransform(this._options.report, this._options.dataSet, xsl);
         var
               self = this,
               object = this._options.dataSet,
               rp = this._reportPrinter,
               xslDoc = new $ws.proto.XMLDocument({ name: xsl }).getDocument(),
               xmlDoc = $ws.single.DataSetToXMLSerializer.serialize(object, rp.getColumns(), rp.getTitleColumn(), undefined/*rootNode*/);
         rp.prepareReport(this._options.dataSet, xslDoc, undefined /*rootNode*/, xmlDoc).addCallback(function(reportText){
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
         }).addErrback(function(error){
            $ws.helpers.alert(error, { checkAlreadyProcessed: true }, self);
         }).addBoth(function(){
            $ws.core.setCursor(true);
         });
      },
      _getCurrentTransform: function(idReport, isReportsForList){
         return idReport ?
               (isReportsForList ? this._options.reportsForList[idReport] : this._options.reports[idReport]) :
               'default-list-transform.xsl';
      },
      _getTransform: function(idReport, object, xsl) {
         return ( typeof idReport === 'undefined' ?  $ws._const.wsRoot + 'res/xsl/' :  $ws._const.resourceRoot ) + xsl;
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

/**
 * Сериализатор выборки-СБИС.
 * Сериализует выборку-СБИС или Запись в XML.
 * @see http://inside.sbis.ru/doc/_layouts/DocIdRedir.aspx?ID=SBIS-5-946
 *
 * @class $ws.single.DataSetToXMLSerializer
 * @public
 * @singleton
 */
$ws.single.DataSetToXMLSerializer = /** @lends $ws.single.DataSetToXMLSerializer.prototype */{
   _complexFields: {
      "Связь" : true,
      "Иерархия" : true,
      "Перечисляемое" : true,
      "Флаги" : true,
      "Массив" : true,
      "Запись" : true,
      "Выборка" : true
   },
   _colNameToTag: {
      "Число целое" : "ЧислоЦелое",
      "Число вещественное" : "ЧислоВещественное",
      "Дата и время" : "ДатаИВремя"
   },
   _branchTypes: {
      "true": "Узел",
      "false": "Лист",
      "null": "СкрытыйУзел"
   },
   /**
    * Сериализует контейнер в XML-документ
    * @param {$ws.proto.Record | $ws.proto.RecordSet | Array} records набор сериализуемых записей
    * @return {Document}  результат сериализации
    */
   serialize: function(dataSet, columns, titleColumn, rootNode){
      var doc = this._createXMLDocument();
      this._serializeObject(dataSet, doc, doc, columns);
      this._serializeColumns(columns, dataSet, doc, titleColumn, rootNode);
      return doc;
   },
   _serializeColumns : function(columns, object, doc, titleColumn, rootNode){
      var cols, column;
      if(columns && columns instanceof Array && columns.length > 0) {
         doc.documentElement.appendChild(cols = doc.createElement('Колонки'));
         for(var i = 0, l = columns.length; i < l; i++){
            cols.appendChild(column = doc.createElement('Колонка'));
            column.setAttribute('Имя', columns[i].title);
            column.setAttribute('Поле', columns[i].field);
         }
      }
      //TODO здесь будет настройка для иерархии
   },
   _serializeObject: function(object, parentElement, document, columns){
      var dataRow,
            recordElement,
            pkColumnName;
      if ($ws.helpers.instanceOfModule( object , 'SBIS3.CONTROLS.DataSet')){
         var self = this;
         parentElement.appendChild(currentElement = document.createElement('Выборка'));
         object.each(function(record){
            self._serializeObject(record, currentElement, document, columns);
         });

      }
      else if (object && object.getRaw()){
         var raw = object.getRaw(),
               key = object.getKey();
         pkColumnName = object._keyField;
         parentElement.appendChild(recordElement = document.createElement('Запись'));

         recordElement.setAttribute('КлючЗаписи', key);
         recordElement.setAttribute('ПолеКлюча', pkColumnName);
         for(var k = 0, cnt = columns.length; k < cnt; k++) {
            this._serializeField(columns[k], object, recordElement, document);
         }
      }
   },
   _serializeField: function(column, record, recordElement, document){
      var fieldElement,
            tagName,
            element;
      recordElement.appendChild(fieldElement = document.createElement('Поле'));
      fieldElement.setAttribute('Имя', column.field);
      var fieldValue = record.get(column.field) === null ? "" : record.get(column.field);
      column.type = record.getRaw ?  record.getType(column.field) : column.type || 'Текст';
      var typeName =  typeof(column.type) == 'object' ? column.type.n : column.type;
      if(!this._complexFields[typeName] && !column.s && !this._complexFields[column.s]){
         tagName = this._colNameToTag[column.type] ? this._colNameToTag[column.type] : column.type;
         element = document.createElement(tagName);
         if(fieldValue instanceof Date){
            if(column.type == "Дата и время")
               fieldValue = fieldValue.toSQL() + "T" + fieldValue.toTimeString().replace(" GMT", "").replace(/\s[\w\W]*/, "");
            if(column.type == "Дата")
               fieldValue = fieldValue.toSQL();
            if(column.type == "Время")
               fieldValue = fieldValue.toTimeString().replace(" GMT", "").replace(/\s[\w\W]*/, "");
         }
         fieldValue = $ws.helpers.removeInvalidXMLChars(fieldValue + "");
         element.appendChild(document.createTextNode(fieldValue));
         fieldElement.appendChild(element);
      } else if(typeName == 'Связь'){
         element = document.createElement('Связь');
         element.setAttribute('Таблица', typeof(column.type) == 'object' ? column.type.t : column.table);
         element.appendChild(document.createTextNode(fieldValue));
         fieldElement.appendChild(element);
      } else if(typeName == 'Иерархия' || (column.s && column.s == 'Иерархия')){
         fieldElement.appendChild(element = document.createElement('Иерархия'));
         var pID, flBranch;
         element.appendChild(pID = document.createElement('Родитель'));
         element.appendChild(flBranch = document.createElement('ТипУзла'));
         if(typeof(column.type) == 'object'){
            element.setAttribute('ИмяИерархии', column.type.f + "");
            pID.appendChild(document.createTextNode(fieldValue[1] + ""));
            flBranch.appendChild(document.createTextNode(this._branchTypes[fieldValue[0] + ""]));
         } else {
            if(typeName == "Идентификатор"){
               element.setAttribute('ИмяИерархии', column.titleColumn + "");
               pID.appendChild(document.createTextNode(fieldValue + ""));
               fieldValue = this._branchTypes[record.get(column.title + "@") + ""];
               flBranch.appendChild(document.createTextNode(fieldValue));
            } else {
               recordElement.removeChild(fieldElement);
            }
         }
      } else if(typeName == 'Перечисляемое'){
         fieldElement.appendChild(element = document.createElement('Перечисляемое'));
         var option;
         fieldValue = fieldValue.toObject();
         for(var key in fieldValue.availableValues){
            if(fieldValue.availableValues.hasOwnProperty(key)) {
               element.appendChild(option = document.createElement('Вариант'));
               option.setAttribute('Значение', key);
               var value = fieldValue.availableValues[key];
               if(value === null){
                  value = '';
               }
               option.setAttribute('Название', value);
               if(key == fieldValue.currentValue)
                  option.setAttribute('Выбран', 'true');
            }
         }
      } else if(typeName == 'Флаги'){
         fieldElement.appendChild(element = document.createElement('Флаги'));
         var flag;
         fieldValue = fieldValue.toObject();
         for(var number in fieldValue){
            if(fieldValue.hasOwnProperty(number)) {
               element.appendChild(flag = document.createElement('Флаг'));
               flag.setAttribute('Название', number);
               flag.setAttribute('Состояние', fieldValue[number] + "");
            }
         }
      } else if(typeName == 'Массив'){
         fieldElement.appendChild(element = document.createElement('Массив'));
         element.setAttribute('ТипДанных', typeof(column.type) == 'object' ? column.type.t : column.arrayType);
         var elem;
         for(var i = 0, l = fieldValue.length; i < l; i++){
            element.appendChild(elem = document.createElement('Значение'));
            //для элементов массива всегда добавляем их значение как текст, ведь там может быть null
            elem.appendChild(document.createTextNode(fieldValue[i] + ''));
         }
      } else if(fieldValue instanceof $ws.proto.RecordSet || fieldValue instanceof $ws.proto.Record){
         this._serializeObject(fieldValue, fieldElement, document);
      }
   },
   _createXMLDocument: function(){
      var doc;
      // нормальные браузеры
      if (document.implementation && document.implementation.createDocument)
         doc = document.implementation.createDocument("", "", null);
      // IE
      if($ws.helpers.axo) {
         doc = $ws.helpers.axo('Microsoft.XmlDom');
      }
      return doc;
   }
};