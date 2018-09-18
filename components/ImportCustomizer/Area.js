/**
 * Контрол "Область редактирования настройщика импорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/Area
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ImportCustomizer/Area',
   [
      'Core/CommandDispatcher',
      'Core/core-merge',
      'Core/Deferred',
      //'Core/IoC',
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/Utils/ImportExport/PropertyNames',
      'SBIS3.CONTROLS/Utils/ImportExport/RemoteCall',
      'SBIS3.CONTROLS/Utils/InformationPopupManager',
      'SBIS3.CONTROLS/ImportCustomizer/Utils/ObjectSelectByNames',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Type/descriptor',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/Area',
      'css!SBIS3.CONTROLS/ImportCustomizer/Area',
      'SBIS3.CONTROLS/Button',
      'SBIS3.CONTROLS/ImportCustomizer/BaseParams/View',
      'SBIS3.CONTROLS/ImportCustomizer/ProviderArgs/View',
      'SBIS3.CONTROLS/ScrollContainer'
   ],

   function (CommandDispatcher, cMerge, Deferred, /*IoC,*/ CompoundControl, PropertyNames, RemoteCall, InformationPopupManager, objectSelectByNames, RecordSet, DataType, tmpl) {
      'use strict';

      /**
       * @typedef {object} ImportRemoteCall Тип, содержащий информацию для вызова удалённого сервиса для получения данных ввода или отправки данных вывода. Соответствует вспомогательному классу {@link SBIS3.CONTROLS/Utils/ImportExport/RemoteCall}
       * @property {string} endpoint Сервис, метод которого будет вызван
       * @property {string} method Имя вызываемого метода
       * @property {string} [idProperty] Имя свойства, в котором находится идентификатор (опционально, если вызову это не потребуется)
       * @property {object} [args] Аргументы вызываемого метода (опционально)
       * @property {function(object):object} [argsFilter] Фильтр аргументов (опционально)
       * @property {function(object):object} [resultFilter] Фильтр результатов (опционально)
       */

      /**
       * @typedef {object} ImportFile Тип, содержащий информацию об импортируемом файле
       * @property {string} name Отображаемое имя файла
       * @property {string} url Урл для скачивания файла
       * @property {string} uuid Идентификатор файла в системе хранения
       */

      /**
       * @typedef {object} ImportParser Тип, содержащий информацию о провайдере парсинга импортируемых данных
       * @property {string} name Имя(идентификатор) парсера
       * @property {string} title Отображаемое имя парсера
       * @property {string} [component] Класс компонента для настройки парсера (опционально)
       * @property {object} [args] Набор специфичных для данного парсера параметров (опционально)
       */

      /**
       * @typedef {object} ImportSheet Тип, содержащий информацию об области импортируемых данных (например, лист excel)
       * @property {string} name Отображаемое наименование области данных
       * @property {Array<Array<string>>} sampleRows Образец данных в области, массив массивов равной длины
       * @property {string} [parser] Провайдер парсинга импортируемых данных (опционально)
       * @property {object} [parserConfig] Параметры провайдера парсинга импортируемых данных. Определяется видом парсера (опционально)
       * @property {number} [skippedRows] Количество пропускаемых строк в начале (опционально)
       * @property {string} [separator] Символы-разделители (опционально)
       * @property {Array<ImportColumnBinding>} [columns] Список привязки колонок импортируемых данных к полям базы данных (опционально)
       * @property {number} [index] Индекс в массиве (опционально)
       */

      /**
       * @typedef {object} ImportColumnBinding Тип, содержащий информацию о привязке колонки импортируемых данных к полю базы данных
       * @property {number} index Индекс колонки
       * @property {string} field Имя поля
       */

      /**
       * @typedef {object} ImportTargetFields Тип, описывающий целевые поля для привязки импортируемых данных
       * @property {Array<object>|WS.Data/Collection/RecordSet} items Список объектов, представляющих данные об одном поле. Каждый из них должен
       *                            содержать идентификатор поля, отображаемое наименование поля и идентификатор родителя, если необходимо. Имена
       *                            свойств задаются явно в этом же определинии типе
       * @property {string} [idProperty] Имя свойства, содержащего идентификатор (опционально, если items представлен рекордсетом)
       * @property {string} displayProperty Имя свойства, содержащего отображаемое наименование
       * @property {string} [parentProperty] Имя свойства, содержащего идентификатор родителя (опционально)
       */

      /**
       * @typedef {object} ImportMapping Тип, содержащий информацию о настройке соответствий значений
       * @property {function(object|WS.Data/Entity/Record):ImportMapperItem} fieldFilter Фильтр полей, с помощью которого из общего списка полей {@link fields} отбираются нужные. Фильтр принимает объект поля и, если оно нужное, возвращает объект вида {@link ImportSimpleItem}. Упрощённый способ отбора предоставляется опцией {@link fieldProperty}
       * @property {string} fieldProperty Имя специального ключевого свойства, с помощью которого из общего списка полей {@link fields} отбираются нужные. Каждое нужное поле должно иметь свойство с таким именем. Более комплексный способ отбора предоставляется опцией {@link fieldFilter}
       * @property {object} variants Набор вариантов сопоставления
       * @property {object} mapping Перечень соответствий специальный ключ поля - идентификатор варианта
       */

      /**
       * @typedef {object} ImportSimpleItem Тип, содержащий информацию об элементе сопоставления
       * @property {string|number} id Идентификатор элемента
       * @property {string} title Название элемента
       */

      /**
       * @typedef {object} ImportValidator Тип, описывающий валидаторы результаттов редактирования
       * @property {function(object, function):(boolean|string)} validator Функция проверки. Принимает два аргумента. Первый - объект с проверяемыми данными. Второй - геттер опции по её имени. Геттер позволяет получить доступ к опциям, которые есть в настройщике импорта в момент валидации, но на момент задания валидатора ещё не были доступны (например, получены через обещание или через {@link ImportRemoteCall}). Должна возвратить либо логическое значение, показывающее пройдена ли проверка, либо строку с сообщением об ошибке
       * @property {Array<*>} [params] Дополнительные аргументы функции проверки, будут добавлены после основных (опционально)
       * @property {string} [errorMessage] Сообщение об ошибке по умолчанию (опционально)
       * @property {boolean} [noFailOnError] Указывает на то, что если проверка не пройдена, это не является фатальным. В таком случае пользователю будет показан диалог с просьбой о подтверждении (опционально)
       */

      /**
       * @typedef {object} ImportResults Тип, содержащий информацию о результате редактирования
       * @property {string} dataType Тип импортируемых данных (excel и т.д.)
       * @property {ImportFile} file Информация о файле с импортируемыми данными
       * @property {Array<ImportSheet>} sheets Список объектов, представляющих имеющиеся области данных
       * @property {boolean} [sameSheetConfigs] Обрабатываются ли все области данных одинаково (опционально)
       * @property {object} [mapping] Перечень соответствий специальный ключ поля - идентификатор варианта (опционально, когда применимо)
       * @property {*} [*] Базовые параметры импортирования (опционально)
       */

      var _typeIfDefined = function (type, value) {
         // Если значение есть - оно должно иметь указанный тип
         return value !=/*Не !==*/ null && typeof value !== type ? new Error('Value must be a ' + type) : value;
      };

      /**
       * Константа (как бы) - Тип данных Excel
       * @private
       * @type {string}
       */
      var _DATA_TYPE_EXCEL = 'excel';
      /**
       * Константа (как бы) - Тип данных DBF
       * @private
       * @type {string}
       */
      var _DATA_TYPE_DBF = 'dbf';
      /**
       * Константа (как бы) - Тип данных CommerceML
       * @private
       * @type {string}
       */
      var _DATA_TYPE_CML = 'cml';
      /**
       * Константа (как бы) - Список всех поддерживаемых типов данных
       * @private
       * @type {string}
       */
      var _DATA_TYPES = [_DATA_TYPE_EXCEL, _DATA_TYPE_DBF, _DATA_TYPE_CML];

      /**
       * Константа (как бы) - Проверочная информация о типах данных опций
       *
       * @private
       * @type {object}
       */
      var _OPTION_TYPES = {
         dialogMode: _typeIfDefined.bind(null, 'boolean'),
         waitingMode: _typeIfDefined.bind(null, 'boolean'),
         dialogTitle: _typeIfDefined.bind(null, 'string'),
         dialogButtonTitle: _typeIfDefined.bind(null, 'string'),
         allSheetsTitle: _typeIfDefined.bind(null, 'string'),
         columnBindingMenuTitle: _typeIfDefined.bind(null, 'string'),
         columnBindingHeadTitle: _typeIfDefined.bind(null, 'string'),
         mapperFieldColumnTitle: _typeIfDefined.bind(null, 'string'),
         mapperVariantColumnTitle: _typeIfDefined.bind(null, 'string'),
         dataType: DataType(String).required().oneOf(_DATA_TYPES),
         file: function (file) {
            // Должна быть опция "file"
            if (!file) {
               return new Error('Option "file" required');
            }
            // И опция "file" должна быть {@link ImportFile}
            if (typeof file !== 'object' ||
               !(file.name && typeof file.name === 'string') ||
               !(file.url && typeof file.url === 'string') ||
               !(file.uuid && typeof file.uuid === 'string')) {
               return new Error('Option "file" must be an ImportFile');
            }
            return file;
         },
         baseParamsComponent: DataType(String).required(),
         baseParams: _typeIfDefined.bind(null, 'object'),
         parsers: function (parsers) {
            // Если есть опция "parsers", то она должна быть объектом
            if (parsers && typeof parsers !== 'object') {
               throw new Error('Option "parsers" must be an object');
            }
            if (parsers) {
               for (var name in parsers) {
                  // Каждый элемент набора parsers должно быть {@link ImportParser}
                  var v = parsers[name];
                  if (!(name &&
                        (typeof v === 'object') &&
                        (v.title && typeof v.title === 'string') &&
                        (!v.component || typeof v.component === 'string') &&
                        (!v.args || typeof v.args === 'object')
                     )) {
                     return new Error('Parsers items must be an ImportParser');
                  }
               }
            }
            return parsers;
         },
         providerArgs: _typeIfDefined.bind(null, 'object'),
         fields: function (fields) {
            // Должна быть опция "fields"
            if (!fields) {
               return new Error('Option "fields" required');
            }
            // и являться либо экземпляром Deferred, либо иметь тип ImportTargetFields, либо иметь тип ImportRemoteCall
            if (typeof fields !== 'object') {
               return new Error('Option "fields" must be an object');
            }
            if (fields instanceof Deferred) {
               return fields;
            }
            var err1 = _validateImportTargetFields(fields);
            if (!(err1 instanceof Error)) {
               return fields;
            }
            var err2 = _validateImportRemoteCall(fields);
            return err2 instanceof Error ? new Error('Option "fields" must be an ImportTargetFields or ImportRemoteCall or Core/Deferred') : fields;
         },
         sheets: function (sheets) {
            // Для типа данных EXCEL или DBF должна быть опция "sheets"
            if (!sheets) {
               return new Error('Option "sheets" required');
            }
            // и быть не пустым массивом
            if (!Array.isArray(sheets) || !sheets.length) {
               return new Error('Option "sheets" must be none empty array');
            }
            // И каждый элемент массива должен быть {@link ImportSheet}
            if (!sheets.every(function (v) { return (
                  typeof v === 'object' &&
                  (v.name && typeof v.name === 'string') &&
                  (v.sampleRows && Array.isArray(v.sampleRows) && v.sampleRows.length && v.sampleRows.every(function (v2) { return v2 && Array.isArray(v2) && v2.length && v2.length === v.sampleRows[0].length; }))
               ); })) {
               return new Error('Option "sheets" items must be an ImportSheet');
            }
            return sheets
         },
         sheetIndex: _typeIfDefined.bind(null, 'number'),
         sameSheetConfigs: _typeIfDefined.bind(null, 'boolean'),
         columnBindingMapping: function (value) {
            // Если есть опция "columnBindingMapping"
            if (value) {
               // То она должна быть объектом или массивом объектов
               if (!(Array.isArray(value) ? value.every(function (v) { return typeof v === 'object'; }) : typeof value === 'object')) {
                  return new Error('Option "columnBindingMapping" must be an object or array of objects')
               }
            }
            return value;
         },
         mapping: function (mapping) {
            // Для типа данных CML(CommerceML) должна быть опция "mapping"
            if (!mapping) {
               return new Error('Option "mapping" required');
            }
            if (typeof mapping !== 'object') {
               return new Error('Option "mapping" must be an object');
            }
            // и она должна быть {link ImportMapping}
            if (!(!mapping.fieldFilter || typeof mapping.fieldFilter === 'function') ||
               !(!mapping.fieldProperty || typeof mapping.fieldProperty === 'string') ||
               !(mapping.fieldFilter || mapping.fieldProperty) ||
               !(!mapping.variants || typeof mapping.variants === 'object') ||
               !(!mapping.mapping || typeof mapping.mapping === 'object')
            ) {
               return new Error('Option "mapping" must be an ImportMapping');
            }
            return mapping;
         },
         validators: function (validators) {
            // Если есть опция "validators", то она должна быть массивом
            if (validators && !Array.isArray(validators)) {
               return new Error('Option "validators" must be an Array');
            }
            if (validators) {
               // И каждый элемент массива должен быть {@link ImportValidator}
               if (!validators.every(function (v) { return (
                     typeof v === 'object' &&
                     (v.validator && typeof v.validator === 'function') &&
                     (!v.params || Array.isArray(params)) &&
                     (!v.errorMessage || typeof v.errorMessage === 'string') &&
                     (!v.noFailOnError || typeof v.noFailOnError === 'boolean')
                  ); })) {
                  return new Error('Option "validators" items must be an ImportValidator');
               }
            }
            return validators;
         }
      };

      /**
       * онстанта (как бы) - Значения опций по умолчанию
       *
       * @private
       * @type {object}
       */
      var _DEFAULT_OPTIONS = {
         baseParamsComponent: 'SBIS3.CONTROLS/ImportCustomizer/BaseParams/View',
         baseParams: {
            //Заменять ли импортируемыми данными предыдущее содержимое базы данных полностью или нет (только обновлять и добавлять)
            replaceAllData: false,
            //Место назначения для импортирования (таблица в базе данных и т.п.)
            destination: null
         },
         parsers: {
            // TODO: Обдумать добавление поля applicable:Array<string> для указания типов данных (Excel или DBF)
            // TODO: Обдумать удаление поля order
            'InColumnsHierarchyParser': {title:rk('в отдельной колонке', 'НастройщикИмпорта'), order:10},
            'InRowsHierarchyParser': {title:rk('в отдельной строке', 'НастройщикИмпорта'), component:'SBIS3.CONTROLS/ImportCustomizer/ProviderArgs/View', order:20},
            'OutlineHierarchyParser': {title:rk('в группировке строк', 'НастройщикИмпорта'), order:30}
         },
         validators: [
            {
               validator: function (data, optionGetter) { return data.dataType === 'cml' || data.sheets.every(function (sheet) { return !!sheet.columns.length; }); },
               errorMessage: rk('Не установлено соответсвие между колонками и полями', 'НастройщикИмпорта')
            }
         ]
      };

      /**
       * Константа (как бы) - Список имён всех собственных опций компонента
       *
       * @private
       * @type {Array<string>}
       */
      var _OWN_OPTIONS_NAMES = [
         'dialogTitle',
         'dialogButtonTitle',
         'allSheetsTitle',
         'columnBindingMenuTitle',
         'columnBindingHeadTitle',
         'mapperFieldColumnTitle',
         'mapperVariantColumnTitle',
         'dataType',
         'file',
         'baseParamsComponent',
         'baseParams',
         'parsers',
         'providerArgs',
         'fields',
         'sheets',
         'sheetIndex',
         'sameSheetConfigs',
         'columnBindingMapping',
         'mapping',
         'validators'
      ];



      var Area = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ImportCustomizer/Area.prototype*/ {

         _dotTplFn: tmpl,
         $protected: {
            _options: {
               /**
                * @cfg {string} Отображать как часть диалога (опционально)
                */
               dialogMode: null,
               /**
                * @cfg {string} Отображать в режиме ожидания (опционально)
                */
               waitingMode: null,
               /**
                * @cfg {string} Заголовок диалога настройщика импорта (опционально)
                */
               dialogTitle: null,//Определено в шаблоне
               /**
                * @cfg {string} Подпись кнопки диалога применения результата редактирования (опционально)
                */
               dialogButtonTitle: null,//Определено в шаблоне
               /**
                * @cfg {string} Название опции для выбора одинаковых настроек для всех листов файла в под-компоненте выбора области данных (опционально)
                */
               allSheetsTitle: null,
               /**
                * @cfg {string} Заголовок для меню выбора соответсвия в колонках в под-компоненте привязки колонок (опционально)
                */
               columnBindingMenuTitle: null,
               /**
                * @cfg {string} Всплывающая подсказака в заголовке колонки в под-компоненте привязки колонок (опционально)
                */
               columnBindingHeadTitle: null,
               /**
                * @cfg {string} Заголовок колонки целевых элементов сопоставления в под-компоненте настройки соответствия/мэпинга значений (опционально)
                */
               mapperFieldColumnTitle: null,
               /**
                * @cfg {string} Заголовок колонки вариантов сопоставления в под-компоненте настройки соответствия/мэпинга значений (опционально)
                */
               mapperVariantColumnTitle: null,
               /**
                * @cfg {string} Тип импортируемых данных. Должен сооветствовать одной из констант: Area.DATA_TYPE_EXCEL, Area.DATA_TYPE_DBF, Area.DATA_TYPE_CML, Area.DATA_TYPES
                */
               dataType: null,
               /**
                * @cfg {ImportFile} Информация об импортируемом файле (обязательно)
                */
               file: null,
               /**
                * @cfg {string} Класс компонента настройки параметоров импортирования (Опционально, если не указан - используется {@link SBIS3.CONTROLS/ImportCustomizer/BaseParams/View комполнент по умолчанию})
                */
               baseParamsComponent: null,
               /**
                * @cfg {object} Опции компонента настройки параметоров импортирования. Состав опций определяется {@link baseParamsComponent используемым компонентом} (опционально)
                */
               baseParams: null,
               /**
                * @cfg {object<ImportParser>} Список всех доступных провайдеров парсинга импортируемых данных
                */
               parsers: null,
               /**
                * @cfg {object} Опции провайдера парсинга (отдельно по каждому парсеру). Состав опций может быть различным для каждого {@link parsers парсера} (опционально)
                */
               providerArgs: null,
               /**
                * @cfg {ImportTargetFields|Core/Deferred<ImportTargetFields>|ImportRemoteCall} Полный набор полей, к которым должны быть привязаны импортируемые данные
                */
               fields: null,
               /**
                * @cfg {Array<ImportSheet>} Список объектов, представляющих имеющиеся области данных
                */
               sheets: [],
               /**
                * @cfg {number} Индекс выбранной области данных
                */
               sheetIndex: null,
               /**
                * @cfg {boolean} Обрабатываются ли все области данных одинаково
                */
               sameSheetConfigs: null,
               /**
                * @cfg {object|Array<object>} Перечень соответствий идентификатор поля - индекс колонки в под-компоненте привязки колонок. Может быть представлен как один объект для всех листов, так и массив объектов по одному на каждый лист (опционально)
                */
               columnBindingMapping: null,
               /**
                * @cfg {ImportMapping} Информацию о настройке соответствий значений
                */
               mapping: null,
               /**
                * @cfg {Array<ImportValidator>} Список валидаторов результатов редактирования
                */
               validators: null,
               /**
                * @cfg {string} Нотация, в которой будут представлены имена свойств результата. Допустимые значения: "lowDash" и "camelCase" (по умолчанию). При указании "lowDash" результат с помощью хелпера {@link SBIS3.CONTROLS/Utils/ImportExport/PropertyNames} будет приведён в нотацию с символом нижнего подчёркивания в качестве разделителя. При указании "camelCase" (или без указания совсем) результат будет возвращён "как есть", согласно {@link https://wi.sbis.ru/doc/platform/developmentapl/standards/styleguide-js/ стандарту разработки JavaScript} (опционально)
                */
               resultNotation: null
            },
            // Список имён вложенных под-компонентов
            _SUBVIEW_NAMES: {
               sheet: 'controls-ImportCustomizer-Area__sheet',
               baseParams: 'controls-ImportCustomizer-Area__baseParams',
               provider: 'controls-ImportCustomizer-Area__provider',
               providerArgs: 'controls-ImportCustomizer-Area__providerArgs',
               columnBinding: 'controls-ImportCustomizer-Area__columnBinding',
               mapper: 'controls-ImportCustomizer-Area__mapper'
            },
            // Ссылки на вложенные под-компоненты
            _views: {
               //sheet: null,
               //baseParams: null,
               //provider: null,
               //providerArgs: null,
               //columnBinding: null,
               //mapper: null
            },
            // Обещание, разрешаемое полным набором полей (если в опциях они не заданы явно)
            _fieldsPromise: null,
            // Набор результирующих значений (по обастям данных)
            _results: null
         },

         _modifyOptions: function () {
            var options = Area.superclass._modifyOptions.apply(this, arguments);
            this._processOptions(options);
            return options;
         },

         /**
          * Провести обработку опций
          * @protected
          * @param {object} options Опции компонента
          */
         _processOptions: function (options) {
            options._isUsedSubview = this._getSubviewUsings(options);
            if (!options.waitingMode) {
               this._resolveOptions(options);
               this._validateOptions(options, this._filterValidatedOptionNames.bind(this));
               this._reshapeOptions(options);
            }
         },

         /**
          * Создать все необходимые дополнительные опции компонента
          * @protected
          * @param {object} options Опции компонента
          */
         _reshapeOptions: function (options) {
            var isUsedSubview = options._isUsedSubview;
            // Если в опции "fields" нет явных данных типа {@link ImportTargetFields}, то выявить обещание this._fieldsPromise, а опцию сбросить
            var fields = options.fields;
            var promise;
            if (fields instanceof Deferred) {
               promise = fields;
            }
            else {
               var call = _validateImportRemoteCall(fields, true);
               if (call instanceof RemoteCall) {
                  promise = call.call(Area.getOwnOptionNames().reduce(function (r, v) { r[v] = options[v]; return r; }, {}));
               }
            }
            if (promise) {
               this._fieldsPromise = promise;
               options.fields = null;
            }
            // Сформировать дополнительные свойства и области видимости для под-компонентов
            var scopes = {};
            var sheets = options.sheets;
            var hasSheets = sheets && sheets.length;
            var parsers = options.parsers;
            var parserNames = parsers ? Object.keys(parsers) : [];
            var hasParsers = !!parserNames.length;
            var parserItems;
            if (hasParsers) {
               var parserItems = parserNames.map(function (v) { var o = parsers[v]; return {id:v, title:o.title, order:o.order}; });
               parserItems.sort(function (v1, v2) { return v1.order - v2.order; });
               options._defaultParserName = parserItems[0].id;
            }
            var sheetIndex = options.sheetIndex;
            if (hasSheets && (options.sameSheetConfigs || sheetIndex ==/*Не ===*/ null)) {
               options.sheetIndex = sheetIndex = -1;
            }
            var sheet = hasSheets ? sheets[0 < sheetIndex ? sheetIndex : 0] : null;
            var parserName = hasSheets ? sheet.parser : null;
            if (!parserName && hasParsers) {
               parserName = options._defaultParserName;
               if (hasSheets) {
                  sheet.parser = parserName;
               }
            }
            var skippedRows = hasSheets && 0 < sheet.skippedRows ? sheet.skippedRows : 0;
            // Опции под-компонента "sheet"
            if (isUsedSubview.sheet) {
               var sheetTitles = hasSheets ? sheets.map(function (v) {return v.name; }) : [];
               scopes.sheet = cMerge({sheetTitles:sheetTitles}, objectSelectByNames(options, ['dataType', 'allSheetsTitle', 'sheetIndex']));
            }
            // Опции под-компонента "baseParams"
            if (isUsedSubview.baseParams) {
               scopes.baseParams = cMerge(options.baseParams ? cMerge({}, options.baseParams) : {}, objectSelectByNames(options, ['dataType', 'fields']));
            }
            // Опции под-компонента "provider"
            if (isUsedSubview.provider) {
               var separator = hasSheets && sheet.separator ? sheet.separator : '';
               scopes.provider = {dataType:options.dataType, parsers:parserItems || [], parser:parserName, skippedRows:skippedRows, separator:separator};
            }
            // Опции под-компонента "providerArgs"
            if (isUsedSubview.providerArgs) {
               scopes.providerArgs = {component:parsers[parserName].component || undefined, options:this._getProviderArgsOptions(options, parserName, true)};
            }
            // Опции под-компонента "columnBinding"
            if (isUsedSubview.columnBinding) {
               var sampleRows = hasSheets ? sheet.sampleRows : [];
               var columnBindingMapping = options.columnBindingMapping;
               if (columnBindingMapping) {
                  options.columnBindingMapping = [];
                  if (hasSheets) {
                     // Очистить заначение опции columnBindingMapping от избыточных данных (всех полей с несуществующими индексами):
                     var count = hasSheets ? sampleRows[0].length : 0;
                     var _cleaner = function (map) {
                        return hasSheets ? Object.keys(map).reduce(function (result, property) {
                           var index = map[property];
                           if (0 <= index && index < count) {
                              result[property] = index;
                           }
                           return result;
                        }, {}) : [];
                     };
                     if (Array.isArray(columnBindingMapping)) {
                        for (var i = 0, len = Math.min(columnBindingMapping.length, sheets.length); i < len; i++) {
                           options.columnBindingMapping[i] = _cleaner(columnBindingMapping[i]);
                        }
                     }
                     else {
                        columnBindingMapping = _cleaner(columnBindingMapping);
                        for (var i = 0, len = sheets.length; i < len; i++) {
                           options.columnBindingMapping[i] = columnBindingMapping;
                        }
                     }
                  }
                  columnBindingMapping = options.columnBindingMapping;
               }
               scopes.columnBinding = cMerge({rows:sampleRows, skippedRows:skippedRows, mapping:columnBindingMapping ? columnBindingMapping[0 < sheetIndex ? sheetIndex : 0] : null}, objectSelectByNames(options, ['dataType', 'fields', {menuTitle:'columnBindingMenuTitle', headTitle:'columnBindingHeadTitle'}]));
            }
            // Опции под-компонента "mapping"
            if (isUsedSubview.mapper) {
               scopes.mapper = cMerge(options.mapping || {}, objectSelectByNames(options, ['dataType', 'fields', {fieldColumnTitle:'mapperFieldColumnTitle', variantColumnTitle:'mapperVariantColumnTitle'}]));
            }
            options._scopes = scopes;
         },

         /**
          * Разрешить неустановленные собственные опции компонента их значениями по умолчанию из статического метода getDefaultOptions
          * @protected
          * @param {object} options Опции компонента
          */
         _resolveOptions: function (options) {
            var defaultOptions = Area.getDefaultOptions();
            for (var name in defaultOptions) {
               if (options[name] === undefined) {
                  options[name] = defaultOptions[name];
               }
            }
         },

         /**
          * Отобрать из указанных имён собственных опций только те, проверки для которых актуальны, учитывая значения других опций
          * @protected
          * @param {Array<string>} names Имена собственных опций компонента, для которых имеются валидаторы из статического метода getOptionTypes
          * @param {object} options Опции компонента
          * @param {Array<string>}
          */
         _filterValidatedOptionNames: function (names, options) {
            if (!options.waitingMode) {
               var _remove = function (list) { Array.prototype.slice.call(arguments, 1).forEach(function (item) { var i = list.indexOf(item); if (i !== -1) { list.splice(i, 1); }; }); };
               if (!options.dialogMode) {
                  _remove(names, 'dialogTitle', 'dialogButtonTitle');
               }
               var dataType = options.dataType;
               if (dataType === Area.DATA_TYPE_EXCEL || dataType === Area.DATA_TYPE_DBF) {
                  _remove(names, 'mapping');
               }
               else
               if (dataType === Area.DATA_TYPE_CML) {
                  _remove(names, 'allSheetsTitle', 'columnBindingMenuTitle', 'columnBindingHeadTitle', 'parsers', 'sheets', 'sheetIndex', 'sameSheetConfigs');
               }
               return names;
            }
         },

         /**
          * Проверить собственные опции компонента на допустимость их значений, используя валидаторы из статического метода getOptionTypes
          * @protected
          * @param {object} options Опции компонента
          * @param {function(Array<string>, object):Array<string>} [namesFilter] Фильт имён опций, которые подлежат проверке. Применяется при необходимости варьировать проверку в зависимости от значений других опций (опционально)
          */
         _validateOptions: function (options, namesFilter) {
            var typeValidators = Area.getOptionTypes();
            if (typeValidators) {
               var names = Object.keys(typeValidators);
               if (namesFilter) {
                  names = namesFilter.call(null, names, options);
               }
               if (names && names.length) {
                  for (var i = 0; i < names.length; i++) {
                     var name = names[i];
                     var validator = typeValidators[name];
                     if (validator) {
                        var err = validator(options[name]);
                        if (err instanceof Error) {
                           //IoC.resolve('ILogger').error('ImportCustomizer', err.message);
                           throw new Error('Wrong option "' + name + '": ' + err.message);
                        }
                     }
                  }
               }
            }
         },

         $constructor: function () {
            /**
             * Уведомление об изменении данных под-компонента
             * @command subviewChanged
             * @public
             */
            CommandDispatcher.declareCommand(this, 'subviewChanged', this._cmdSubviewChanged);
            if (this._options.dialogMode) {
               CommandDispatcher.declareCommand(this, 'complete', this._cmdComplete);
            }
            //CommandDispatcher.declareCommand(this, 'showMessage', Area.showMessage);
            this._publish('onComplete', 'onFatalError');
         },

         init: function () {
            Area.superclass.init.apply(this, arguments);
            this._init();
         },

         _init: function () {
            // Получить ссылки на имеющиеся под-компоненты
            this._collectViews();
            // Инициализировать результирующие данные
            this._initResults();
            // Подписаться на необходимые события
            this._bindEvents();
         },

         _initResults: function () {
            var options = this._options;
            var notWaiting = !options.waitingMode;
            if (notWaiting) {
               if (options.dataType === Area.DATA_TYPE_EXCEL || options.dataType === Area.DATA_TYPE_DBF) {
                  var sheets = options.sheets;
                  if (sheets && sheets.length) {
                     var results = {};
                     var columnBindingMapping = options.columnBindingMapping;
                     for (var i = 0; i < sheets.length; i++) {
                        var sheet = sheets[i];
                        var parserName = sheet.parser;
                        if (!parserName && options._defaultParserName) {
                           sheet.parser = parserName = options._defaultParserName;
                        }
                        var skippedRows = 0 < sheet.skippedRows ? sheet.skippedRows : 0;
                        results[i + 1] = {
                           provider: {parser:parserName, skippedRows:skippedRows, separator:sheet.separator || ''},
                           providerArgs: this._getProviderArgsOptions(options, parserName),
                           columnBinding: {mapping:columnBindingMapping ? columnBindingMapping[i] || {} : {}, skippedRows:skippedRows}
                        };
                     }
                     results[''] = cMerge({}, results[1]);
                     this._results = results;
                  }
               }
            }
            else {
               this._results = null;
            }
            // Если поля представлены обещанием
            var fields = this._fieldsPromise;
            if (fields) {
               if (notWaiting) {
                  // Получить из этого обещания актуальные значения полей по мере разрешения обещания
                  var success = function (data) {
                     this._fieldsPromise = null;
                     this._setFields(data);
                     return data;
                  }.bind(this);
                  var fail = function (err) {
                     this._fieldsPromise = null;
                     this._notify('onFatalError', true, /*err*/rk('При получении данных поизошла ошибка', 'НастройщикИмпорта'));
                     return err;
                  }.bind(this);
                  if (!fields.isReady()) {
                     fields.addCallbacks(success, fail);
                  }
                  else {
                     var value = fields.getResult();
                     (fields.isSuccessful() ? success : fail)(value);
                  }
               }
               else {
                  this._fieldsPromise = null;
               }
            }
         },

         _cmdSubviewChanged: function () {
         },

         _bindEvents: function () {
            var isUsedSubview = this._getSubviewUsings(this._options);
            for (var name in this._views) {
               if (isUsedSubview[name]) {
                  this._bindSubviewEvents(name);
               }
            }
         },

         _bindSubviewEvents: function (name) {
            var view = this._views[name];
            if (view && !view.isDestroyed()) {
               var handlers = {
                  sheet: this._onChangeSheet,
                  baseParams: this._onChangeBaseParams,
                  provider: this._onChangeProvider,
                  providerArgs: this._onChangeProviderArgs,
                  columnBinding: this._onChangeColumnBinding,
                  mapper: this._onChangeMapper
               };
               this.subscribeTo(view, 'onCommandCatch', function (handler, evtName, command/*, args*/) {
                  if (command === 'subviewChanged') {
                     handler.apply(this, Array.prototype.slice.call(arguments, 3));
                     evtName.setResult(true);
                  }
               }.bind(this, handlers[name].bind(this)));
            }
         },

         /*
          * Обработчик "subviewChanged" для под-компонента sheet
          *
          * @protected
          */
         _onChangeSheet: function () {
            // Изменилась область данных для импортирования
            var values = this._getSubviewValues('sheet');
            var options = this._options;
            var results = this._results;
            var sheetIndex = options.sheetIndex;
            var prevResult = results[0 <= sheetIndex ? sheetIndex + 1 : ''];
            prevResult.provider =  cMerge({}, this._getSubviewValues('provider'));
            prevResult.providerArgs = cMerge({}, this._getSubviewValues('providerArgs'));
            prevResult.columnBinding = cMerge({}, this._getSubviewValues('columnBinding'));
            sheetIndex = values.sheetIndex;
            options.sheetIndex = sheetIndex;
            var nextResult = results[0 <= sheetIndex ? sheetIndex + 1 : ''];
            this._setSubviewValues('provider', nextResult.provider);
            this._updateProviderArgsView(nextResult.provider.parser);
            var sheets = options.sheets;
            this._setSubviewValues('columnBinding', cMerge({rows:sheets[0 < sheetIndex ? sheetIndex : 0].sampleRows}, nextResult.columnBinding));
         },

         /*
          * Обработчик "subviewChanged" для под-компонента baseParams
          *
          * @protected
          */
         _onChangeBaseParams: function () {
            // Изменились основные параметры импортирования
            var values = this._getSubviewValues('baseParams');
            var fields = values.fields;
            if (fields) {
               this._options.fields = fields;
               this._setSubviewValues('columnBinding', {fields:fields});
            }
         },

         /*
          * Обработчик "subviewChanged" для под-компонента provider
          *
          * @protected
          */
         _onChangeProvider: function () {
            // Изменился выбор провайдера парсинга
            var values = this._getSubviewValues('provider');
            var sheetIndex = this._options.sheetIndex;
            var result = this._results[0 <= sheetIndex ? sheetIndex + 1 : ''];
            var parserName = values.parser;
            var skippedRows = values.skippedRows;
            if (parserName !== result.provider.parser) {
               this._updateProviderArgsView(parserName);
            }
            result.provider = cMerge({}, values);
            result.columnBinding.skippedRows = skippedRows;
            this._setSubviewValues('columnBinding', {skippedRows:skippedRows});
         },

         /*
          * Обработчик "subviewChanged" для под-компонента columnBinding
          *
          * @protected
          */
         _onChangeColumnBinding: function () {
            // Изменилась привязка данных к полям базы
            var values = this._getSubviewValues('columnBinding');
            var sheetIndex = this._options.sheetIndex;
            var result = this._results[0 <= sheetIndex ? sheetIndex + 1 : ''];
            var skippedRows = values.skippedRows;
            result.provider.skippedRows = skippedRows;
            result.columnBinding = cMerge({}, values);
            this._setSubviewValues('provider', {skippedRows:skippedRows});
         },

         /*
          * Обработчик "subviewChanged" для под-компонента mapper
          *
          * @protected
          */
         _onChangeMapper: function () {
            // Изменился перечень соответсвий
            var values = this._getSubviewValues('mapper');
            var mapping = values.mapping;
            if (mapping) {
               this._options.mapping.mapping = mapping;
            }
         },

         /*
          * Обработчик "subviewChanged" для под-компонента providerArgs
          *
          * @protected
          */
         _onChangeProviderArgs: function () {
            // Изменились параметры провайдера парсинга
            var values = this._getSubviewValues('providerArgs');
            var sheetIndex = this._options.sheetIndex;
            this._results[0 <= sheetIndex ? sheetIndex + 1 : ''].providerArgs = cMerge({}, values);
         },

         /**
          * Собрать ссылки на все реально имеющиеся под-компоненты
          * @protected
          */
         _collectViews: function () {
            var subviewNames = this._SUBVIEW_NAMES;
            var views = {};
            for (var name in subviewNames) {
               views[name] = _getChildComponent(this, subviewNames[name]);
            }
            this._views = views;
         },

         /*
          * Получить список необходимости вложенных под-компонентов
          *
          * @protected
          * @param {object} options Опции компонента
          * @return {object}
          */
         _getSubviewUsings: function (options) {
            var notWaiting = !options.waitingMode;
            var dataType = options.dataType;
            var isExcel = dataType === Area.DATA_TYPE_EXCEL;
            var parsers = options.parsers;
            return {
                sheet: notWaiting && isExcel,
                baseParams: notWaiting,
                provider: notWaiting && isExcel,
                providerArgs: notWaiting && isExcel && parsers !== null && !(parsers && !Object.keys(parsers).length),
                columnBinding: notWaiting && (isExcel || dataType === Area.DATA_TYPE_DBF),
                mapper: notWaiting && dataType === Area.DATA_TYPE_CML
            };
         },

         /*
          * Установить полный набор полей, к которым должны быть привязаны импортируемые данные
          *
          * @protected
          * @param {ImportTargetFields} fields Полный набор полей
          */
         _setFields: function (fields) {
            // TODO: Обдумать возможность выделения из fields массива hierarchy (с флагом joinHierarchy и последующим слиянием для нужного парсера)
            var err = _validateImportTargetFields(fields);
            if (err instanceof Error) {
               throw err;
            }
            var options = this._options;
            options.fields = fields;
            var views = this._views;
            //this._setSubviewValues('baseParams', {fields:fields});
            var sheetIndex = options.sheetIndex;
            var columnBindingMapping = options.columnBindingMapping;
            this._setSubviewValues('columnBinding', {fields:fields, mapping:columnBindingMapping ? columnBindingMapping[0 < sheetIndex ? sheetIndex : 0] || {} : {}});
            this._setSubviewValues('mapper', {fields:fields});
         },

         /*
          * Установить указанные настраиваемые значения у вложенного под-компонента, если он есть
          *
          * @protected
          * @param {string} name Мнемоническое имя под-компонента (в наборе _views)
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          */
         _setSubviewValues: function (name, values) {
            var view = this._views[name];
            if (view) {
               view.setValues(values);
            }
         },

         /*
          * Получить настраиваемые значения вложенного под-компонента, если он есть
          *
          * @protected
          * @param {string} name Мнемоническое имя под-компонента (в наборе _views)
          * @return {object}
          */
         _getSubviewValues: function (name) {
            var view = this._views[name];
            if (view) {
               if (name === 'providerArgs') {
                  // Получить значения из компонента настройки параметров провайдера парсинга
                  var current = view.getCurrentTemplateName();
                  if (current) {
                     var values;
                     view.getChildControls().some(function (v) { if (v._moduleName === current) { values = v.getValues(); return true; }; });
                     return values;
                  }
               }
               else {
                  return view.getValues();
               }
            }
         },

         /*
          * Проверить результаты
          *
          * @protected
          * @param {object} data Результирующие данные
          * @return {Core/Deferred}
          */
         _checkResults: function (data) {
            var validators = this._options.validators;
            var promise;
            if (validators && validators.length) {
               var errors = [];
               var warnings = [];
               var optionGetter = this._getOption.bind(this);
               for (var i = 0; i < validators.length; i++) {
                  var check = validators[i];
                  var args = check.params;
                  args = args && args.length ? args.slice() : [];
                  args.unshift(data, optionGetter);
                  var result = check.validator.apply(null, args);
                  if (result !== true) {
                     (check.noFailOnError ? warnings : errors).push(
                        result || check.errorMessage || rk('Неизвестная ошибка', 'НастройщикИмпорта')
                     );
                  }
               }
               if (errors.length) {
                  promise = Area.showMessage('error', rk('Исправьте пожалуйста', 'НастройщикИмпорта'), errors.join('\n'));
               }
               else
               if (warnings.length) {
                  promise = Area.showMessage('confirm', rk('Проверьте пожалуйста', 'НастройщикИмпорта'), warnings.join('\n') + '\n\n' + rk('Действительно импортировать так?', 'НастройщикИмпорта'));
               }
            }
            return promise || Deferred.success(true);
         },

         /*
          * Реализация команды "complete"
          *
          * @protected
          */
         _cmdComplete: function () {
            // TODO: хорошо бы вынести эту команду в родителя
            // Сформировать результирующие данные из всего имеющегося
            // И сразу прроверить их
            this.getValues(true).addCallback(function (data) {
               // И если всё нормально - завершить диалог
               if (data) {
                  this._notify('onComplete', /*ImportResults*/ data);
               }
               /*else {
                  // Иначе пользователь продолжает редактирование
               }*/
            }.bind(this));
         },

         /**
          * Установить указанные настраиваемые значения компонента
          *
          * @public
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          */
         setValues: function (values) {
            if (!values || typeof values !== 'object') {
               throw new Error('Object required');
            }
            if (!Object.keys(values).length) {
               return;
            }
            // Если при установке значений надились в режиме ожидания - сбросить его
            var options = this._options;
            if (options.waitingMode) {
               options.waitingMode = null;
            }
            this._setOptions(values);
            this._processOptions(options);
            var isUsedSubview = options._isUsedSubview
            var views = this._views;
            var needRebuild;
            for (var name in views) {
               if (isUsedSubview[name] !== !!views[name]) {
                  needRebuild = true;
                  break;
               }
            }
            if (needRebuild) {
               this.rebuildMarkup();
               this._init();
            }
            else {
               var scopes = options._scopes;
               for (var name in views) {
                  if (isUsedSubview[name]) {
                     if (name !== 'providerArgs') {
                        views[name].setValues(scopes[name]);
                     }
                     else {
                        this._updateProviderArgsView(scopes.provider.parser);
                     }
                  }
               }
            }
         },

         /*
          * Получить все результирующие данные
          *
          * @public
          * #param {boolean} withValidation Провести проверку данных перез возвратом
          * @return {Core/Deferred<ImportResults>}
          */
         getValues: function (withValidation) {
            var options = this._options;
            var dataType = options.dataType;
            var useSheets = dataType === Area.DATA_TYPE_EXCEL || dataType === Area.DATA_TYPE_DBF;
            var useMapping = dataType === Area.DATA_TYPE_CML;
            var data = {
               dataType: dataType,
               file: options.file
            };
            if (useSheets) {
               var results = this._results;
               var sheetIndex = options.sheetIndex;
               var useAllSheets = 0 <= sheetIndex;
               var sheets;
               if (useAllSheets) {
                  sheets = options.sheets.reduce(function (r, v, i) { r.push(this._combineResultSheet(results[i + 1], v, i)); return r; }.bind(this), []);
               }
               else {
                  sheets = [this._combineResultSheet(results[''])];
                  sheets[0].columnsCount = options.sheets[0].sampleRows[0].length;
                  //sheets[0].index = -1;// Все листы обрабатываются одинаково, не может быть определённого индекса
               }
               //data.sheetIndex = sheetIndex;
               data.sameSheetConfigs = !useAllSheets;
               data.sheets = sheets;
            }
            if (useMapping) {
               data.mapping = options.mapping.mapping;
            }
            var baseParams = this._getSubviewValues('baseParams');
            for (var name in baseParams) {
               data[name] = baseParams[name];
            }
            if (options.resultNotation && options.resultNotation.toLowerCase() === 'lowdash') {
               data = PropertyNames.camelCaseToLowDash(data);
            }
            return withValidation
               ?
                  // Прроверить собранные данные
                  this._checkResults(data).addCallback(function (isSuccess) {
                     return isSuccess ? data : null;
                  })
               :
                  // Вернуть сразу
                  Deferred.success(data);
         },

         /*
          * Скомбинировать из аргументов элемент выходного массива sheets
          *
          * @protected
          * @param {object} result Резудльтирующие значения, относящиеся к этому элементу
          * @param {object} [sheet] Опции, относящиеся к этому элементу (опционально)
          * @param {number} [index] Индекс этого элемента
          * @return {ImportSheet}
          */
         _combineResultSheet: function (result, sheet, index) {
            var provider = result.provider;
            var providerArgs = cMerge(provider.parser ? this._insertDefaultProviderArgsOptions({}, this._options, provider.parser) : {}, result.providerArgs || {});
            var columnBindingMapping = result.columnBinding.mapping;
            var item = {
               parser: provider.parser || null,
               skippedRows: provider.skippedRows,
               columns: Object.keys(columnBindingMapping).map(function (v) { return {index:columnBindingMapping[v], field:v}; })
            };
            if (provider.separator) {
               item.separator = provider.separator;
            }
            item.parserConfig = ['hierarchyName', 'hierarchyField', 'columns'].reduce(function (r, v) { r[v] = providerArgs[v] || null; return r; }, {});
            if (sheet) {
               item.name = sheet.name;
               item.columnsCount = sheet.sampleRows[0].length;
               item.sampleRows = sheet.sampleRows;

            }
            if (index !=/*Не !==*/ null && 0 <= index) {
               item.index = index;
            }
            return item;
         },

         /*
          * Обновить компонент провайдера парсинга
          *
          * @protected
          * @param {string} parserName Имя выбранного парсера
          */
         _updateProviderArgsView: function (parserName) {
            var view = this._views.providerArgs;
            if (view) {
               var options = this._options;
               var component = parserName ? options.parsers[parserName].component : null;
               if (component) {
                  view.setTemplate(component, this._getProviderArgsOptions(options, parserName, true));
               }
               else {
                  view.clearTemplate();
               }
               view.setVisible(!!component);
            }
         },

         /*
          * Получить полный набор опций для компонента провайдера парсинга
          *
          * @protected
          * @param {object} options Опции
          * @param {string} parserName Имя выбранного парсера
          * @return {object}
          */
         _getProviderArgsOptions: function (options, parserName) {
            var parsers = options.parsers;
            if (parsers) {
               var parser = options.parsers[parserName];
               if (parser) {
                  var values;
                  if (parser.component) {
                     var sheets = options.sheets;
                     var sheetIndex = options.sheetIndex;
                     values = {
                        dataType: options.dataType,
                        columnCount:sheets && sheets.length ? sheets[0 < sheetIndex ? sheetIndex : 0].sampleRows[0].length : 0
                     };
                     var parserArgs = parser.args;
                     if (parserArgs) {
                        values = cMerge(values, parserArgs);
                     }
                  }
                  return this._insertDefaultProviderArgsOptions(values || {}, options, parserName);
               }
            }
         },

         /*
          * Добавить в данные опции по умолчанию для компонента провайдера парсинга
          *
          * @protected
          * @param {object} data Данные
          * @param {object} options Опции
          * @param {string} parserName Имя выбранного парсера
          * @return {object}
          */
         _insertDefaultProviderArgsOptions: function (data, options, parserName) {
            var providerArgs = options.providerArgs;
            if (providerArgs) {
               var args = providerArgs[parserName];
               if (args) {
                  return cMerge(data, args);
               }
            }
            return data;
         },

         destroy: function () {
            Area.superclass.destroy.apply(this, arguments);
            var fieldsPromise = this._fieldsPromise;
            if (fieldsPromise && !fieldsPromise.isReady()) {
               fieldsPromise.cancel();
            }
         }
      });



      // Public constants:

      /**
       * Константы - Поддерживаемые типы данных
       *
       * @public
       * @static
       * @constant
       * @type {string}
       */
      Object.defineProperty(Area, 'DATA_TYPE_EXCEL', {value:_DATA_TYPE_EXCEL, enumerable:true});
      Object.defineProperty(Area, 'DATA_TYPE_DBF', {value:_DATA_TYPE_DBF, enumerable:true});
      Object.defineProperty(Area, 'DATA_TYPE_CML', {value:_DATA_TYPE_CML, enumerable:true});
      /**
       * Константы - Список всех поддерживаемых типов данных
       *
       * @public
       * @static
       * @constant
       * @type {Array<string>}
       */
      Object.defineProperty(Area, 'DATA_TYPES', {value:_DATA_TYPES, enumerable:true});


      // Public static methods:

      /**
       * Получить опции по умолчанию
       *
       * @public
       * @static
       * @return {object}
       */
      Area.getDefaultOptions = function () {
         return _DEFAULT_OPTIONS;
      };

      /**
       * Получить список имён всех собственных опций компонента
       *
       * @public
       * @static
       * @return {Array<string>}
       */
      Area.getOwnOptionNames = function () {
         return _OWN_OPTIONS_NAMES;
      };

      /**
       * Получить проверочную информацию о типах данных опций
       *
       * @public
       * @static
       * @return {object}
       */
      Area.getOptionTypes = function () {
         return _OPTION_TYPES;
      };

      /**
       * Показать сообщение пользователю
       *
       * @public
       * @static
       * @param {SBIS3.CONTROLS/SubmitPopup#SubmitPopupStatus} type Тип диалога (confirm, default, success, error)
       * @param {string} title Заголовок сообщения
       * @param {string} text Текст сообщения
       * @return {Core/Deferred}
       */
      Area.showMessage = function (type, title, text) {
         var isConfirm = type === 'confirm';
         var promise = new Deferred();
         var args = [{
            status: type,
            message: title,
            details: text
         }];
         if (isConfirm) {
            args.push(promise.callback.bind(promise, true), promise.callback.bind(promise, false));
         }
         else {
            args.push(promise.callback.bind(promise, null));
         }
         InformationPopupManager[isConfirm ? 'showConfirmDialog' : 'showMessageDialog'].apply(InformationPopupManager, args);
         return promise;
      };



      // Private methods:

      /**
       * Получить вложенный под-компонент, если он есть
       *
       * @private
       * @param {SBIS3.CONTROLS/ImportCustomizer/Area} self Этот объект
       * @param {string} name Имя вложенного под-компонента
       * @return {object}
       */
      var _getChildComponent = function (self, name) {
         if (self.hasChildControlByName(name)) {
            return self.getChildControlByName(name);
         }
      };

      /**
       * Проверить, соответствует ли аргумент определению типа {@link ImportRemoteCall}
       *
       * @private
       * @param {*} fields Аргумент
       * @param {boolean} normalize В случае успеха возвращать экземпляр SBIS3.CONTROLS/Utils/ImportExport/RemoteCall
       * @return {Error|*}
       */
      var _validateImportRemoteCall = function (call, normalize) {
         // Значение должно быть объектом
         if (!call || typeof call !== 'object') {
            return new Error('Object required');
         }
         // Если получится создать экземпляр RemoteCall - значит это {@link ImportRemoteCall}
         var instance, err;
         try { instance = new RemoteCall(call); } catch (ex) { err = ex; }
         return err || (normalize ? instance : call);
      };

      /**
       * Проверить, соответствует ли аргумент определению типа {@link ImportTargetFields}
       *
       * @private
       * @param {*} fields Аргумент
       * @return {Error|*}
       */
      var _validateImportTargetFields = function (fields) {
         // Значение должно быть объектом
         if (!fields || typeof fields !== 'object') {
            return new Error('Object required');
         }
         var items = fields.items;
         // Должно иметь свойство "items", являющееся рекордсетом или массивом объектов
         if (!items || !(
               (Array.isArray(items) && items.every(function (v) { return typeof v === 'object'; })) ||
               (items instanceof RecordSet)
            )) {
            return new Error('Wrong fields items');
         }
         // Если items не является рекордсетом, то должно иметь свойство "idProperty", являющееся не пустой строкой
         var idProperty = fields.idProperty;
         if (Array.isArray(items) ? (!idProperty || typeof idProperty !== 'string') : (idProperty && typeof idProperty !== 'string')) {
            return new Error('Wrong fields idProperty');
         }
         // Должно иметь свойство "displayProperty", являющееся не пустой строкой
         var displayProperty = fields.displayProperty;
         if (!displayProperty || typeof displayProperty !== 'string') {
            return new Error('Wrong fields displayProperty');
         }
         // Если есть свойство "parentProperty" - оно должно быть не пустой строкой
         var parentProperty = fields.parentProperty;
         if (parentProperty && typeof parentProperty !== 'string') {
            return new Error('Wrong fields parentProperty');
         }
         return fields;
      };



      return Area;
   }
);
