/**
 * Created by ad.chistyakova on 22.04.2015.
 */
//хак для depenceCollector
$ws = $ws || {
      _const : {
         wsRoot: '/ws/'
      }
   }
define('js!SBIS3.CONTROLS.Utils.DataSetToXMLSerializer', [
   'is!browser?js!' + $ws._const.wsRoot + 'Lib/xslt.js'
      ], function() {
   return $ws.core.extend({}, {

      $protected: {
         _options: {
            columns: [],
            report: undefined
         },
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
         _reportPrinter : null,
         _loadIndicator: undefined
      },

      $constructor: function() {
         this._reportPrinter = new $ws.proto.ReportPrinter({
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
               xslDoc = new $ws.proto.XMLDocument({ name: xsl }).getDocument(),
               xmlDoc = this.serialize(dataSet, rp.getColumns());
         return rp.prepareReport(dataSet, xslDoc, undefined, xmlDoc).addErrback(function(error){
            $ws.helpers.alert(error, { checkAlreadyProcessed: true }, self);
            return error;
         });
      },
      _getTransform: function(idReport, object, xsl) {
         return ( typeof idReport === 'undefined' ?  $ws._const.wsRoot + 'res/xsl/' :  $ws._const.resourceRoot ) + xsl;
      },
      /**
       * Сериализует контейнер в XML-документ
       * @param {SBIS3.CONTROLS.DataSet} records набор сериализуемых записей
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
               currentElement,
               pkColumnName;
         if ($ws.helpers.instanceOfModule( object , 'SBIS3.CONTROLS.DataSet')){
            var self = this;
            parentElement.appendChild(currentElement = document.createElement('Выборка'));
            object.each(function(record){
               self._serializeObject(record, currentElement, document, columns);
            });

         }
         else if (object && object.getRaw()){
            var key = object.getKey();
            pkColumnName = object._keyField;//TODO record.getKeyField()
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
   });

});