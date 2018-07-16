/**
 * Контрол "Область редактирования настройщика экспорта"
 *
 * Для того, чтобы возможно было использовать сохранямые и редактируемые пресеты (предустановленные сочетания параметров экспорта), необходимо подключить модуль 'SBIS3.ENGINE/Controls/ExportPresets/Loader'
 * Для того, чтобы возможно было использовать редактируемые стилевые эксель-файлы, необходимо подключить модуль 'PrintingTemplates/ExportFormatter/Excel'
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/Area
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/Area',
   [
      'Core/CommandDispatcher',
      'Core/core-merge',
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/ExportCustomizer/Constants',
      'SBIS3.CONTROLS/ExportCustomizer/_Executor',
      'SBIS3.CONTROLS/Utils/ImportExport/OptionsTool',
      /*'SBIS3.CONTROLS/Utils/InformationPopupManager',*/
      'WS.Data/Collection/RecordSet',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/Area',
      'css!SBIS3.CONTROLS/ExportCustomizer/Area',
      'SBIS3.CONTROLS/Button',
      'SBIS3.CONTROLS/ScrollContainer'
   ],

   function (CommandDispatcher, cMerge, CompoundControl, Constants, Executor, OptionsTool, /*InformationPopupManager,*/ RecordSet, tmpl) {
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
       * Инструмент обработки опций
       * @private
       * @type {SBIS3.CONTROLS/Utils/ImportExport/OptionsTool}
       */
      var optionsTool = new OptionsTool(Constants.OPTION_TYPES, Constants.DEFAULT_OPTIONS, Constants.SKIP_OWN_OPTIONS_NAMES);



      var Area = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ExportCustomizer/Area.prototype*/ {

         _dotTplFn: tmpl,
         $protected: {
            _options: {
               dialogMode: null,// {boolean} Отображать как часть диалога (опционально)

               /**
                * @cfg {string} Отображать в режиме ожидания (опционально)
                */
               waitingMode: null,
               /**
                * @cfg {string} Заголовок диалога настройщика экспорта (опционально)
                */
               dialogTitle: null,//Определено в шаблоне
               /**
                * @cfg {string} Подпись кнопки диалога применения результата редактирования (опционально)
                */
               dialogButtonTitle: null,//Определено в шаблоне
               /**
                * @cfg {string} Надпись на кнопке добавления нового пресета в под-компоненте "presets" (опционально)
                */
               presetAddNewTitle: null,
               /**
                * @cfg {string} Название для нового пресета в под-компоненте "presets" (опционально)
                */
               presetNewPresetTitle: null,
               /**
                * @cfg {string} Заголовок под-компонента "columnBinder" (опционально)
                */
               columnBinderTitle: null,
               /**
                * @cfg {string} Отображаемый текст при пустом списке соответствий в под-компоненте "columnBinder" (опционально)
                */
               columnBinderEmptyTitle: null,
               /**
                * @cfg {string} Заголовок под-компонента "formatter" (опционально)
                */
               formatterTitle: null,
               /**
                * @cfg {string} Заголовок меню выбора способа форматирования в под-компоненте "formatter" (опционально)
                */
               formatterMenuTitle: null,
               /**
                * @cfg {ExportServiceParams} Прочие параметры, необходимых для работы БЛ
                */
               serviceParams: null,
               /**
                * @cfg {boolean} Использовать пресеты (предустановленных настроек экспорта)
                */
               usePresets: null,
               /**
                * @cfg {Array<ExportPreset>} Список неизменяемых пресетов (предустановленных настроек экспорта) (опционально)
                */
               staticPresets: null,
               /**
                * @cfg {string} Пространство имён для сохранения пользовательских пресетов (опционально)
                */
               presetNamespace: null,
               /**
                * @cfg {string|number} Идентификатор пресета, который будет выбран в списке пресетов. Если будет указан пустое значение (null или пустая строка), то это будет воспринято как указание создать новый пустой пресет и выбрать его. Если значение не будет указано вовсе (или будет указано значение undefined), то это будет воспринято как указание выбрать пресет, который был выбран в прошлый раз (опционально)
                */
               selectedPresetId: null,
               /**
                * @cfg {Array<BrowserColumnInfo>|WS.Data/Collection/RecordSet<BrowserColumnInfo>} Список объектов с информацией о всех колонках в формате, используемом в браузере (опционально)
                */
               allFields: null,
               /**
                * @cfg {Array<string>} Список привязки колонок в экспортируемом файле к полям данных
                */
               fieldIds: null,
               /**
                * @cfg {object} Список отображаемых названий групп полей (если используются идентификаторы групп)
                */
               fieldGroupTitles: null,
               /**
                * @cfg {string} Uuid стилевого эксель-файла
                */
               fileUuid: null,
               /**
                * @cfg {Array<ExportValidator>} Список валидаторов результатов редактирования (опционально)
                */
               validators: null,
               /**
                * @cfg {ExportRemoteCall} Информация для вызова метода удалённого сервиса для отправки данных вывода (опционально)
                */
               outputCall: null,

               isTemporaryFile: null// {boolean} Текущее значение fileUuid в опциях указывает на временный файл
            },
            // Имя кнопки применения
            _BUTTON_NAME: 'controls-ExportCustomizer-Area__completeButton',
            // Список имён вложенных под-компонентов
            _SUBVIEW_NAMES: {
               presets: 'controls-ExportCustomizer-Area__presets',
               columnBinder: 'controls-ExportCustomizer-Area__body__columnBinder',
               formatter: 'controls-ExportCustomizer-Area__body__formatter'
            },
            // Кнопка применения
            _button: null,
            // Ссылки на вложенные под-компоненты
            _views: {},
            // Находимся в режиме редактирования
            _isEditMode: null
         },

         _modifyOptions: function () {
            var options = Area.superclass._modifyOptions.apply(this, arguments);
            if (!options.waitingMode) {
               this._processOptions(options);
            }
            return options;
         },

         /**
          * Провести обработку опций
          * @protected
          * @param {object} options Опции компонента
          */
         _processOptions: function (options) {
            optionsTool.resolveOptions(options, true);
            optionsTool.validateOptions(options, !options.dialogMode ? function (name, options) { return ['dialogTitle', 'dialogButtonTitle'].indexOf(name) === -1; } : null);
            this._reshapeOptions(options);
         },

         /**
          * Создать все необходимые дополнительные опции компонента
          * @protected
          * @param {object} options Опции компонента
          */
         _reshapeOptions: function (options) {
            var allFields = options.allFields;
            var presetsOptions;
            var usePresets = options.usePresets;
            if (usePresets) {
               var staticPresets = options.staticPresets;
               var hasStaticPresets = !!(staticPresets && staticPresets.length);
               var currentPreset;
               if (hasStaticPresets) {
                  var selectedPresetId = options.selectedPresetId;
                  if (selectedPresetId) {
                     options.staticPresets.some(function (v) { if (v.id === selectedPresetId) { currentPreset = v; } });
                  }
               }
               if (currentPreset) {
                  options.fieldIds = currentPreset.fieldIds.slice();
                  options.fileUuid = currentPreset.fileUuid;
               }
               presetsOptions = {
                  addNewTitle: options.presetAddNewTitle,
                  newPresetTitle: options.presetNewPresetTitle,
                  allFields: allFields,
                  statics: hasStaticPresets ? staticPresets.slice() : null,
                  namespace: options.presetNamespace,
                  selectedId: options.selectedPresetId
               };
            }
            var fieldIds = options.fieldIds;
            var fileUuid = options.fileUuid;
            if (!usePresets && fieldIds && fieldIds.length) {
               // Иногда, fieldIds содержат идентификаторы, отсутствующие в allFields, отбросить их
               var isRecordSet = allFields instanceof RecordSet;
               var len = fieldIds.length;
               fieldIds = fieldIds.filter(function (fieldId) {
                  return isRecordSet ? !!allFields.getRecordById(fieldId) : allFields.some(function (field) { return field.id === fieldId; });
               });
               if (len !== fieldIds.length) {
                  options.fieldIds = fieldIds;
               }
            }
            var serviceParams = options.serviceParams;
            options._scopes = {
               presets: presetsOptions,
               columnBinder: {
                  title: options.columnBinderTitle || undefined,
                  fieldGroupTitles: options.fieldGroupTitles || undefined,
                  allFields: allFields,
                  fieldIds: !usePresets && fieldIds && fieldIds.length ? fieldIds.slice() : undefined
               },
               formatter: {
                  title: options.formatterTitle,
                  menuTitle: options.formatterMenuTitle,
                  allFields: allFields,
                  fieldIds: !usePresets && fieldIds && fieldIds.length ? fieldIds.slice() : undefined,
                  fileUuid: !usePresets && fileUuid ? fileUuid : undefined,
                  serviceParams: serviceParams ? cMerge({}, serviceParams) : undefined
               }
            };
         },

         $constructor: function () {
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
            this._button = _getChildComponent(this, this._BUTTON_NAME);
            // Получить ссылки на имеющиеся под-компоненты
            this._collectViews();
            // Подписаться на необходимые события
            this._bindEvents();
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

         _bindEvents: function () {
            for (var name in this._views) {
               this._bindSubviewEvents(name);
            }
         },

         _bindSubviewEvents: function (name) {
            var view = this._views[name];
            if (view && !view.isDestroyed()) {
               var handlers = {
                  presets: this._onChangePresets,
                  columnBinder: this._onChangeColumnBinder,
                  formatter: this._onChangeFormatter
               };
               this.subscribeTo(view, 'onCommandCatch', function (handler, evtName, command/*, args*/) {
                  if (command === 'subviewChanged') {
                     var result = handler.apply(this, Array.prototype.slice.call(arguments, 3));
                     evtName.setResult(result || true);
                  }
               }.bind(this, handlers[name].bind(this)));
            }
         },

         /*
          * Обработчик "subviewChanged" для под-компонента "preset"
          *
          * @protected
          * @param {string} reason Причина или вид изменения
          * @param {*} [info] Дополнительные данные
          */
         _onChangePresets: function (reason/*, inf*/) {
            // Выбраны новые предустановленные настройки экспорта
            var views = this._views;
            var values = views.presets.getValues();
            var args = [].slice.call(arguments, 1);
            var options = this._options;
            var fieldIds = values.fieldIds;
            var fileUuid = values.fileUuid;
            var formatterValues, formatterMeta;
            switch (reason) {
               case 'create':
               case 'clone':
               case 'select':
                  options.fieldIds = fieldIds.slice();
                  views.columnBinder.restate({fieldIds:fieldIds.slice()}, {source:'presets', reason:reason, args:args});
               case 'edit':
                  var consumer = args[0];
                  var consumerUuid = consumer.patternUuid || consumer.fileUuid;
                  options.fileUuid = fileUuid || consumerUuid;
                  formatterValues = {fieldIds:fieldIds.slice(), fileUuid:fileUuid, consumerId:consumer.id, primaryUuid:consumerUuid};
                  formatterMeta = {reason:reason, args:args.slice(1)};
                  if (reason === 'edit') {
                     this._isEditMode = true;
                  }
                  else {
                     options.isTemporaryFile = null;
                  }
                  break;
               case 'editEnd':
                  formatterMeta = {reason:'transaction', args:args};
                  this._isEditMode = null;
                  options.isTemporaryFile = null;
                  break;
               case 'delete':
                  var deleteUuid = args[0].fileUuid;
                  if (deleteUuid) {
                     formatterMeta = {reason:reason, args:[deleteUuid]};
                  }
                  break;
            }
            var result = formatterValues || formatterMeta ? views.formatter.restate(formatterValues || {}, formatterMeta) : undefined;
            this._updateCompleteButton(fieldIds);
            return result;
         },

         /*
          * Обработчик "subviewChanged" для под-компонента "columnBinder"
          *
          * @protected
          * @param {*} [data] Дополнительные данные
          */
         _onChangeColumnBinder: function (data) {
            // Изменился набор экспортируемых полей
            var views = this._views;
            var values = views.columnBinder.getValues();
            var fieldIds = values.fieldIds;
            if (fieldIds) {
               this._options.fieldIds = fieldIds.slice();
               var meta = this._makeMeta('columnBinder', [].slice.call(arguments));
               var presetsView = views.presets;
               if (presetsView) {
                  presetsView.restate({fieldIds:fieldIds.slice()}, meta);
               }
               views.formatter.restate({fieldIds:fieldIds.slice()}, meta);
               this._updateCompleteButton(fieldIds);
               /*return true;*/
            }
         },

         /*
          * Обработчик "subviewChanged" для под-компонента "formatter"
          *
          * @protected
          * @param {*} [data] Дополнительные данные
          */
         _onChangeFormatter: function (data) {
            // Изменилось форматирование эксель-файла
            var views = this._views;
            var values = views.formatter.getValues();
            var fileUuid = values.fileUuid;
            if (fileUuid) {
               var options = this._options;
               options.fileUuid = fileUuid;
               options.isTemporaryFile = true;
               var presetsView = views.presets;
               if (presetsView) {
                  /*return*/ presetsView.restate({fileUuid:fileUuid}, this._makeMeta('formatter', [].slice.call(arguments)));
               }
            }
         },

         /*
          * Сформировать Мета-данные о событии
          *
          * @protected
          * @param {string} source Имя источника
          * @param {Array<*>} args Дополнительные данные
          * @return {object}
          */
         _makeMeta: function (source, args) {
            var meta = {source:source};
            if (args && args.length) {
               meta.reason = args[0];
               if (1 < args.length) {
                  meta.args = args.slice(1);
               }
            }
            return meta;
         },

         /*
          * Обновить состояние кнопки применения
          *
          * @protected
          * @param {Array<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
          */
         _updateCompleteButton: function (fieldIds) {
            var button = this._button;
            if (button) {
               // Показывать кнопку применения толко когда есть поля
               button.setVisible(!!(fieldIds && fieldIds.length));
            }
         },

         /*
          * Реализация команды "complete"
          *
          * @protected
          */
         _cmdComplete: function () {
            this.complete().addCallbacks(
               function (data) {
                  if (data) {
                     this._notify('onComplete', /*ExportResults:*/data);
                  }
                  /*else {
                     // Иначе пользователь продолжает редактирование
                  }*/
               }.bind(this),
               this._notify.bind(this, 'onFatalError', true)
            );
         },

         /*
          * Завершить работу с текущими данными
          *
          * @public
          * @return {Core/Deferred<ExportResults>}
          */
         complete: function () {
            return Executor.execute(this._options);
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
            if (!options.waitingMode) {
               this._processOptions(options);
            }
            var views = this._views;
            var needRebuild = !options.waitingMode ? (options.usePresets && !views.presets) || !views.columnBinder || !views.formatter : (options.usePresets && !!views.presets) || !!views.columnBinder || !!views.formatter;
            if (needRebuild) {
               this.rebuildMarkup();
               this._init();
            }
            else {
               var scopes = options._scopes;
               for (var name in views) {
                  views[name].restate(scopes[name]);
               }
            }
         },

         /*
          * Получить все результирующие данные
          *
          * @public
          * #param {boolean} withValidation Провести проверку данных перез возвратом
          * @return {Core/Deferred<ExportResults>}
          */
         getValues: function (withValidation) {
            return Executor.gatherValues(this._options, withValidation);
         }//,

         /*destroy: function () {
            Area.superclass.destroy.apply(this, arguments);
         }*/
      });



      // Public static methods:

      /**
       * Получить опции по умолчанию
       *
       * @public
       * @static
       * @return {object}
       */
      Area.getDefaultOptions = optionsTool.getDefaultOptions.bind(optionsTool);

      /**
       * Получить список имён всех собственных опций компонента
       *
       * @public
       * @static
       * @return {Array<string>}
       */
      Area.getOwnOptionNames = optionsTool.getOwnOptionNames.bind(optionsTool);

      /**
       * Получить проверочную информацию о типах данных опций
       *
       * @public
       * @static
       * @return {object}
       */
      Area.getOptionTypes = optionsTool.getOptionTypes.bind(optionsTool);

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
      /*Area.showMessage = function (type, title, text) {
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
      };*/



      // Private methods:

      /**
       * Удалить из массива указанные элементы
       *
       * @private
       * @param {Array<*>} list Массив элементов
       * @param {*} ...items Список удаляемых элементов (остальные аргументы)
       */
      var _arrayRemove = function (list/*, ...items*/) {
         var items = Array.prototype.slice.call(arguments, 1);
         for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var j = list.indexOf(item);
            if (j !== -1) {
               list.splice(j, 1);
            }
         }
      };

      /**
       * Получить вложенный под-компонент, если он есть
       *
       * @private
       * @param {SBIS3.CONTROLS/ExportCustomizer/Area} self Этот объект
       * @param {string} name Имя вложенного под-компонента
       * @return {object}
       */
      var _getChildComponent = function (self, name) {
         if (self.hasChildControlByName(name)) {
            return self.getChildControlByName(name);
         }
      };



      return Area;
   }
);
