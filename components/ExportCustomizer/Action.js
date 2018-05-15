/**
 * Исполняемое действие "Настройщик экспорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/Action
 * @extends SBIS3.CONTROLS/Action
 */
define('SBIS3.CONTROLS/ExportCustomizer/Action',
   [
      'Core/core-merge',
      'Core/Deferred',
      'Lib/Control/FloatArea/FloatArea',
      'SBIS3.CONTROLS/Action',
      'SBIS3.CONTROLS/ExportCustomizer/Area'
   ],

   function (cMerge, Deferred, FloatArea, Action, Area) {
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
       * @typedef {object} ExportPreset Тип, содержащий информацию о преустановленных настройках экспорта
       * @property {string|number} id Идентификатор пресета
       * @property {string} title Отображаемое название пресета
       * @property {Array<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
       * @property {string} fileUuid Uuid шаблона форматирования эксель-файла
       */

      /**
       * @typedef {object} ExportResults Тип, содержащий информацию о результате редактирования
       * @property {string} MethodName Имя списочного метода, результат раболты которого будет сохранён в эксель-файл
       * @property {WS.Data/Entity/Record} [Filter] Параметры фильтрации для списочного метода (опционально)
       * @property {WS.Data/Entity/Record} [Pagination] Навигация для списочного метода (опционально)
       * @property {string} [HierarchyField] Название поля иерархии (опционально)
       * @property {string} FileName Название результирующего эксель-файла
       * @property {Array<string>} Fields Список полей для колонок в экспортируемом файле
       * @property {Array<string>} Titles Список отображаемых названий колонок в экспортируемом файле
       * @property {string} TemplateId Uuid шаблона форматирования эксель-файла
       */

      var ExportCustomizerAction = Action.extend([], /**@lends SBIS3.CONTROLS/ExportCustomizer/Action.prototype*/ {

         /**
          * @typedef {object} ExportResults Тип, содержащий информацию о результате редактирования
          * @property {*} [*] Базовые параметры экспортирования (опционально)
          */

         //_dotTplFn: null,
         $protected: {
            _options: {
            },
            _result: null,
            _resultHandler: null
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
          * @param {string} [options.columnBinderTitle] Заголовок под-компонента "columnBinder" (опционально)
          * @param {string} [options.columnBinderColumnsTitle] Заголовок столбца колонок файла в таблице соответствия под-компонента "columnBinder" (опционально)
          * @param {string} [options.columnBinderFieldsTitle] Заголовок столбца полей данных в таблице соответствия под-компонента "columnBinder" (опционально)
          * @param {string} [options.columnBinderEmptyTitle] Отображаемый текст при пустом списке соответствий в под-компоненте "columnBinder" (опционально)
          * @param {string} [options.formatterTitle] Заголовок под-компонента "formatter" (опционально)
          * @param {string} [options.formatterMenuTitle] Заголовок меню выбора способа форматирования в под-компоненте "formatter" (опционально)
          * @param {ExportServiceParams} options.serviceParams Прочие параметры, необходимых для работы БЛ
          * @param {Array<ExportPreset>} options.staticPresets Список пресетов (предустановленных настроек экспорта)
          * @param {string} options.presetNamespace Пространство имён для сохранения пользовательских пресетов
          * @param {string|number} options.selectedPresetId Идентификатор пресета, который будет выбран в списке пресетов
          * @param {Array<BrowserColumnInfo>|WS.Data/Collection/RecordSet<BrowserColumnInfo>} options.allFields Список объектов с информацией о всех колонках в формате, используемом в браузере
          * @param {Array<string>} options.fieldIds Список привязки колонок в экспортируемом файле к полям данных
          * @param {object} options.fieldGroupTitles Список отображаемых названий групп полей (если используются идентификаторы групп)
          * @param {string} options.fileUuid Uuid шаблона форматирования эксель-файла
          * @param {ExportRemoteCall} [options.outputCall] Информация для вызова метода удалённого сервиса для отправки данных вывода (опционально)
          * @return {Deferred<ExportResults>}
          */
         execute: function (options) {
            return ExportCustomizerAction.superclass.execute.apply(this, arguments);
         },

         /**
          * Метод, выполняющий основное действие
          * @protected
          * @param {object} options Входные аргументы("мета-данные") настройщика экспорта (согласно описанию в методе {@link execute})
          */
         _doExecute: function (options) {
            if (!options || typeof options !== 'object') {
               throw new Error('No arguments');
            }
            if (this._result) {
               return Deferred.fail('Allready open');
            }
            var inputCall = options.inputCall;
            if (inputCall) {
               inputCall = new RemoteCall(inputCall);
            }
            var outputCall = options.outputCall;
            if (outputCall) {
               outputCall = new RemoteCall(outputCall);
            }
            var opts = inputCall || outputCall ? Object.keys(options).reduce(function (r, v) { if (v !== 'inputCall' && v !== 'outputCall') { r[v] = options[v]; }; return r; }, {}) : options;
            this._result = new Deferred();
            if (inputCall) {
               inputCall.call(opts).addCallbacks(
                  function (data) {
                     this._open(cMerge(opts, data));
                  }.bind(this),
                  this._completeWithError.bind(this, true, rk('При анализе файла поизошла ошибка', 'НастройщикЭкспорта'))
               );
            }
            else {
               this._open(opts);
            }
            if (outputCall) {
               this._resultHandler = outputCall.call.bind(outputCall);
            }
            return this._result;
         },

         /**
          * Открыть область редактирования настройщика экспорта
          *
          * @protected
          * @param {object} options Входные аргументы("мета-данные") настройщика экспорта (согласно описанию в методе {@link execute})
          */
         _open: function (options) {
            var componentOptions = {
               dialogMode: true,
               handlers: {
                  onComplete: this._onAreaComplete.bind(this),
                  onFatalError: this._onAreaError.bind(this)
               }
            };
            var defaults = this._options;
            Area.getOwnOptionNames().forEach(function (name) {
               var value = options[name];
               componentOptions[name] = value !=/*Не !==*/ null ? value : defaults[name];
            });
            this._areaContainer = new FloatArea({
               opener: this,
               direction: 'left',
               animation: 'slide',
               isStack: true,
               autoCloseOnHide: true,
               //parent: this,
               template: 'SBIS3.CONTROLS/ExportCustomizer/Area',
               className: 'ws-float-area__block-layout controls-ExportCustomizer__area',
               closeByExternalClick: true,
               //caption: '',
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
            this._resultHandler = null;
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
            var resultHandler = isSuccess ? this._resultHandler : undefined;
            this._result = null;
            this._resultHandler = null;
            if (this._areaContainer) {
               this._areaContainer.close();
            }
            if (isSuccess) {
               if (resultHandler) {
                  result.dependOn(
                     resultHandler(outcome)
                        .addErrback(function (err) { return rk('При отправке данных поизошла ошибка', 'НастройщикЭкспорта'); })
                  );
               }
               else {
                  result.callback(outcome);
               }
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
               Area.showMessage(
                  'error',
                  rk('Ошибка', 'НастройщикЭкспорта'),
                  ((err && err.message ? err.message : err) || rk('При получении данных поизошла неизвестная ошибка', 'НастройщикЭкспорта')) + '\n' +
                     rk('Настройка экспорта будет прервана', 'НастройщикЭкспорта')
               )
                  .addCallback(this._complete.bind(this, false, err));
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
