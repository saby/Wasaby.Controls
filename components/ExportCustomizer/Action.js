/**
 * Исполняемое действие "Настройщик экспорта"
 *
 * Для того, чтобы возможно было использовать сохранямые и редактируемые пресеты (предустановленные сочетания параметров экспорта), необходимо подключить модуль 'SBIS3.ENGINE/Controls/ExportPresets/Loader'
 * Для того, чтобы возможно было использовать редактируемые стилевые эксель-файлы, необходимо подключить модуль 'PrintingTemplates/ExportFormatter/Excel'
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/Action
 * @extends SBIS3.CONTROLS/Action
 */
define('SBIS3.CONTROLS/ExportCustomizer/Action',
   [
      'Core/core-merge',
      'Core/Deferred',
      'SBIS3.CONTROLS/Action',
      'SBIS3.CONTROLS/ExportCustomizer/Constants',
      'SBIS3.CONTROLS/ExportCustomizer/_Executor',
      'SBIS3.CONTROLS/Utils/ImportExport/OptionsTool',
      'SBIS3.CONTROLS/Utils/InformationPopupManager',
      'SBIS3.CONTROLS/WaitIndicator',
      'WS.Data/Di'
   ],

   function (cMerge, Deferred, Action, Constants, Executor, OptionsTool, InformationPopupManager, WaitIndicator, Di) {
      'use strict';

      /**
       * @typedef {object} BrowserColumnInfo Тип, содержащий информацию о колонке браузера (SBIS3.CONTROLS/Browser и его наследники)
       * @property {string} id Идентификатор колонки (как правило, имя поля в базе данных или БЛ)
       * @property {string} title Отображаемое название колонки
       * @property {string} [group] Идентификатор или название группы, к которой относится колонка (опционально)
       * @property {boolean} [fixed] Обязательная колонка (опционально)
       * @property {object} columnConfig Конфигурация колонки в формате, используемом компонентом SBIS3.CONTROLS/DataGridView
       */

      /**
       * @typedef {object} ExportServiceParams Тип, содержащий информацию о прочих параметрах, необходимых для работы БЛ
       * @property {string} MethodName Имя списочного метода, результат раболты которого будет сохранён в эксель-файл
       * @property {WS.Data/Entity/Record} [Filter] Параметры фильтрации для списочного метода (опционально)
       * @property {WS.Data/Entity/Record} [Pagination] Навигация для списочного метода (опционально)
       * @property {string} [HierarchyField] Название поля иерархии (опционально)
       * @property {string} FileName Название результирующего эксель-файла
       */

      /**
       * @typedef {object} ExportRemoteCall Тип, содержащий информацию для вызова удалённого сервиса для отправки данных вывода. Соответствует вспомогательному классу {@link SBIS3.CONTROLS/Utils/ImportExport/RemoteCall}
       * @property {string} endpoint Сервис, метод которого будет вызван
       * @property {string} method Имя вызываемого метода
       * @property {string} [idProperty] Имя свойства, в котором находится идентификатор (опционально, если вызову это не потребуется)
       * @property {object} [args] Аргументы вызываемого метода (опционально)
       * @property {function(object):object} [argsFilter] Фильтр аргументов (опционально)
       * @property {function(object):object} [resultFilter] Фильтр результатов (опционально)
       */

      /**
       * @typedef {object} ExportPreset Тип, содержащий информацию о предустановленных настройках экспорта
       * @property {string|number} id Идентификатор пресета
       * @property {string} title Отображаемое название пресета
       * @property {Array<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
       * @property {string} fileUuid Uuid стилевого эксель-файла
       */

      /**
       * @typedef {object} ExportValidator Тип, описывающий валидаторы результатов редактирования
       * @property {function(object, function):(boolean|string)} validator Функция проверки. Принимает два аргумента. Первый - объект с проверяемыми данными. Второй - геттер опции по её имени. Геттер позволяет получить доступ к опциям, которые есть в настройщике экспорта в момент валидации. Должна возвратить либо логическое значение, показывающее пройдена ли проверка, либо строку с сообщением об ошибке
       * @property {Array<*>} [params] Дополнительные аргументы функции проверки, будут добавлены после основных (опционально)
       * @property {string} [errorMessage] Сообщение об ошибке по умолчанию (опционально)
       * @property {boolean} [noFailOnError] Указывает на то, что если проверка не пройдена, это не является фатальным. В таком случае пользователю будет показан диалог с просьбой о подтверждении (опционально)
       */

      /**
       * @typedef {object} ExportResults Тип, содержащий информацию о результате редактирования
       * @property {Array<string>} fieldIds Список полей для колонок в экспортируемом файле
       * @property {Array<string>} columnTitles Список отображаемых названий колонок в экспортируемом файле
       * @property {string} fileUuid Uuid стилевого эксель-файла
       * @property {ExportServiceParams} serviceParams Прочие параметры, необходимых для работы БЛ
       */

      /**
       * Имя регистрации объекта, предоставляющего методы загрузки и сохранения пользовательских пресетов, в инжекторе зависимостей
       * @private
       * @type {string}
       */
      var _DI_STORAGE_NAME = 'ExportPresets.Loader';

      var ExportCustomizerAction = Action.extend([], /**@lends SBIS3.CONTROLS/ExportCustomizer/Action.prototype*/ {

         /**
          * @typedef {object} ExportResults Тип, содержащий информацию о результате редактирования
          * @property {*} [*] Базовые параметры экспортирования (опционально)
          */

         //_dotTplFn: null,
         $protected: {
            _options: {
            },
            _result: null
         },

         /**
          * Открыть настройщик экспорта. Возвращает обещание, которое будет разрешено после завершения редактирования пользователем. В случае, если
          * пользователь после редактирования нажал кнопку применения результата редактирования, то обещание будет разрешено результатом
          * редактирования. Если же пользователь просто закрыл настройщик кнопкой "Закрыть", то обещание будет разрешено значением null.
          *
          * Все параметры этого метода в точности соответствуют собственным опциям класса {@link SBIS3.CONTROLS/ExportCustomizer/Area}.
          * Любой из параметров этого метода может быть указан через шаблон в виде опции этого класса, если он известен на момент парсинга шаблона.
          *
          * @public
          * @param {object} options Входные аргументы("мета-данные") настройщика экспорта:
          * @param {string} [options.dialogTitle] Заголовок диалога настройщика экспорта (опционально)
          * @param {string} [options.dialogButtonTitle] Подпись кнопки диалога применения результата редактирования (опционально)
          * @param {string} [options.presetAddNewTitle] Надпись на кнопке добавления нового пресета в под-компоненте "presets" (опционально)
          * @param {string} [options.presetNewPresetTitle] Название для нового пресета в под-компоненте "presets" (опционально)
          * @param {string} [options.columnBinderTitle] Заголовок под-компонента "columnBinder" (опционально)
          * @param {string} [options.columnBinderColumnsTitle] Заголовок столбца колонок файла в таблице соответствия под-компонента "columnBinder" (опционально)
          * @param {string} [options.columnBinderFieldsTitle] Заголовок столбца полей данных в таблице соответствия под-компонента "columnBinder" (опционально)
          * @param {string} [options.columnBinderEmptyTitle] Отображаемый текст при пустом списке соответствий в под-компоненте "columnBinder" (опционально)
          * @param {string} [options.formatterTitle] Заголовок под-компонента "formatter" (опционально)
          * @param {string} [options.formatterMenuTitle] Заголовок меню выбора способа форматирования в под-компоненте "formatter" (опционально)
          * @param {ExportServiceParams} options.serviceParams Прочие параметры, необходимых для работы БЛ
          * @param {boolean} [options.usePresets] Использовать пресеты (предустановленных настроек экспорта) (опционально)
          * @param {Array<ExportPreset>} options.staticPresets Список пресетов (предустановленных настроек экспорта) (опционально)
          * @param {string} options.presetNamespace Пространство имён для сохранения пользовательских пресетов (опционально)
          * @param {string|number} options.selectedPresetId Идентификатор пресета, который будет выбран в списке пресетов. Если будет указан пустое значение (null или пустая строка), то это будет воспринято как указание создать новый пустой пресет и выбрать его. Если значение не будет указано вовсе (или будет указано значение undefined), то это будет воспринято как указание выбрать пресет, который был выбран в прошлый раз (опционально)
          * @param {Array<BrowserColumnInfo>|WS.Data/Collection/RecordSet<BrowserColumnInfo>} options.allFields Список объектов с информацией о всех колонках в формате, используемом в браузере
          * @param {Array<string>} options.fieldIds Список привязки колонок в экспортируемом файле к полям данных
          * @param {object} options.fieldGroupTitles Список отображаемых названий групп полей (если используются идентификаторы групп)
          * @param {string} options.fileUuid Uuid стилевого эксель-файла
          * @param {Array<ExportValidator>} options.validators Список валидаторов результатов редактирования (опционально)
          * @param {ExportRemoteCall} [options.outputCall] Информация для вызова метода удалённого сервиса для отправки данных вывода (опционально)
          * @param {boolean} [options.skipCustomization] Не открывать настройщик экспорта, начать экспорт сразу основываясь на предоставленных в опциях данных (опционально)
          * @param {Lib/Control/Control} [options.opener] Компонент, инициировавщий открытие настройщика экспорта. Используется в отсутствие опции skipCustomization (опционально)
          * @return {Deferred<ExportResults>}
          */
         execute: function (options) {
            return ExportCustomizerAction.superclass.execute.apply(this, arguments);
         },

         /**
          * Метод, выполняющий основное действие
          * @protected
          * @param {object} data Входные аргументы("мета-данные") настройщика экспорта (согласно описанию в методе {@link execute})
          */
         _doExecute: function (data) {
            if (!data || typeof data !== 'object') {
               throw new Error('No arguments');
            }
            if (this._result) {
               return Deferred.fail('Allready open');
            }
            var optionsTool = new OptionsTool(Constants.OPTION_TYPES, Constants.DEFAULT_OPTIONS, Constants.SKIP_OWN_OPTIONS_NAMES);
            var names = optionsTool.getOwnOptionNames();
            var defaults = this._options;
            var options = names.reduce(function (r, v) { var o = data[v]; r[v] = o !== undefined ? o : defaults[v]; return r; }, {});
            this._result = new Deferred();
            if (data.skipCustomization) {
               optionsTool.resolveOptions(options, true);
               optionsTool.validateOptions(options);
               this._prepareForImmediate(options).addCallback(function () {
                  Executor.execute(options).addCallbacks(
                     this._complete.bind(this, true),
                     this._completeWithError.bind(this, true)
                  );
               }.bind(this));
            }
            else {
               this._open(options, data.opener);
            }
            return this._result;
         },

         /*
          * Подготовиться к немедленному выполнению экспорта (без отккрытия диалога настройщика экспорта)
          *
          * @protected
          * @param {object} options Опции
          * @return {Core/Deferred}
          */
         _prepareForImmediate: function (options) {
            if (options.usePresets && !(options.fieldIds && options.fieldIds.length)) {
               var selectedPresetId = options.selectedPresetId;
               if (selectedPresetId) {
                  var _usePreset = function (presets) {
                     if (presets && presets.length) {
                        var preset; presets.some(function (v) { if (v.id === selectedPresetId) { preset = v; return true; }});
                        if (preset) {
                           options.fieldIds = preset.fieldIds;
                           options.fileUuid = preset.fileUuid;
                           return true;
                        }
                     }
                  };
                  if (!_usePreset(options.staticPresets) && Di.isRegistered(_DI_STORAGE_NAME)) {
                     var promise = new Deferred();
                     Di.resolve(_DI_STORAGE_NAME).load(options.presetNamespace).addCallback(function (customs) {
                        _usePreset(customs);
                        promise.callback();
                     });
                     return promise;
                  }
               }
            }
            return Deferred.success();
         },

         /**
          * Открыть область редактирования настройщика экспорта
          *
          * @protected
          * @param {object} options Входные аргументы("мета-данные") настройщика экспорта (согласно описанию в методе {@link execute})
          * @param {Lib/Control/Control} [opener] Компонент, инициировавщий открытие настройщика экспорта, если есть (опционально)
          */
         _open: function (options, opener) {
            var wiatIndicator = new WaitIndicator(null, rk('Загружается', 'НастройщикЭкспорта'), {overlay:'dark'}, 1000);
            require(['SBIS3.CONTROLS/ExportCustomizer/Area', 'Lib/Control/FloatArea/FloatArea'], function (Area, FloatArea) {
               wiatIndicator.remove();
               var componentOptions = cMerge({
                  dialogMode: true,
                  handlers: {
                     onComplete: this._onAreaComplete.bind(this),
                     onFatalError: this._onAreaError.bind(this)
                  }
               }, options);
               this._areaContainer = new FloatArea({
                  opener: opener || this,
                  direction: 'left',
                  animation: 'slide',
                  isStack: true,
                  autoCloseOnHide: true,
                  template: 'SBIS3.CONTROLS/ExportCustomizer/Area',
                  className: 'ws-float-area__block-layout controls-ExportCustomizer__area',
                  closeByExternalClick: true,
                  closeButton: true,
                  componentOptions: componentOptions,
                  handlers: {
                     onClose: this._onAreaClose.bind(this)
                  }
               });
               this._notify('onSizeChange');
               this.subscribeOnceTo(this._areaContainer, 'onAfterClose', this._notify.bind(this, 'onSizeChange'));
            }.bind(this));
         },

         /**
          * Встроенный обработчик ошибок, возникших в результате выполнения Deferred-a, возвращённого методом  _doExecute
          * @protected
          * @param {Error} error Ошибка
          * @param {object} options Входные аргументы("мета-данные") настройщика экспорта (согласно описанию в методе {@link execute})
          */
         /*_handleError: function (err, options) {
         },*/

         /*
          * Обработчик события "onComplete"
          *
          * @protected
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} data Данные события
          */
         _onAreaComplete: function (evtName, data) {
            this._complete(true, data);
         },

         /*
          * Обработчик события "onFatalError"
          *
          * @protected
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {boolean} withAlert Показать пользователю предупреждение об ошибке
          * @param {Error|string} err Ошибка
          */
         _onAreaError: function (evtName, withAlert, err) {
            this._completeWithError(withAlert, err);
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
            var result = this._result;
            this._result = null;
            if (result) {
               result.callback(null);
            }
         },

         /*
          * Завершить работу и вернуть результат
          *
          * @protected
          * @param {object} isSuccess Завершение является успешным, не ошибочным
          * @param {object} outcome Результат
          */
         _complete: function (isSuccess, outcome) {
            var result = this._result;
            this._result = null;
            if (this._areaContainer) {
               this._areaContainer.close();
            }
            if (isSuccess) {
               result.callback(outcome);
            }
            else {
               result.errback(outcome);
            }
         },

         /*
          * Завершить работу при возникновении ошибки
          *
          * @protected
          * @param {boolean} withAlert Показать пользователю предупреждение об ошибке
          * @param {Error|string} err Ошибка
          */
         _completeWithError: function (withAlert, err) {
            if (withAlert) {
               var promise = new Deferred();
               InformationPopupManager.showMessageDialog({
                  status: 'error',
                  message: rk('Ошибка', 'НастройщикЭкспорта'),
                  details: ((err && err.message ? err.message : err) || rk('При получении данных поизошла неизвестная ошибка', 'НастройщикЭкспорта')) +
                           '\n' + rk('Настройка экспорта будет прервана', 'НастройщикЭкспорта')
               }, promise.callback.bind(promise, null));
               promise.addCallback(this._complete.bind(this, false, err));
            }
            else {
               this._complete(false, err);
            }
         },

         /**
          * Отдать подписчикам событие и вернуть результат обработки, если есть. Если нет - вернуть результат редактирования
          * @protected
          * @param {object} options Входные аргументы("мета-данные") настройщика экспорта (согласно описанию в методе {@link execute})
          * @param {ExportResults} results Результат редактирования
          * @return {object|*}
          */
         _notifyOnExecuted: function (options, results) {
            return this._notify(this, 'onExecuted', options, results) || results;
         }
      });



      return ExportCustomizerAction;
   }
);
