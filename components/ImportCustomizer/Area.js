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
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/Utils/InformationPopupManager',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Type/descriptor',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/Area',
      'css!SBIS3.CONTROLS/ImportCustomizer/Area',
      'SBIS3.CONTROLS/Button',
      'SBIS3.CONTROLS/ImportCustomizer/BaseParams/View',
      'SBIS3.CONTROLS/ImportCustomizer/ProviderArgs/View',
      'SBIS3.CONTROLS/ScrollContainer'
   ],

   function (CommandDispatcher, cMerge, Deferred, CompoundControl, InformationPopupManager, RecordSet, DataType, dotTplFn) {
      'use strict';

      var Area = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ImportCustomizer/Area.prototype*/ {

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
          * @property {object} accordances Перечень соответствий специальный ключ поля - идентификатор варианта
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
          * @property {object} [mappingAccordances] Перечень соответствий специальный ключ поля - идентификатор варианта (опционально, когда применимо)
          * @property {*} [*] Базовые параметры импортирования (опционально)
          */

         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {boolean} Отображать как диалог (опционально)
                */
               dialogMode: null,
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
               allSheetsTitle: null,//Определено в шаблоне
               /**
                * @cfg {string} Заголовок для меню выбора соответсвия в колонках в под-компоненте привязки колонок (опционально)
                */
               bindingColumnCaption: null,//Определено в шаблоне
               /**
                * @cfg {string} Всплывающая подсказака в заголовке колонки в под-компоненте привязки колонок (опционально)
                */
               bindingColumnTitle: null,//Определено в шаблоне
               /**
                * @cfg {string} Тип импортируемых данных (excel и т.д.)
                */
               dataType: null,
               /**
                * @cfg {ImportFile} Информация об импортируемом файле (обязательно)
                */
               file: null,
               /**
                * @cfg {string} Класс компонента настройки параметоров импортирования (Опционально, если не указан - используется {@link SBIS3.CONTROLS/ImportCustomizer/BaseParams/View комполнент по умолчанию})
                */
               baseParamsComponent: 'SBIS3.CONTROLS/ImportCustomizer/BaseParams/View',
               /**
                * @cfg {object} Опции компонента настройки параметоров импортирования. Состав опций определяется {@link baseParamsComponent используемым компонентом} (опционально)
                */
               baseParams: {
                  //Заменять ли импортируемыми данными предыдущее содержимое базы данных полностью или нет (только обновлять и добавлять)
                  replaceAllData: false,
                  //Место назначения для импортирования (таблица в базе данных и т.п.)
                  destination: null
               },
               /**
                * @cfg {object<ImportParser>} Список всех доступных провайдеров парсинга импортируемых данных
                */
               parsers: null,
               /**
                * @cfg {ImportTargetFields|Core/Deferred<ImportTargetFields>} Полный набор полей, к которым должны быть привязаны импортируемые данные
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
                * @cfg {ImportMapping} Информацию о настройке соответствий значений
                */
               mapping: null,
               /**
                * @cfg {Array<ImportValidator>} Список валидаторов результатов редактирования
                */
               validators: null
            },
            // Список имён вложенных компонентов
            _subviewNames: {
               sheet: 'controls-ImportCustomizer-Area__sheet',
               baseParams: 'controls-ImportCustomizer-Area__baseParams',
               provider: 'controls-ImportCustomizer-Area__provider',
               providerArgs: 'controls-ImportCustomizer-Area__providerArgs',
               columnBinding: 'controls-ImportCustomizer-Area__columnBinding',
               mapper: 'controls-ImportCustomizer-Area__mapper'
            },
            // Ссылки на вложенные компоненты
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
            this._resolveOptions(options);
            this._validateOptions(options);
            options._isNeeds = this._getSubviewUsings(options);
            var sheets = options.sheets;
            var hasSheets = sheets && sheets.length;
            options._sheetsTitles = hasSheets ? sheets.map(function (v) {return v.name; }) : [];
            var parsers = options.parsers;
            var parserNames = Object.keys(parsers);
            var parserItems = parserNames.map(function (v) { var o = parsers[v]; return {id:v, title:o.title, order:o.order}; });
            parserItems.sort(function (v1, v2) { return v1.order - v2.order; });
            options._parserItems = parserItems;
            options._defaultParserName = parserItems[0].id;
            var sheetIndex = options.sheetIndex;
            if (hasSheets && (options.sameSheetConfigs || sheetIndex ==/*Не ===*/ null)) {
               options.sheetIndex = sheetIndex = -1;
            }
            var sheet = hasSheets ? sheets[0 < sheetIndex ? sheetIndex : 0] : null;
            var parserName = hasSheets ? sheet.parser : null;
            if (!parserName) {
               parserName = options._defaultParserName;
               if (hasSheets) {
                  sheet.parser = parserName;
               }
            }
            options._parserName = parserName;
            options._skippedRows = hasSheets && 0 < sheet.skippedRows ? sheet.skippedRows : 0;
            options._parserSeparator = hasSheets && sheet.separator ? sheet.separator : '';
            options._providerArgsComponent = parsers[parserName].component || undefined;
            options._providerArgsOptions = this._getProviderArgsOptions(options, parserName, true);
            options._columnsBindingRows = hasSheets ? sheet.sampleRows : [];
            var mapping = options.mapping;
            if (mapping) {
               options._mapperFieldFilter = mapping.fieldFilter;
               options._mapperFieldProperty = mapping.fieldProperty;
               options._mapperVariants = mapping.variants;
               options._mapperAccordances = mapping.accordances;
            }
            var fields = options.fields;
            if (fields instanceof Deferred) {
               this._fieldsPromise = fields;
               options.fields = null;
            }
            return options;
         },

         _resolveOptions: function (options) {
            var defaultOptions = Area.getDefaultOptions();
            for (var name in defaultOptions) {
               if (options[name] ==/*Не ===*/ null) {
                  options[name] = defaultOptions[name];
               }
            }
         },

         _validateOptions: function (options) {
            var typeValidators = Area.getOptionTypes();
            if (typeValidators) {
               var skip = [];
               if (!options.dialogMode) {
                  skip.push('dialogTitle', 'dialogButtonTitle');
               }
               var dataType = options.dataType;
               if (dataType === Area.DATA_TYPE_EXCEL || dataType === Area.DATA_TYPE_DBF) {
                  skip.push('mapping');
               }
               else
               if (dataType === Area.DATA_TYPE_CML) {
                  skip.push('allSheetsTitle', 'bindingColumnCaption', 'bindingColumnTitle', 'parsers', 'sheets', 'sheetIndex', 'sameSheetConfigs');
               }
               for (name in typeValidators) {
                  if (!skip.length || skip.indexOf(name) === -1) {
                     var validator = typeValidators[name];
                     if (validator) {
                        var err = validator(options[name]);
                        if (err instanceof Error) {
                           throw err;
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
            var options = this._options;
            // Получить ссылки на имеющиеся подкомпоненты
            for (var name in this._subviewNames) {
               if (options._isNeeds[name]) {
                  this._views[name] = _getChildComponent(this, this._subviewNames[name]);
               }
            }
            // Инициализировать результирующие данные
            var sheets = options.sheets;
            if (sheets && sheets.length) {
               var results = {};
               for (var i = 0; i < sheets.length; i++) {
                  var sheet = sheets[i];
                  var parserName = sheet.parser;
                  if (!parserName) {
                     sheet.parser = parserName = options._defaultParserName;
                  }
                  var skippedRows = 0 < sheet.skippedRows ? sheet.skippedRows : 0;
                  results[i + 1] = {
                     provider: {parser:parserName, skippedRows:skippedRows, separator:sheet.separator || ''},
                     providerArgs: this._getProviderArgsOptions(options, parserName, false),
                     columnBinding: {accordances:{}, skippedRows:skippedRows}
                  };
               }
               results[''] = cMerge({}, results[1]);
               this._results = results;
            }
            // Если поля представлены обещанием
            var fields = this._fieldsPromise;
            if (fields) {
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
            // Подписаться на необходимые события
            this._bindEvents();
         },

         _cmdSubviewChanged: function () {
         },

         _bindEvents: function () {
            var handlers = {
               sheet: this._onChangeSheet,
               baseParams: this._onChangeBaseParams,
               provider: this._onChangeProvider,
               providerArgs: this._onChangeProviderArgs,
               columnBinding: this._onChangeColumnBinding,
               mapper: this._onChangeMapper
            };
            var views = this._views;
            for (var name in views) {
               this.subscribeTo(views[name], 'onCommandCatch', function (handler, evtName, command/*, args*/) {
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
            var accordances = values.accordances;
            if (accordances) {
               this._options.mapping.accordances = accordances;
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

         /*
          * Получить список необходимости дочерних компонентов
          *
          * @protected
          * @param {object} options Опции компонента
          * @return {object}
          */
         _getSubviewUsings: function (options) {
            var dataType = options.dataType;
            var isExcel = dataType === Area.DATA_TYPE_EXCEL;
            return {
                sheet: isExcel,
                baseParams: true,
                provider: isExcel,
                providerArgs: isExcel,
                columnBinding: isExcel || dataType === Area.DATA_TYPE_DBF,
                mapper: dataType === Area.DATA_TYPE_CML
            };
         },

         /*
          * Установить полный набор полей, к которым должны быть привязаны импортируемые данные
          *
          * @protected
          * @param {ImportTargetFields} fields Полный набор полей
          */
         _setFields: function (fields) {
            var err = _validateImportTargetFields(fields);
            if (err instanceof Error) {
               throw err;
            }
            this._options.fields = fields;
            var views = this._views;
            //this._setSubviewValues('baseParams', {fields:fields});
            this._setSubviewValues('columnBinding', {fields:fields});
            this._setSubviewValues('mapper', {fields:fields});
         },

         /*
          * Установить указанные настраиваемые значения у дочернего компонента, если он есть
          *
          * @protected
          * @param {string} name Мнемоническое имя компонента (в наборе _views)
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          */
         _setSubviewValues: function (name, values) {
            var view = this._views[name];
            if (view) {
               view.setValues(values);
            }
         },

         /*
          * Получить настраиваемые значения дочернего компонента, если он есть
          *
          * @protected
          * @param {string} name Мнемоническое имя компонента (в наборе _views)
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
                  sheets[0].columnsCount = options.sheets[0].sampleRows[0].length;;
               }
               //data.sheetIndex = sheetIndex;
               data.sameSheetConfigs = !useAllSheets;
               data.sheets = sheets;
            }
            if (useMapping) {
               data.mappingAccordances = options.mapping.accordances;
            }
            var baseParams = this._getSubviewValues('baseParams');
            for (var name in baseParams) {
               data[name] = baseParams[name];
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
            var providerArgs = result.providerArgs;
            var columnBindingAccordances = result.columnBinding.accordances;
            var item = {
               parser: provider.parser,
               skippedRows: provider.skippedRows,
               columns: Object.keys(columnBindingAccordances).map(function (v) { return {index:columnBindingAccordances[v], field:v}; })
            };
            if (provider.separator) {
               item.separator = provider.separator;
            }
            if (providerArgs) {
               item.parserConfig = ['hierarchyField', 'columns'].reduce(function (r, v) { r[v] = providerArgs[v]; return r; }, {});
            }
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
          * @param {string} parser Имя выбранного парсера
          */
         _updateProviderArgsView: function (parserName) {
            var options = this._options;
            var component = options.parsers[parserName].component;
            var view = this._views.providerArgs;
            if (component) {
               view.setTemplate(component, this._getProviderArgsOptions(options, parserName, true));
            }
            else {
               view.clearTemplate();
            }
            view.setVisible(!!component);
         },

         /*
          * Получить получить набор опций для компонента провайдера парсинга
          *
          * @protected
          * @param {object} options Опции
          * @param {string} parser Имя выбранного парсера
          * @param {boolean} withHandler Вместе с обработчиками событий
          * @return {object}
          */
         _getProviderArgsOptions: function (options, parserName, withHandler) {
            var parser = options.parsers[parserName];
            if (parser && parser.component) {
               var sheets = options.sheets;
               var sheetIndex = options.sheetIndex;
               var values = {
                  columnCount:sheets && sheets.length ? sheets[0 < sheetIndex ? sheetIndex : 0].sampleRows[0].length : 0
               };
               var args = parser.args;
               return args ? cMerge(values, args) : values;
            }
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
       * @type {Array<string>}
       */
      Object.defineProperty(Area, 'DATA_TYPE_EXCEL', {value:'excel', enumerable:true});
      Object.defineProperty(Area, 'DATA_TYPE_DBF', {value:'dbf', enumerable:true});
      Object.defineProperty(Area, 'DATA_TYPE_CML', {value:'cml', enumerable:true});
      Object.defineProperty(Area, 'DATA_TYPES', {value:[Area.DATA_TYPE_EXCEL, Area.DATA_TYPE_DBF, Area.DATA_TYPE_CML], enumerable:true});


      // Public static methods:

      /**
       * Получить опции по умолчанию
       *
       * @public
       * @static
       * @return {object}
       */
      Area.getDefaultOptions = function () {
         return {
            parsers: {
               // TODO: Обдумать добавление поля applicable:Array<string> для указания типов данных (Excel или DBF)
               'InColumsHierarchyParser': {title:rk('в отдельной колонке', 'НастройщикИмпорта'), component:'SBIS3.CONTROLS/ImportCustomizer/ProviderArgs/View', order:10},
               'InLineGroupsHierarchyParser': {title:rk('в группировке строк', 'НастройщикИмпорта'), order:20},
               'InSeparateLineHierarchyParser': {title:rk('в отдельной строке', 'НастройщикИмпорта'), order:30}
            },
            validators: [
               {
                  validator: function (data, optionGetter) { return data.dataType === 'cml' || data.sheets.every(function (sheet) { return !!sheet.columns.length; }); },
                  errorMessage: rk('Не установлено соответсвие между колонками и полями', 'НастройщикИмпорта')
               }
            ]
         };
      };

      /**
       * Получить проверочную информацию о типах данных опций
       *
       * @public
       * @static
       * @return {object}
       */
      Area.getOptionTypes = function () {
         var typeIfDefined = function (type, name, value) {
            // Если значение есть - оно должно иметь указанный тип
            return value !=/*Не !==*/ null && typeof value !== type ? new Error('Wrong option "' + name + '"') : value;
         };
         return {
            dialogMode: typeIfDefined.bind(null, 'boolean', 'dialogMode'),
            dialogTitle: typeIfDefined.bind(null, 'string', 'dialogTitle'),
            dialogButtonTitle: typeIfDefined.bind(null, 'string', 'dialogButtonTitle'),
            allSheetsTitle: typeIfDefined.bind(null, 'string', 'allSheetsTitle'),
            bindingColumnCaption: typeIfDefined.bind(null, 'string', 'bindingColumnCaption'),
            bindingColumnTitle: typeIfDefined.bind(null, 'string', 'bindingColumnTitle'),
            dataType: DataType(String).required().oneOf(Area.DATA_TYPES),
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
                  return new Error('Wrong option "file"');
               }
               return file;
            },
            baseParamsComponent: typeIfDefined.bind(null, 'string', 'baseParamsComponent'),
            baseParams: typeIfDefined.bind(null, 'object', 'baseParams'),
            parsers: function (parsers) {
               // Должна быть опция "parsers" и она должна быть объектом
               if (!parsers || typeof parsers !== 'object') {
                  throw new Error('Wrong option "parsers"');
               }
               for (var name in parsers) {
                  // Каждый элемент набора parsers должно быть {@link ImportParser}
                  var v = parsers[name];
                  if (!(name &&
                        (typeof v === 'object') &&
                        (v.title && typeof v.title === 'string') &&
                        (!v.component || typeof v.component === 'string') &&
                        (!v.args || typeof v.args === 'object')
                     )) {
                     return new Error('Wrong parsers items');
                  }
               }
               return parsers;
            },
            fields: function (fields) {
               // Должна быть опция "fields" и являтся либо экземпляром Deferred, либо иметь тип ImportTargetFields
               return fields instanceof Deferred ? fields : _validateImportTargetFields(fields);
            },
            sheets: function (sheets) {
               // Для типа данных EXCEL или DBF должна быть опция "sheets" и быть не пустым массивом
               if (!sheets || !Array.isArray(sheets) || !sheets.length) {
                  return new Error('Option "sheets" required');
               }
               // И каждый элемент массива должен быть {@link ImportSheet}
               if (!sheets.every(function (v) { return (
                     typeof v === 'object' &&
                     (v.name && typeof v.name === 'string') &&
                     (v.sampleRows && Array.isArray(v.sampleRows) && v.sampleRows.length && v.sampleRows.every(function (v2) { return v2 && Array.isArray(v2) && v2.length && v2.length === v.sampleRows[0].length; }))
                  ); })) {
                  return new Error('Wrong option "sheets"');
               }
               return sheets
            },
            sheetIndex: typeIfDefined.bind(null, 'number', 'sheetIndex'),
            sameSheetConfigs: typeIfDefined.bind(null, 'boolean', 'sameSheetConfigs'),
            mapping: function (mapping) {
               // Для типа данных CML(CommerceML) должна быть опция "mapping", то она должна быть {link ImportMapping}
               if (!mapping || (typeof mapping !== 'object' ||
                     !(!mapping.fieldFilter || typeof mapping.fieldFilter === 'function') ||
                     !(!mapping.fieldProperty || typeof mapping.fieldProperty === 'string') ||
                     !(mapping.fieldFilter || mapping.fieldProperty) ||
                     !(!mapping.variants || typeof mapping.variants === 'object') ||
                     !(!mapping.accordances || typeof mapping.accordances === 'object')
                  )) {
                  return new Error('Wrong option "mapping"');
               }
               return mapping;
            },
            validators: function (validators) {
               // Если есть опция "validators", то она должна быть массивом
               if (validators && !Array.isArray(validators)) {
                  return new Error('Wrong validators');
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
                     return new Error('Wrong validators items');
                  }
               }
               return validators;
            }
         };
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
       * Получить дочерний компонент, если он есть
       *
       * @private
       * @param {SBIS3.CONTROLS/ImportCustomizer/Area} self Этот объект
       * @param {string} name Имя дочернего компонента
       * @return {object}
       */
      var _getChildComponent = function (self, name) {
         if (self.hasChildControlByName(name)) {
            return self.getChildControlByName(name);
         }
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
            return new Error('Wrong fields');
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
