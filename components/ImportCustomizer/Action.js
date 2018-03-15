/**
 * Класс контрола "Настройщик импорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/Dialog
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ImportCustomizer/Dialog',
   [
      'Core/core-merge',
      'Core/Deferred',
      'Lib/Control/FloatArea/FloatArea',
      'SBIS3.CONTROLS/CompoundControl',
      'WS.Data/Source/SbisService'
   ],

   function (cMerge, Deferred, FloatArea, CompoundControl, SbisService) {
      'use strict';

      var Dialog = CompoundControl.extend([], /**@lends SBIS3.CONTROLS/ImportCustomizer/Dialog.prototype*/ {

         /**
          * @typedef {object} ImportIOCall Тип, содержащий информацию для вызова удалённого сервиса для получения данных ввода или отправки данных вывода
          * @property {string} endpoint Сервис, метод которого будет вызван
          * @property {string} method Имя вызываемого метода
          * @property {*} methodArgs Аргументы вызываемого метода (в требуемой форме)
          * @property {function} [dataShaper] Формирователь применимой формы аргументов (опционально)
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
          * @property {string} [parser] Провайдер парсинга импортируемых данных
          * @property {number} [skippedRows] Количество пропускаемых строк в начале
          * @property {string} [separator] Символы-разделители
          */

         //_dotTplFn: null,
         $protected: {
            _options: {
               /**
                * @cfg {object<ImportParser>} Список доступных провайдеров парсинга импортируемых данных
                */
               parsers: {
                  'InColumsHierarchyParser': {title:rk('в отдельной колонке', 'НастройщикИмпорта'), component:'SBIS3.CONTROLS/ImportCustomizer/ProviderArgs/View', order:10},
                  'InLineGroupsHierarchyParser': {title:rk('в группировке строк', 'НастройщикИмпорта'), order:20},
                  'InSeparateLineHierarchyParser': {title:rk('в отдельной строке', 'НастройщикИмпорта'), order:30}
               }
            },
            _result: null,
            _resultHandler: null
         },

         /*$constructor: function () {
            this._publish('onOpen', 'onComplete');
         },*/

         /**
          * Открыть настройщик импорта. Возвращает обещание, которое будет разрешено после завершения редактирования пользователем. В случае, если
          * пользователь после редактирования нажал кнопку применения результата редактирования, то обещание будет разрешено результатом
          * редактирования. Если же пользователь просто закрыл настройщик кнопкой "Закрыть", то обещание будет разрешено значением null.
          *
          * @public
          * @param {object} options Опции настройщика:
          * @param {string} options.dataType Тип импортируемых данных (excel и т.д.)
          * @param {ImportFile} options.file Информация о файле с импортируемыми данными
          * @param {string} [options.baseParamsComponent] Класс компонента для настройки параметров импортирования (опционально)
          * @param {object} [options.baseParams] Опции компонента для настройки параметров импортирования (опционально)
          * @param {object<ImportParser>} options.parsers Список доступных провайдеров парсинга импортируемых данных
          * @param {object} options.fields ^^^
          * @param {Array<ImportSheet>} options.sheets Список объектов, представляющих имеющиеся области данных
          * @param {number} [options.sheetIndex] Индекс выбранной области данных (опционально)
          * @param {boolean} [options.sameSheetConfigs] Обрабатываются ли все области данных одинаково (опционально)
          * @param {ImportIOCall} [options.inputCall] Информация для вызова метода удалённого сервиса для получения данных ввода (опционально)
          * @param {ImportIOCall} [options.outputCall] Информация для вызова метода удалённого сервиса для отправки данных вывода (опционально)
          * @return {Deferred<object>}
          */
         open: function (options) {
            if (!options || typeof options !== 'object') {
               throw new Error('No arguments');
            }
            if (this._result) {
               return Deferred.fail('Allready open');
            }
            var inputCall = options.inputCall;
            if (inputCall && !this._isImportIOCall(inputCall)) {
               throw new Error('Wrong inputCall');
            }
            var outputCall = options.outputCall;
            if (outputCall && !this._isImportIOCall(outputCall)) {
               throw new Error('Wrong outputCall');
            }
            var opts = inputCall || outputCall ? Object.keys(options).reduce(function (r, v) { if (v !== 'inputCall' && v !== 'outputCall') { r[v] = options[v]; }; return r; }, {}) : options;
            this._result = new Deferred();
            if (inputCall) {
               this._beforeOpen(inputCall, opts);
            }
            else {
               this._open(opts);
            }
            if (outputCall) {
               this._resultHandler = this._afterOpen.bind(this, outputCall);
            }
            return this._result;
         },

         /**
          * Проверить, является ли аргумент {@link ImportIOCall}
          *
          * @protected
          * @param {ImportIOCall} call Информация для вызова метода удалённого сервиса
          * @return {boolean}
          */
         _isImportIOCall: function (call) {
            return !!call && (typeof call === 'object') &&
               (call.endpoint && typeof call.endpoint === 'string') &&
               (call.method && typeof call.method === 'string') &&
               (!call.dataShaper || typeof call.dataShaper === 'function');
         },

         /**
          * Вызвать метод удалённого сервиса для получения недостающих данных ввода, и затем вызвать метод {@link _open}
          *
          * @protected
          * @param {ImportIOCall} call Информация для вызова метода удалённого сервиса для получения данных ввода
          * @param {object} options Опции согласно описанию в методе {@link open}
          */
         _beforeOpen: function (call, options) {
            (new SbisService({endpoint:call.endpoint}))
               .call(call.method, call.methodArgs)
               .addCallbacks(
                  function (data) {
                     var shaper = call.dataShaper;
                     this._open(cMerge(options, shaper ? shaper(data) : data));
                  }.bind(this),
                  this._result.errback.bind(this._result)
               );
         },

         /**
          * Вызвать метод удалённого сервиса для отправки полученных выходных данных
          *
          * @protected
          * @param {ImportIOCall} call Информация для вызова метода удалённого сервиса для отправки выходных данных
          * @param {object} result Выходные данные настройщика импорта
          * @return {Core/Deferred}
          */
         _afterOpen: function (call, result) {
            var shaper = call.dataShaper;
            var args = cMerge({}, shaper ? shaper(result) : result);
            return (new SbisService({endpoint:call.endpoint}))
               .call(call.method, call.methodArgs)
               .addCallback(
                  function (data) {
                     //^^^ Преобразовать ???
                     return data;
                  }.bind(this)
               );
         },

         /**
          * Реализация метода {@link open}
          *
          * @protected
          * @param {object} options Опции согласно описанию в методе {@link open}
          */
         _open: function (options) {
            var dataType = options.dataType;
            // Если есть свойство "dataType" - оно должно быть строкой
            if (dataType && typeof dataType !== 'string') {
               throw new Error('Wrong dataType');
            }
            var file = options.file;
            // Должно быть свойство "file"
            if (!file) {
               throw new Error('File required');
            }
            // И свойство "file" должно быть {@link ImportFile}
            if (typeof file !== 'object' ||
               !(file.name && typeof file.name === 'string') ||
               !(file.url && typeof file.url === 'string') ||
               !(file.uuid && typeof file.uuid === 'string')) {
               throw new Error('Wrong file');
            }
            var baseParamsComponent = options.baseParamsComponent;
            // Если есть свойство "baseParamsComponent" - оно должно быть строкой
            if (baseParamsComponent && typeof baseParamsComponent !== 'string') {
               throw new Error('Wrong baseParamsComponent');
            }
            var baseParamsOptions = options.baseParams;
            // Если есть свойство "baseParams" - оно должно быть объектом
            if (baseParamsOptions && typeof baseParamsOptions !== 'object') {
               throw new Error('Wrong baseParams');
            }
            var parsers = options.parsers;
            // Если есть свойство "parsers"
            if (parsers) {
               // То оно должно быть объектом
               if (typeof parsers !== 'object') {
                  throw new Error('Wrong parsers');
               }
               // И каждое свойство объекта должно быть {@link ImportParser}
               for (var name in parsers) {
                  var v = parsers[name];
                  if (!(name &&
                        (typeof v === 'object') &&
                        (v.title && typeof v.title === 'string') &&
                        (!v.component || typeof v.component === 'string') &&
                        (!v.args || typeof v.args === 'object')
                        )) {
                     throw new Error('Wrong parsers items');
                  }
               }
            }
            var fields = options.fields;
            // Должно быть свойство "fields" и быть объектом
            if (!fields || typeof fields !== 'object') {
               throw new Error('Wrong fields');
            }
            var sheets = options.sheets;
            // Должно быть свойство "sheets" и быть не пустым массивом
            if (!sheets || !Array.isArray(sheets) || !sheets.length) {
               throw new Error('Sheets required');
            }
            // И каждый элемент массива должен быть {@link ImportSheet}
            if (!sheets.every(function (v) { return (
                  typeof v === 'object' &&
                  (v.name && typeof v.name == 'string') &&
                  (v.sampleRows && Array.isArray(v.sampleRows) && v.sampleRows.length && v.sampleRows.every(function (v2) { return v2 && Array.isArray(v2) && v2.length && v2.length === v.sampleRows[0].length; }))
                  ); })) {
               throw new Error('Wrong sheets');
            }
            var sheetIndex = options.sheetIndex;
            // Если есть свойство "sheetIndex", то оно должно быть числом
            if (sheetIndex !=/*Не !==*/ null && typeof sheetIndex !== 'number') {
               throw new Error('Wrong sheetIndex');
            }
            if (options.sameSheetConfigs) {
               sheetIndex = -1;
            }
            var defaults = this._options;
            var componentOptions = {
               title: options.title,
               applyButtonTitle: options.applyButtonTitle,
               allSheetsTitle: options.allSheetsTitle,
               bindingColumnCaption: options.bindingColumnCaption,
               bindingColumnTitle: options.bindingColumnTitle,
               dataType: dataType,
               file: file,
               baseParams: baseParamsOptions,
               parsers: parsers ? cMerge(cMerge({}, defaults.parsers), parsers) : defaults.parsers,
               fields: fields,
               sheets: sheets,
               sheetIndex: sheetIndex,
               handlers: {
                  onComplete: this._onAreaComplete.bind(this)
               }
            };
            if (baseParamsComponent) {
               componentOptions.baseParamsComponent = baseParamsComponent;
            }
            this._areaContainer = new FloatArea({
               opener: this,
               direction: 'left',
               animation: 'slide',
               isStack: true,
               autoCloseOnHide: true,
               parent: this,
               template: 'SBIS3.CONTROLS/ImportCustomizer/Area',
               className: 'ws-float-area__block-layout controls-ImportCustomizer__area',
               closeByExternalClick: true,
               closeButton: true,
               componentOptions: componentOptions,
               handlers: {
                  onClose: this._onAreaClose.bind(this)
               }
            });
            this._notify('onSizeChange');
            this.subscribeOnceTo(this._areaContainer, 'onAfterClose', this._notify.bind(this, 'onSizeChange'));
            //this._notify('onOpen');
         },

         /*
          * Обработчик события "onComplete"
          *
          * @protected
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} data Данные события
          */
         _onAreaComplete: function (evtName, data) {
            var result = this._result;
            var resultHandler = this._resultHandler;
            this._result = null;
            this._resultHandler = null;
            this._areaContainer.close();
            if (resultHandler) {
               result.dependOn(resultHandler(data));
            }
            else {
               result.callback(data);
            }
            //this._notify('onComplete');
         },

         /*
          * Обработчик события "onClose"
          *
          * @protected
          * @param {Core/EventObject} evtName Дескриптор события
          */
         _onAreaClose: function (evtName) {
            if (this._areaContainer) {
               this._areaContainer.destroy();
               this._areaContainer = null;
            }
            if (this._result) {
               this._result.callback(null);
               this._result = null;
               this._resultHandler = null;
            }
         }
      });



      return Dialog;
   }
);
