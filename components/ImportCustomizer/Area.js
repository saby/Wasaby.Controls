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
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/Area',
      'css!SBIS3.CONTROLS/ImportCustomizer/Area',
      'SBIS3.CONTROLS/Button',
      'SBIS3.CONTROLS/ImportCustomizer/BaseParams/View',
      'SBIS3.CONTROLS/ImportCustomizer/ProviderArgs/View',
      'SBIS3.CONTROLS/ScrollContainer'
   ],

   function (CommandDispatcher, cMerge, Deferred, CompoundControl, InformationPopupManager, RecordSet, dotTplFn) {
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

         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Заголовок настройщика импорта (опционально)
                */
               title: null,//Определено в шаблоне
               /**
                * @cfg {string} Название кнопки применения результата редактирования (опционально)
                */
               applyButtonTitle: null,//Определено в шаблоне
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
               parsers: {},
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
               sheetIndex: null
            },
            // Список имён вложенных компонентов
            _childViewNames: {
               sheet: 'controls-ImportCustomizer-Area__sheet',
               baseParams: 'controls-ImportCustomizer-Area__baseParams',
               provider: 'controls-ImportCustomizer-Area__provider',
               providerArgs: 'controls-ImportCustomizer-Area__providerArgs',
               columnBinding: 'controls-ImportCustomizer-Area__columnBinding'
            },
            // Ссылки на вложенные компоненты
            _views: {
               sheet: null,
               baseParams: null,
               provider: null,
               providerArgs: null,
               columnBinding: null
            },
            // Обещание, разрешаемое полным набором полей (если в опциях они не заданы явно)
            _fieldsPromise: null,
            // Набор результирующих значений (по обастям данных)
            _results: null
         },

         _modifyOptions: function () {
            var options = Area.superclass._modifyOptions.apply(this, arguments);
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
            if (sheetIndex ==/*Не ===*/ null) {
               options.sheetIndex = sheetIndex = -1;
            }
            var sheet = sheets[0 < sheetIndex ? sheetIndex : 0];
            var parserName = sheet.parser;
            if (!parserName) {
               sheet.parser = parserName = options._defaultParserName;
            }
            options._parserName = parserName;
            options._skippedRows = 0 < sheet.skippedRows ? sheet.skippedRows : 0;
            options._parserSeparator = sheet.separator || '';
            options._providerArgsComponent = parsers[parserName].component || undefined;
            options._providerArgsOptions = this._getProviderArgsOptions(options, parserName, true);
            options._columnsBindingRows = hasSheets ? sheet.sampleRows : [];
            var fields = options.fields;
            if (fields instanceof Deferred) {
               this._fieldsPromise = fields;
               options.fields = null;
            }
            return options;
         },

         $constructor: function () {
            CommandDispatcher.declareCommand(this, 'complete', this._cmdComplete);
            this._publish('onComplete', 'onFatalError');
         },

         init: function () {
            Area.superclass.init.apply(this, arguments);
            for (var name in this._childViewNames) {
               this._views[name] = _getChildComponent(this, this._childViewNames[name]);
            }
            var options = this._options;
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
            var fields = this._fieldsPromise;
            if (fields) {
               var success = function (data) {
                  this._fieldsPromise = null;
                  this._setFields(data);
                  return data;
               }.bind(this);
               var fail = function (err) {
                  this._fieldsPromise = null;
                  this._notify('onFatalError', true, err);
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
            this._bindEvents();
         },

         _bindEvents: function () {
            this.subscribeTo(this._views.sheet, 'change', function (evtName, values) {
               // Изменилась область данных для импортирования
               var options = this._options;
               var views = this._views;
               var results = this._results;
               var sheetIndex = options.sheetIndex;
               var prevResult = results[0 <= sheetIndex ? sheetIndex + 1 : ''];
               prevResult.provider =  cMerge({}, views.provider.getValues());
               prevResult.providerArgs = cMerge({}, this._getProviderArgsValues());
               prevResult.columnBinding = cMerge({}, views.columnBinding.getValues());
               sheetIndex = values.sheetIndex;
               options.sheetIndex = sheetIndex;
               var nextResult = results[0 <= sheetIndex ? sheetIndex + 1 : ''];
               views.provider.setValues(nextResult.provider);
               this._updateProviderArgsView(nextResult.provider.parser);
               var sheets = options.sheets;
               views.columnBinding.setValues(cMerge({rows:sheets[0 < sheetIndex ? sheetIndex : 0].sampleRows}, nextResult.columnBinding));
            }.bind(this));
            this.subscribeTo(this._views.baseParams, 'change', function (evtName, values) {
               // Изменились основные параметры импортирования
               var fields = values.fields;
               if (fields) {
                  this._options.fields = fields;
                  this._views.columnBinding.setValues({fields:fields});
               }
            }.bind(this));
            this.subscribeTo(this._views.provider, 'change', function (evtName, values) {
               // Изменился выбор провайдера парсинга
               var sheetIndex = this._options.sheetIndex;
               var result = this._results[0 <= sheetIndex ? sheetIndex + 1 : ''];
               var parserName = values.parser;
               var skippedRows = values.skippedRows;
               if (parserName !== result.provider.parser) {
                  this._updateProviderArgsView(parserName);
               }
               result.provider = cMerge({}, values);
               result.columnBinding.skippedRows = skippedRows;
               this._views.columnBinding.setValues({skippedRows:skippedRows});
            }.bind(this));
            // Для компонента this._views.providerArgs подисываеися отдельно через обработчик в опциях
            this.subscribeTo(this._views.columnBinding, 'change', function (evtName, values) {
               // Изменилась привязка данных к полям базы
               var sheetIndex = this._options.sheetIndex;
               var result = this._results[0 <= sheetIndex ? sheetIndex + 1 : ''];
               var skippedRows = values.skippedRows;
               result.provider.skippedRows = skippedRows;
               result.columnBinding = cMerge({}, values);
               this._views.provider.setValues({skippedRows:skippedRows});
            }.bind(this));
         },

         /*
          * Обработчик события "change" для компонента this._views.providerArgs
          *
          * @protected
          */
         _onChangeProviderArgs: function (evtName, values) {
            // Изменились параметры провайдера парсинга
            var sheetIndex = this._options.sheetIndex;
            this._results[0 <= sheetIndex ? sheetIndex + 1 : ''].providerArgs = cMerge({}, values);
         },

         /*
          * Установить полный набор полей, к которым должны быть привязаны импортируемые данные
          *
          * @protected
          * @param {ImportTargetFields} fields Полный набор полей
          */
         _setFields: function (fields) {
            if (!fields || typeof fields !== 'object') {
               throw new Error('Wrong fields');
            }
            var items = fields.items;
            if (!items || !(
                  (Array.isArray(items) && items.every(function (v) { return typeof v === 'object'; })) ||
                  (items instanceof RecordSet)
               )) {
               throw new Error('Wrong fields items');
            }
            var idProperty = fields.idProperty;
            if (Array.isArray(items) ? (!idProperty || typeof idProperty !== 'string') : (idProperty && typeof idProperty !== 'string')) {
               throw new Error('Wrong fields idProperty');
            }
            var displayProperty = fields.displayProperty;
            if (!displayProperty || typeof displayProperty !== 'string') {
               throw new Error('Wrong fields displayProperty');
            }
            var parentProperty = fields.parentProperty;
            if (parentProperty && typeof parentProperty !== 'string') {
               throw new Error('Wrong fields parentProperty');
            }
            this._options.fields = fields;
            //this._views.baseParams.setValues({fields:fields});
            this._views.columnBinding.setValues({fields:fields});
         },

         /*
          * Проверить результаты
          *
          * @protected
          * @param {object} data Результирующие данные
          * @return {Core/Deferred}
          */
         _checkResults: function (data) {
            var promise = new Deferred();

            // TODO: Реализовать проверку, пока два пункта: fileds:required и предупреждение на baseParams:replaceAllData
            //promise.dependOn(Area.showMessage('confirm', rk('Проверка связи', 'НастройщикИмпорта'), rk('Всё нормально?', 'НастройщикИмпорта')));//^^^
            promise.callback(true);//^^^

            return promise;
         },

         /*
          * Реализация команды "complete"
          *
          * @protected
          */
         _cmdComplete: function () {
            // Сформировать результирующие данные из всего имеющегося
            var options = this._options;
            var views = this._views;
            var results = this._results;
            var sheetIndex = options.sheetIndex;
            var useAllSheets = 0 <= sheetIndex;
            var sheets;
            if (useAllSheets) {
               sheets = options.sheets.reduce(function (r, v, i) { r.push(this._combineResultSheet(results[i + 1], v, i)); return r; }.bind(this), []);
            }
            else {
               sheets = [this._combineResultSheet(results[''])];
            }
            var data = {
               dataType: options.dataType,
               file: options.file,
               //sheetIndex: sheetIndex,
               sameSheetConfigs: !useAllSheets,
               sheets: sheets
            };
            var baseParams = this._views.baseParams.getValues();
            for (var name in baseParams) {
               data[name] = baseParams[name];
            }
            // Прроверить их
            this._checkResults(data).addCallback(function (isSuccess) {
               // И если всё нормально - завершить диалог
               if (isSuccess) {
                  this._notify('onComplete', data);
               }
               /*else {
                  // Иначе пользователь продолжает редактирование
               }*/
            }.bind(this));
         },

         /*
          * Скомбинировать из аргументов элемент выходного массива sheets
          *
          * @protected
          * @param {object} result Резудльтирующие значения, относящиеся к этому элементу (опционально)
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
                  columnCount:sheets && sheets.length ? sheets[0 < sheetIndex ? sheetIndex : 0].sampleRows[0].length : 0,
                  handlers: {change:this._onChangeProviderArgs.bind(this)}
               };
               var args = parser.args;
               return args ? cMerge(values, args) : values;
            }
         },

         /*
          * Получить значения из компонента настройки параметров провайдера парсинга
          *
          * @protected
          * @return {object}
          */
         _getProviderArgsValues: function () {
            var values;
            var view = this._views.providerArgs;
            if (view) {
               var current = view.getCurrentTemplateName();
               if (current) {
                  view.getChildControls().some(function (v) { if (v._moduleName === current) { values = v.getValues(); return true; }; });
               }
            }
            return values;
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
       * Константа - Поддерживаемые типы данных
       *
       * @public
       * @static
       * @constant
       * @type {Array<string>}
       */
      Object.defineProperty(Area, 'DATA_TYPES', {value:['excel', 'dbf', 'cml'], enumerable:true});


      // Public static methods:

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

      var _getChildComponent = function (self, name) {
         if (self.hasChildControlByName(name)) {
            return self.getChildControlByName(name);
         }
      };



      return Area;
   }
);
