/**
 * Исполняемое действие "Настройщик экспорта"
 *
 * Для того, чтобы возможно было использовать сохранямые и редактируемые пресеты (предустановленные сочетания параметров экспорта), необходимо подключить модуль 'WS3ExportPresets/Loader'
 * Для того, чтобы возможно было использовать редактируемые стилевые эксель-файлы, необходимо подключить модуль 'PrintingTemplates/ExportFormatter/Excel'
 * 
 * Подробнее о настройке экспорта файлов можно прочитать в статье <a href="https://wi.sbis.ru/doc/platform/developmentapl/interface-development/component-infrastructure/actions/export-excel/">Экспорт реестра в Excel</a>.
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/Action
 * @author Спирин В.А.
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
       * @typedef {Object} BrowserColumnInfo Тип, содержащий информацию о колонке браузера (SBIS3.CONTROLS/Browser и его наследники)
       * @property {String} id Идентификатор колонки (как правило, имя поля в базе данных или БЛ)
       * @property {String} title Отображаемое название колонки.
       * @property {String} [group] Идентификатор или название группы, к которой относится колонка.
       * @property {Boolean} [fixed] Обязательная колонка.
       * @property {Object} columnConfig Конфигурация колонки в формате, используемом компонентом SBIS3.CONTROLS/DataGridView
       */

      /**
       * @typedef {Object} ExportServiceParams Тип, содержащий информацию о прочих параметрах, необходимых для работы БЛ.
       * @property {String} MethodName Имя <a href="https://wi.sbis.ru/doc/platform/developmentapl/service-development/service-contract/objects/blmethods/bllist/">списочного метода БЛ</a>, результат работы которого будет сохранён в Excel-файл.
       * Значение опции задаётся в формате "<Имя объекта БЛ>.<Имя списочного метода>".
       * @property {WS.Data/Entity/Record} [Filter] <a href="https://wi.sbis.ru/doc/platform/developmentapl/service-development/service-contract/objects/blmethods/bllist/declr/">Параметры фильтрации</a>.
       * 
       * Благодаря таким параметрам списочному методу можно передать дополнительные условия отбора записей. 
       * 
       * Следует понимать, что параметры фильтрации по умолчанию не обрабатываются списочным методом.
       * Параметры фильтрации могут быть использованы при создании условий фильтрации (опция "Filter Condition" в настройках самого метода БЛ, интерфейс Genie), которые создаются в конфигурации списочного метода. 
       * 
       * Значение опции передаётся в аргумент "Фильтр" при вызове списочного метода.
       * @property {WS.Data/Entity/Record} [Pagination] <a href="https://wi.sbis.ru/doc/platform/developmentapl/service-development/service-contract/objects/blmethods/bllist/declr/">Параметры навигации</a>.
       * 
       * Значение опции передаётся в аргумент "Навигация" при вызове списочного метода.
       * @property {String} [HierarchyField] Имя поля иерархии.
       * Если опция не задана, то реестр выгружается плоским списком без учёта <a href="https://wi.sbis.ru/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy">иерархических отношений записей</a>.
       * @property {String} FileName Имя экспортируемого Excel-файла. Расширение имени файла задавать не требуется.
       */

      /**
       * @typedef {Object} ExportRemoteCall Тип, содержащий информацию для вызова удалённого сервиса для отправки данных вывода. Соответствует вспомогательному классу {@link SBIS3.CONTROLS/Utils/ImportExport/RemoteCall}
       * @property {String} endpoint Сервис, метод которого будет вызван
       * @property {String} method Имя вызываемого метода
       * @property {String} [idProperty] Имя свойства, в котором находится идентификатор (опционально, если вызову это не потребуется)
       * @property {Object} [args] Аргументы вызываемого метода (опционально)
       * @property {function(object):object} [argsFilter] Фильтр аргументов (опционально)
       * @property {function(object):object} [resultFilter] Фильтр результатов (опционально)
       */

      /**
       * @typedef {Object} ExportPreset Тип, содержащий информацию о предустановленных настройках экспорта
       * @property {String|number} id Идентификатор пресета
       * @property {String} title Отображаемое название пресета
       * @property {Array.<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
       * @property {String} fileUuid Uuid стилевого эксель-файла
       */

      /**
       * @typedef {Object} ExportValidator Тип, описывающий валидаторы результатов редактирования
       * @property {function(object, function):(boolean|string)} validator Функция проверки. Принимает два аргумента. Первый - объект с проверяемыми данными. Второй - геттер опции по её имени. Геттер позволяет получить доступ к опциям, которые есть в настройщике экспорта в момент валидации. Должна возвратить либо логическое значение, показывающее пройдена ли проверка, либо строку с сообщением об ошибке
       * @property {Array<*>} [params] Дополнительные аргументы функции проверки, будут добавлены после основных (опционально)
       * @property {String} [errorMessage] Сообщение об ошибке по умолчанию (опционально)
       * @property {Boolean} [noFailOnError] Указывает на то, что если проверка не пройдена, это не является фатальным. В таком случае пользователю будет показан диалог с просьбой о подтверждении (опционально)
       */

      /**
       * @typedef {Object} ExportResults Тип, содержащий информацию о результате редактирования
       * @property {Array.<String>} fieldIds Список полей для колонок в экспортируемом файле
       * @property {Array.<String>} columnTitles Список отображаемых названий колонок в экспортируемом файле
       * @property {String} fileUuid 
       * @property {ExportServiceParams} serviceParams Прочие параметры, необходимых для работы БЛ.
       */

      /**
       * Имя регистрации объекта, предоставляющего методы загрузки и сохранения пользовательских пресетов, в инжекторе зависимостей
       * @private
       * @type {String}
       */
      var _DI_STORAGE_NAME = 'ExportPresets.Loader';

      var ExportCustomizerAction = Action.extend([], /**@lends SBIS3.CONTROLS/ExportCustomizer/Action.prototype*/ {

         /**
          * @typedef {Object} ExportResults Тип, содержащий информацию о результате редактирования
          * @property {*} [*] Базовые параметры экспортирования (опционально)
          */

         //_dotTplFn: null,
         $protected: {
            _options: {
            },
            _result: null
         },

         /**
          * @description Открыть диалог "Настройщик экспорта".
          *
          * Все параметры этого метода в точности соответствуют собственным опциям класса {@link SBIS3.CONTROLS/ExportCustomizer/Area}.
          * Любой из параметров этого метода может быть указан через TMPL-шаблон в виде опции этого класса, если он известен на момент парсинга шаблона.
          * 
          * Подробнее о настройке экспорта файлов можно прочитать в статье <a href="https://wi.sbis.ru/doc/platform/developmentapl/interface-development/component-infrastructure/actions/export-excel/">Экспорт реестра в Excel</a>.
          * @function
          * @param {Object} options Мета-данные, задающие конфигурацию для диалога.
          * @param {ExportServiceParams} options.serviceParams Прочие параметры, необходимых для работы БЛ
          * @param {Array.<ExportPreset>} options.staticPresets Список пресетов (предустановленных настроек экспорта).
          * @param {String} options.presetNamespace Пространство имён для сохранения пользовательских пресетов.
          * @param {String} options.presetAccessZone Зона доступа пользовательских пресетов (опционально)
          * @param {String|Number} options.selectedPresetId Идентификатор пресета, который будет выбран в списке пресетов. Если будет указан пустое значение (null или пустая строка), то это будет воспринято как указание создать новый пустой пресет и выбрать его. Если значение не будет указано вовсе (или будет указано значение undefined), то это будет воспринято как указание выбрать пресет, который был выбран в прошлый раз.
          * @param {Array.<BrowserColumnInfo>|WS.Data/Collection/RecordSet<BrowserColumnInfo>} options.allFields Список объектов с информацией о всех колонках в формате, используемом в браузере.
          * @param {Array.<String>} options.fieldIds Список привязки колонок в экспортируемом файле к полям данных
          * @param {Object} options.fieldGroupTitles Объект, в котором задаётся соответствие заголовка и идентификатора группы колонок.
          *
          * Формат объекта: "{<идентификатор>: <заголовок>}".
          *
          * В Редакторе колонок автоматически срабатывает группировка колонок по идентификаторам.
          * @param {String} options.fileUuid Uuid идентификатор шаблона, определяющего стилевое отображение экспортируемого Excel-файла.
          *
          * При открытии диалога "Настройщика экспорта" со Стандартным шаблоном конфигурации для экспортируемого файла задаются предустановленны настройки отображения колонок и ячеек.
          *
          * Когда в Редакторе экспорта по умолчанию не заданы выбранные колонки, то при их выборе автоматически выполняется запрос к сервису приложения для получение Формата отображения.
          *
          * Предполагается, что значение данной опции передаётся автоматически, а "ручная" конфигурация опции выполняется прикладным разработчиком крайне редко.
          * Однако для работы с такими шаблонами предусмотрено API, расположенное в сервисном модуле "ExcelExport" (принадлежит репозиторию <a href="https://git.sbis.ru/sbis/engine">SBIS.ENGINE</a>):
          *
          * - Excel.CreateTemplate(MethodName, Filter, Pagination, Fields, Titles, HierarchyField, FileName)
          * - Excel.UpdateTemplate(MethodName, Filter, Pagination, Fields, Titles, HierarchyField, FileName, TemplateId)
          * - Excel.DeleteTemplate(TemplateId)
          * - Excel.TemplateTitles(TemplateId)
          * - Excel.SaveCustom(MethodName, Filter, Pagination, Fields, Titles, HierarchyField, FileName, TemplateId, Sync)
          *
          * @param {Array.<ExportValidator>} options.validators Список валидаторов результатов редактирования.
          * @param {string} options.historyTarget Имя объекта истории (опционально)
          * @param {String} [options.dialogTitle] Заголовок.
          * @param {String} [options.dialogButtonTitle] Подпись кнопки диалога применения результата редактирования.
          * @param {String} [options.presetAddNewTitle] Надпись на кнопке добавления нового пресета в под-компоненте "presets".
          * @param {String} [options.presetNewPresetTitle] Название для нового пресета в под-компоненте "presets".
          * @param {String} [options.columnBinderTitle] Заголовок под-компонента "columnBinder".
          * @param {String} [options.columnBinderColumnsTitle] Заголовок столбца колонок файла в таблице соответствия под-компонента "columnBinder" (опционально)
          * @param {String} [options.columnBinderFieldsTitle] Заголовок столбца полей данных в таблице соответствия под-компонента "columnBinder".
          * @param {String} [options.columnBinderEmptyTitle] Отображаемый текст при пустом списке соответствий в под-компоненте "columnBinder".
          * @param {String} [options.formatterTitle] Заголовок под-компонента "formatter".
          * @param {String} [options.formatterMenuTitle] Заголовок меню выбора способа форматирования в под-компоненте "formatter".
          * @param {Boolean} [options.usePresets] Использовать пресеты (предустановленных настроек экспорта).
          * @param {ExportRemoteCall} [options.outputCall] Информация для вызова метода удалённого сервиса для отправки данных вывода.
          * @param {Boolean} [options.skipCustomization] Если опций установлена в true, то диалог "Настройщик экспорта" не будет открыт, а сразу начнётся экспорт в Excel файл.
          * Для эскпорта будут использованы те параметры, что переданы в при вызове метода execute().
          * @param {Lib/Control/Control} [options.opener] Экземпляр класса того компонента, который инициировал открытие "Настройщика экспорта".
          * Используется, если не передана опция options.skipCustomization.
          * @return {Deferred.<ExportResults>} Возвращает обещание, которое будет разрешено после завершения редактирования пользователем.
          * В случае, если пользователь после редактирования нажал кнопку применения результата редактирования, то обещание будет разрешено результатом редактирования.
          * Если же пользователь просто закрыл настройщик кнопкой "Закрыть", то обещание будет разрешено значением null.
          * @example
          * Пример 1. Конфигурация диалога "Настройщик экспорта" задана в JavaScript.
          * <pre>
          * // Подключаем на веб-страницу модули для экспорта реестра в Excel файл.
          * require(['SBIS3.CONTROLS/ExportCustomizer/Action', 'WS.Data/Entity/Record', 'WS.Data/Collection/RecordSet'], function(ExportAction, Record, RecordSet) {
          *
          * // Создаём экземпляр записи с конфигурацией параметров фильтрации.
          * // Один параметр с именем 'city' и значением 'Ярославль'.
          *  var filter = new Record({
          *     rawData: { city: 'Ярославль' }
          * });
          *
          * // Экземпляр записи с конфигурацией параметров навигации
          * var pagination = new Record({
          *    rawData: {
          *
          *       // Запросить записи 10-ой страницы.
          *       page: 10,
          *
          *       // По 20 записей на странице.
          *       pageSize: 20
          *    }
          * });
          *
          * // Набор колонок для Редактора колонок.
          * var allFieldsRecordSet = new RecordSet({
          *     rawData: [
          *        {
          *           id: 1,
          *           group: 'Base1'
          *           columnConfig: [
          *              {
          *                 title: 'Идентификатор',
          *                 field: '@Абонент'
          *              },{
          *                 title: 'ФИО',
          *                 field: 'ФИО'
          *              }
          *           ]
          *        },{
          *           id: 2,
          *           group: 'Base2'
          *           columnConfig: [{
          *              title: 'Дата_регистрации',
          *              field: 'Дата_регистрации'
          *           }]
          *        }
          *     ],
          *     idProperty: 'id'
          * });
          *
          * // Конфигурация Редактора экспорта и метода Excel.SaveCustom.
          * var options = {
          *
          *    // Параметры для вызова метода Excel.SaveCustom.
          *    serviceParams: {
          *       MethodName: 'Phonebook.List',
          *       FileName: 'Phonebook',
          *       Filter: filter,
          *       Pagination: pagination
          *    },
          *
          *    // Набор колонок для Редактора колонок.
          *    allFields: allFieldsRecordSet,
          *
          *    // Выбранные по умолчанию колонки.
          *    fieldIds: [1, 2],
          *
          *    // Устанавливаем заголовки для групп колонок.
          *    fieldGroupTitles: {
          *       'Base1': 'Основные данные абонента',
          *       'Base2': 'Дата'
          *    },
          *
          *    // Информация для вызова метода удалённого сервиса для отправки данных вывода.
          *    outputCall: {
          *       endpoint: 'Excel',
          *       method: 'SaveCustom',
          *       args: serviceParams,
          *       argsFilter: function (data) {
          *          return {Fields:data.fieldIds, Titles:data.columnTitles, TemplateId:data.fileUuid, Sync:false};
          *       }
          *    }
          * }
          *
          * // Начинаем выгрузку файла в Excel.
          * (new ExportAction()).execute(options);
          * });
          * </pre>
          *
          * Пример 2. Конфигурация задана декларативно в TMPL-файле.
          *
          * Конфигурации Редактора экспорта и метода Excel.SaveCustom могут быть описаны декларативно в разметке родительского компонента.
          * Тогда для экспорта файла достаточно вызвать метод execute() без аргументов.
          *
          * Опциям, переданным непосредственно в метод execute(), отдан больший приоритет над опциями в разметке. Их значения будут определять результирующую конфигурацию.
          *
          * TMPL-файл:
          * <pre>
          * <SBIS3.CONTROLS.ExportCustomizer.Action fieldIds="{{ [1, 2] }}">
          *     <ws:serviceParams MethodName="Phonebook.List" FileName="Phonebook">
          *         <ws:Filter city="Ярославль"/>
          *         <ws:Pagination page="{{ 10 }}" pageSize="{{ 20 }}" />
          *     </ws:serviceParams>
          *    <ws:allFields>
          *        <ws:Array>
          *            <ws:Object id="{{ 1 }}" group="Base1">
          *                 <ws:columnConfig>
          *                     <ws:Array>
          *                         <ws:Object title="Дата регистрации" field="Дата_регистрации" />
          *                     </ws:Array>
          *                 </ws:columnConfig>
          *             </ws:Object>
          *             <ws:Object id="{{ 2 }}" group="Base2">
          *                 <ws:columnConfig>
          *                     <ws:Array>
          *                         <ws:Object title="Идентификатор" field="@Идентификатор" />
          *                         <ws:Object title="ФИО" field="ФИО" />
          *                     </ws:Array>
          *                 </ws:columnConfig>
          *             </ws:Object>
          *         </ws:Array>
          *     </ws:allFields>
          *     <ws:fieldGroupTitles Base1="Основные данные абонента" Base2="Дата" />
          * </SBIS3.CONTROLS.ExportCustomizer.Action>
          * </pre>
          *
          * JavaScript-файл:
          * <pre>
          * // Подключаем на страницу модуль, в котором описано действие экспорта файла.
          * require(['SBIS3.CONTROLS/ExportCustomizer/Action'], function(ExportAction) {
          *
          * // Начинаем выгрузку файла в Excel.
          * (new ExportAction()).execute({});
          * });
          * </pre>
          */
         execute: function (options) {
            return ExportCustomizerAction.superclass.execute.apply(this, arguments);
         },

         /**
          * Метод, выполняющий основное действие
          * @protected
          * @param {Object} data Входные аргументы("мета-данные") настройщика экспорта (согласно описанию в методе {@link execute})
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
               this._immediate(options, optionsTool);
            }
            else {
               this._open(options, data.opener);
            }
            return this._result;
         },

         /*
          * Выполнить экспорт немедленно (без отккрытия диалога настройщика экспорта)
          *
          * @protected
          * @param {Object} options Опции
          * @param {SBIS3.CONTROLS/Utils/ImportExport/OptionsTool} optionsTool Инструмент для работы с опциями
          */
         _immediate: function (options, optionsTool) {
            optionsTool.resolveOptions(options, true);
            optionsTool.validateOptions(options);
            this._prepareForImmediate(options).addCallback(function () {
               Executor.execute(options).addCallbacks(
                  this._complete.bind(this, true),
                  this._completeWithError.bind(this, true)
               );
            }.bind(this));
         },

         /*
          * Подготовиться к немедленному выполнению экспорта (без отккрытия диалога настройщика экспорта)
          *
          * @protected
          * @param {Object} options Опции
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
                     Di.resolve(_DI_STORAGE_NAME).load(options.presetNamespace/*, options.presetAccessZone*/).addCallback(function (customs) {
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
          * @param {Object} options Входные аргументы("мета-данные") настройщика экспорта (согласно описанию в методе {@link execute})
          * @param {Lib/Control/Control} [opener] Компонент, инициировавщий открытие настройщика экспорта, если есть (опционально)
          */
         _open: function (options, opener) {
            var wiatIndicator = new WaitIndicator(null, rk('Загружается', 'НастройщикЭкспорта'), {overlay:'dark'}, 1000);
            require([
               'Controls/Popup/Compatible/Layer',
               'SBIS3.CONTROLS/Action/OpenDialog',
               'SBIS3.CONTROLS/ExportCustomizer/Area'
            ], function (CompatibleLayer, OpenDialogAction) {
               CompatibleLayer.load().addCallback(function () {
                  if (!this._openDialogAction) {
                     this._openDialogAction = new OpenDialogAction({
                        mode: 'floatArea',
                        template: 'SBIS3.CONTROLS/ExportCustomizer/Area'
                     })
                  }
                  wiatIndicator.remove();
                  var needDelay = options.usePresets && !options.selectedPresetId;
                  var componentOptions = cMerge({
                     name: 'controls-ExportCustomizer__area',
                     enabled: !needDelay,
                     //waitingMode: needDelay,
                     dialogMode: true,
                     handlers: {
                        onComplete: this._onAreaComplete.bind(this),
                        onFatalError: this._onAreaError.bind(this)
                     }
                  }, options);
                  var handlers = {
                     onClose: this._onAreaClose.bind(this)
                  };
                  if (needDelay) {
                     handlers.onAfterShow = function (evt) {
                        evt.getTarget().getChildControlByName('controls-ExportCustomizer__area').setEnabled(true);
                     };
                  }
                  this._openDialogAction.execute({
                     dialogOptions: {
                        opener: opener || this,
                        direction: 'left',
                        animation: 'slide',
                        isStack: true,
                        autoCloseOnHide: true,
                        className: 'ws-float-area__block-layout controls-ExportCustomizer__area',
                        closeByExternalClick: true,
                        closeButton: true,
                        handlers: handlers
                     },
                     componentOptions: componentOptions
                  });
               }.bind(this));
            }.bind(this));
         },

         /**
          * Встроенный обработчик ошибок, возникших в результате выполнения Deferred-a, возвращённого методом  _doExecute
          * @protected
          * @param {Error} error Ошибка
          * @param {Object} options Входные аргументы("мета-данные") настройщика экспорта (согласно описанию в методе {@link execute})
          */
         /*_handleError: function (err, options) {
         },*/

         /*
          * Обработчик события "onComplete"
          *
          * @protected
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {Object} data Данные события
          */
         _onAreaComplete: function (evtName, data) {
            this._complete(true, data);
         },

         /*
          * Обработчик события "onFatalError"
          *
          * @protected
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {Boolean} withAlert Показать пользователю предупреждение об ошибке
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
          * @param {Object} isSuccess Завершение является успешным, не ошибочным
          * @param {Object} outcome Результат
          */
         _complete: function (isSuccess, outcome) {
            var result = this._result;
            this._result = null;
            if (this._openDialogAction) {
               this._openDialogAction.closeDialog();
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
          * @param {Boolean} withAlert Показать пользователю предупреждение об ошибке
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
          * @param {Object} options Входные аргументы("мета-данные") настройщика экспорта (согласно описанию в методе {@link execute})
          * @param {ExportResults} results Результат редактирования
          * @return {object|*}
          */
         _notifyOnExecuted: function (options, results) {
            return this._notify(this, 'onExecuted', options, results) || results;
         },

         destroy: function () {
            if (this._openDialogAction) {
               this._openDialogAction.destroy();
               this._openDialogAction = null;
            }
         }
      });



      return ExportCustomizerAction;
   }
);
