/**
 * Created by ad.chistyakova on 22.04.2015.
 */
define('js!SBIS3.CONTROLS.Utils.DataSetToXMLSerializer', [
   "Core/core-structure",
   "Core/xslt-async",
   "Transport/ReportPrinter",
   "Core/helpers/helpers",
   "Core/core-extend",
   "Core/constants",
   "Core/IoC",
   "Core/ConsoleLogger",
   "Core/core-instance",
   "Core/helpers/fast-control-helpers",
   "Core/helpers/string-helpers",
   "i18n!SBIS3.CONTROLS.Utils.DataSetToXMLSerializer"
], function( $ws, cXSLT, cReportPrinter, cHelpers, cExtend, constants, IoC, ConsoleLogger,cInstance, fcHelpers, strHelpers) {
   return cExtend({}, {

      _complexFields: {
         "Связь" : true,
         "Иерархия" : true,
         "Перечисляемое" : true,
         "Флаги" : true,
         "Массив" : true,
         "Array" : true,
         "Запись" : true,
         "Выборка" : true,
         "RecordSet" : true,
         "Record" : true
      },
      _wordsToTranslate: {
         "Дата" : "Date",
         "Время" : "Time",
         "Строка" : "String",
         "Текст" : "Text",
         "Логическое" : "Boolean",
         "Деньги" : "Money",
         "Двоичное" : "Binary",
         'Файл-rpc': 'RPCFile',
         'Временной интервал':'TimeInterval',
         'Идентификатор': 'ID'
      },
      _colNameToTag: {
         "Число целое" : "Integer",
         "Число вещественное" : "Double",
         "Дата и время" : "DateTime"
      },
      _branchTypes: {
         "true": "Node",
         "false": "Leaf",
         "null": "HiddenNode"
      },
      //TODO Перенести обратно в Source.js, потому что получилась копипаста, хотя хотели как лучше
      $constructor: function() {
         this._reportPrinter = new cReportPrinter({
            columns: this._options.columns
         });
         //TODO возможно кнопка печати может стать кнопкой меню, в зависимости от набора отчетов на печать
      },
      /**
       * Подготовить отчет в виде html-текста
       * @param xsl
       * @param dataSet
       * @returns {$ws.proto.Deferred}
       */
      prepareReport: function(xsl, dataSet){
         xsl =   this._getTransform(this._options.report, this._options.dataSet, xsl);
         var
               self = this,
               rp = this._reportPrinter,
               xmlDoc = this.serialize(dataSet, rp.getColumns());
         return rp.prepareReport(dataSet, xsl, undefined, xmlDoc).addErrback(function(error){
            fcHelpers.alert(error, { checkAlreadyProcessed: true }, self);
            return error;
         });
      },
      _getTransform: function(idReport, object, xsl) {
         return ( typeof idReport === 'undefined' ?  constants.wsRoot + 'res/xsl/' :  constants.resourceRoot ) + xsl;
      },
      /**
       * Сериализует контейнер в XML-документ
       * @param {WS.Data/Collection/RecordSet} records набор сериализуемых записей
       * @return {Document}  результат сериализации
       */
      serialize: function(dataSet, columns){
         var doc = this._createXMLDocument();
         this._serializeObject(dataSet, doc, doc, columns);
         this._serializeColumns(columns, dataSet, doc);
         return doc;
      },
      _serializeColumns : function(columns, object, doc){
         var cols, column;
         if(columns && columns instanceof Array && columns.length > 0) {
            doc.documentElement.appendChild(cols = doc.createElement('Columns'));
            for(var i = 0, l = columns.length; i < l; i++){
               cols.appendChild(column = doc.createElement('Column'));
               column.setAttribute('Name', columns[i].title || '');
               column.setAttribute('Field', columns[i].field);
            }
         }
         //TODO здесь будет настройка для иерархии
      },
      _serializeObject: function(object, parentElement, document, columns){
         var dataRow,
               recordElement,
               currentElement,
               pkColumnName;
         if (cInstance.instanceOfModule( object , 'WS.Data/Collection/RecordSet')){
            var self = this;
            parentElement.appendChild(currentElement = document.createElement('RecordSet'));
            object.each(function(record){
               self._serializeObject(record, currentElement, document, columns);
            });
            self._serializeResults(object, currentElement, document);
         }
         else if (object && (typeof object.getRawData === 'function') && object.getRawData()){
            var key = object.getId();
            if(key === null){
               key = 'null';
            }
            pkColumnName = object._keyField;//TODO record.getIdProperty()
            parentElement.appendChild(recordElement = document.createElement('Record'));

            recordElement.setAttribute('RecordKey', key);
            recordElement.setAttribute('KeyField', pkColumnName);
            for (var k = 0, cnt = columns.length; k < cnt; k++) {
               this._serializeField(columns[k], object, recordElement, document);
            }
         }
      },
      _serializeResults: function(object, recordSetElement, document){
         var
            self = this,
            meta = object.getMetaData(),
            results = meta ? meta.results : null;
         if( results ) {
            var currentElement;
            recordSetElement.appendChild(currentElement = document.createElement('Results'));
            results.each(function(field){
               var column = {
                  'field': field
               };
               self._serializeField(column, results, currentElement, document);
            });
         }
      },
      _serializeField: function(column, record, recordElement, document){
         var fieldElement,
               tagName,
               element,
               cyrillicTest = /[а-я]+/gi;
         if (!column.hasOwnProperty('field')){
            return;
         }
         recordElement.appendChild(fieldElement = document.createElement('Field'));
         fieldElement.setAttribute('Name', column.field);
         var fieldValue = record.get(column.field) === null ? "" : record.get(column.field),
            fieldPrimitiveValue,
            format;
         if (cInstance.instanceOfMixin(record, 'WS.Data/Entity/FormattableMixin')) {
            var recordFormat = record.getFormat(),
               index = recordFormat.getFieldIndex(column.field);
            format = index > -1 ? recordFormat.at(index) : undefined;
         }
         column.type = format ? format.getType() : column.type || 'Text';
         var typeName =  typeof(column.type) == 'object' ? column.type.n : column.type;
         if(!this._complexFields[typeName] && !column.s && !this._complexFields[column.s]){
            tagName = this._colNameToTag[typeName] || typeName;
            tagName = this._wordsToTranslate[tagName] || tagName;
            var resultTest = cyrillicTest.test(tagName);
            if(resultTest) {
               IoC.resolve('ILogger').error('XSLT', rk('Внимание! Кирилический тэг без замены') + ': ' + tagName);
            }
            element = document.createElement(tagName);
            if(fieldValue instanceof Date){
               if(typeName === "Дата и время" || typeName === 'DateTime')
                  fieldValue = fieldValue.toSQL() + "T" + fieldValue.toTimeString().replace(" GMT", "").replace(/\s[\w\W]*/, "");
               if(typeName === 'Дата' || typeName === 'Date')
                  fieldValue = fieldValue.toSQL();
               if(typeName === 'Время' || typeName === 'Time')
                  fieldValue = fieldValue.toTimeString().replace(" GMT", "").replace(/\s[\w\W]*/, "");
            }

            if (fieldValue instanceof Object) {
               fieldPrimitiveValue = fieldValue.valueOf();
               if (fieldPrimitiveValue !== fieldValue) {
                  element.setAttribute('Value', fieldPrimitiveValue);
               }
            }

            fieldValue = strHelpers.removeInvalidXMLChars(''.concat(fieldValue));
            element.appendChild(document.createTextNode(fieldValue));
            fieldElement.appendChild(element);
         } else if(typeName == 'Связь'){
            element = document.createElement('Link');
            element.setAttribute('Table', typeof(column.type) == 'object' ? column.type.t : column.table);
            element.appendChild(document.createTextNode(fieldValue));
            fieldElement.appendChild(element);
         } else if(typeName == 'Иерархия' || (column.s && column.s == 'Иерархия')){
            fieldElement.appendChild(element = document.createElement('Hierarchy'));
            var pID, flBranch;
            element.appendChild(pID = document.createElement('Parent'));
            element.appendChild(flBranch = document.createElement('NodeType'));
            if(typeof(column.type) == 'object'){
               element.setAttribute('HierarchyName', column.type.f + "");
               pID.appendChild(document.createTextNode(fieldValue[1] + ""));
               flBranch.appendChild(document.createTextNode(this._branchTypes[fieldValue[0] + ""]));
            } else {
               if(typeName == "Идентификатор"){
                  element.setAttribute('HierarchyName', column.titleColumn + "");
                  pID.appendChild(document.createTextNode(fieldValue + ""));
                  fieldValue = this._branchTypes[record.get(column.title + "@") + ""];
                  flBranch.appendChild(document.createTextNode(fieldValue));
               } else {
                  recordElement.removeChild(fieldElement);
               }
            }
         } else if(typeName == 'Перечисляемое'){
            fieldElement.appendChild(element = document.createElement('Enumerable'));
            var option;
            fieldValue = fieldValue.toObject();
            for(var key in fieldValue.availableValues){
               if(fieldValue.availableValues.hasOwnProperty(key)) {
                  element.appendChild(option = document.createElement('Variant'));
                  option.setAttribute('Value', key);
                  var value = fieldValue.availableValues[key];
                  if(value === null){
                     value = '';
                  }
                  option.setAttribute('Title', value);
                  if(key == fieldValue.currentValue)
                     option.setAttribute('Checked', 'true');
               }
            }
         } else if(typeName == 'Флаги'){
            fieldElement.appendChild(element = document.createElement('Flags'));
            var flag;
            fieldValue = fieldValue.toObject();
            for(var number in fieldValue){
               if(fieldValue.hasOwnProperty(number)) {
                  element.appendChild(flag = document.createElement('Flag'));
                  flag.setAttribute('Title', number);
                  flag.setAttribute('Condition', fieldValue[number] + "");
               }
            }
         } else if(typeName == 'Массив'){
            fieldElement.appendChild(element = document.createElement('Array'));
            element.setAttribute('DataType', typeof(column.type) == 'object' ? column.type.t : column.arrayType);
            var elem;
            for(var i = 0, l = fieldValue.length; i < l; i++){
               element.appendChild(elem = document.createElement('Value'));
               //для элементов массива всегда добавляем их значение как текст, ведь там может быть null
               elem.appendChild(document.createTextNode(strHelpers.removeInvalidXMLChars(fieldValue[i] + '')));
            }
         } else if (typeName == 'RecordSet' || typeName == 'Record') {
            this._serializeObject(fieldValue, fieldElement, document, this._getColumns(fieldValue));
         }
      },
      _getColumns: function(object) {
         var
            columns = [],
            format = object.getFormat();
         format.each(function(field) {
            columns.push({ field: field.getName() });
         });
         return columns;
      },
      _createXMLDocument: function(){
         var doc;
         // нормальные браузеры
         if (document.implementation && document.implementation.createDocument)
            doc = document.implementation.createDocument("", "", null);
         // IE
         if(cHelpers.axo) {
            doc = cHelpers.axo(constants.IE_ACTIVEOBJECT_XML_PRINT_TYPE);
         }
         return doc;
      }
   });

});