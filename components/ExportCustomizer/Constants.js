/**
 * Набор констант, описывающих опции компонентов SBIS3.CONTROLS/ExportCustomizer/Action и SBIS3.CONTROLS/ExportCustomizer/Area
 *
 * @public
 */
define('SBIS3.CONTROLS/ExportCustomizer/Constants',
   [
      'SBIS3.CONTROLS/Utils/ImportExport/RemoteCall',
      'WS.Data/Collection/RecordSet',

      'i18n!SBIS3.CONTROLS/ExportCustomizer/Constants'
   ],

   function (RemoteCall, RecordSet) {
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

      var _typeIfDefined = function (type, value) {
         // Если значение есть - оно должно иметь указанный тип
         return value !=/*Не !==*/ null && typeof value !== type ? new Error('Value must be a ' + type) : value;
      };

      return /**@lends SBIS3.CONTROLS/ExportCustomizer/Constants.prototype*/{
         /**
          * Проверочная информация о типах данных опций
          *
          * @public
          * @type {object}
          */
         OPTION_TYPES: {
            dialogMode: _typeIfDefined.bind(null, 'boolean'),
            waitingMode: _typeIfDefined.bind(null, 'boolean'),
            dialogTitle: _typeIfDefined.bind(null, 'string'),
            dialogButtonTitle: _typeIfDefined.bind(null, 'string'),
            presetAddNewTitle: _typeIfDefined.bind(null, 'string'),
            presetNewPresetTitle: _typeIfDefined.bind(null, 'string'),
            columnBinderTitle: _typeIfDefined.bind(null, 'string'),
            columnBinderEmptyTitle: _typeIfDefined.bind(null, 'string'),
            formatterTitle: _typeIfDefined.bind(null, 'string'),
            formatterMenuTitle: _typeIfDefined.bind(null, 'string'),
            serviceParams: function (value) {
               // Должно быть значение
               if (!value) {
                  return new Error('Value required');
               }
               // и должна быть {@link ExportServiceParams}
               if (typeof value !== 'object' ||
                  !(value.MethodName && typeof value.MethodName === 'string') ||
                  !(value.Filter ==/*Не ===*/ null || typeof value.Filter === 'object') ||
                  !(value.Pagination ==/*Не ===*/ null || typeof value.Pagination === 'object') ||
                  !(value.HierarchyField ==/*Не ===*/ null || typeof value.HierarchyField === 'string') ||
                  !(value.FileName && typeof value.FileName === 'string')
               ) {
                  return new Error('Value must be an ExportServiceParams');
               }
               return value;
            },
            usePresets: _typeIfDefined.bind(null, 'boolean'),
            staticPresets: function (value) {
               // Если значение есть
               if (value) {
                  // оно должно быть массивом
                  if (!Array.isArray(value)) {
                     return new Error('Value must be array');
                  }
                  // И каждый элемент массива должен быть {@link ExportPreset}
                  if (!value.every(function (v) { return (
                        typeof v === 'object' &&
                        (v.id && (typeof v.id === 'string' || typeof v.id === 'number') &&
                        (v.title && typeof v.title === 'string') &&
                        (v.fieldIds && Array.isArray(v.fieldIds) && v.fieldIds.every(function (v2) { return !!v2 && typeof v2 === 'string'; }))) &&
                        (v.fileUuid && typeof v.fileUuid === 'string')
                     ); })) {
                     return new Error('Array items must be an ExportPreset');
                  }
               }
               return value;
            },
            presetNamespace: _typeIfDefined.bind(null, 'string'),
            presetAccessZone: _typeIfDefined.bind(null, 'string'),
            selectedPresetId: function (value) {
               // Если значение есть
               if (value) {
                  // оно должно быть строкой или числом
                  if (typeof value !== 'string' && typeof value !== 'number') {
                     return new Error('Value must be string or number');
                  }
               }
               return value;
            },
            allFields: function (value) {
               // Должно быть значение
               if (!value) {
                  return new Error('Value required');
               }
               // и быть не пустым массивом или рекодсетом
               if (!(Array.isArray(value) && value.length) && !(value instanceof RecordSet && value.getCount())) {
                  return new Error('Value must be none empty array or recordset');
               }
               var isRecordSet = value instanceof RecordSet;
               var list = isRecordSet ? value.getRawData() : value;
               // И каждый элемент массива (или рекодсета) должен быть {@link BrowserColumnInfo}. Но проверить достаточно только на актуальные здесь свойства
               if (!list.every(function (v) { return (
                     typeof v === 'object' &&
                     (v.id && typeof v.id === 'string') &&
                     (v.title && typeof v.title === 'string')
                  ); })) {
                  return new Error((isRecordSet ? 'RecordSet' : 'Array') + ' items must be a BrowserColumnInfo');
               }
               return value;
            },
            fieldIds: function (value) {
               // Если значение есть
               if (value) {
                  // оно должно быть массивом
                  if (!Array.isArray(value)) {
                     return new Error('Value must be array');
                  }
                  // И каждый элемент массива должен быть не пустой строкой
                  if (!value.every(function (v) { return !!v && typeof v === 'string'; })) {
                     return new Error('Array items must be none empty strings');
                  }
               }
               return value;
            },
            fieldGroupTitles: _typeIfDefined.bind(null, 'object'),
            fileUuid: _typeIfDefined.bind(null, 'string'),
            validators: function (value) {
               // Если значение есть, то оно должна быть массивом
               if (value && !Array.isArray(value)) {
                  return new Error('Value must be an Array');
               }
               if (value) {
                  // И каждый элемент массива должен быть {@link ExportValidator}
                  if (!value.every(function (v) { return (
                        typeof v === 'object' &&
                        (v.validator && typeof v.validator === 'function') &&
                        (!v.params || Array.isArray(params)) &&
                        (!v.errorMessage || typeof v.errorMessage === 'string') &&
                        (!v.noFailOnError || typeof v.noFailOnError === 'boolean')
                     ); })) {
                     return new Error('Value items must be an ExportValidator');
                  }
               }
               return value;
            },
            outputCall: function (value) {
               // Если значение есть
               if (value) {
                  // оно должно быть объектом
                  if (typeof value !== 'object') {
                     return new Error('Value must be an object');
                  }
                  // и должно быть {@link ExportRemoteCall} - если получится создать экземпляр RemoteCall - значит это {@link ExportRemoteCall}
                  var instance;
                  try {
                     instance = new RemoteCall(value);
                  }
                  catch (ex) {
                     return new Error('Value must be an ExportRemoteCall');
                  }
               }
               return value;
            }
         },

         /**
          * Значения опций по умолчанию
          *
          * @public
          * @type {object}
          */
         DEFAULT_OPTIONS: {
            validators: [{
               validator: function (data, optionGetter) { return !!(data.fieldIds && data.fieldIds.length); },
               errorMessage: rk('Не выбрано ни одной колонки для экспорта', 'НастройщикЭкспорта')
            }]
         },

         /**
          * Список имён собственных опций компонента, которые не должны входить в общий список (выдаваемый методом getOwnOptionNames)
          *
          * @public
          * @type {Array<string>}
          */
         SKIP_OWN_OPTIONS_NAMES: [
            'dialogMode',
            'waitingMode'
         ]
      };
   }
);
