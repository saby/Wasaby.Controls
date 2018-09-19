/**
 * Исполняемое действие "Настройщик импорта"
 * При выполнении этого действия быдет открыт диалог, содержащий компонент {@link SBIS3.CONTROLS/ImportCustomizer/Area}.
 * При создании экземпляров этого класса в качестве опций можно использовать любые собственные опции класса {@link SBIS3.CONTROLS/ImportCustomizer/Area}.
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/Action
 * @extends SBIS3.CONTROLS/Action
 */
define('SBIS3.CONTROLS/ImportCustomizer/Action',
   [
      'Core/core-merge',
      'Core/Deferred',
      'SBIS3.CONTROLS/Action/OpenDialog',
      'SBIS3.CONTROLS/Action',
      'SBIS3.CONTROLS/ImportCustomizer/Area',
      'SBIS3.CONTROLS/Utils/ImportExport/RemoteCall'
   ],

   function (cMerge, Deferred, OpenDialogAction, Action, Area, RemoteCall) {
      'use strict';

      var ImportCustomizerAction = Action.extend([], /**@lends SBIS3.CONTROLS/ImportCustomizer/Action.prototype*/ {

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
          * @property {string} [name] Имя(идентификатор) парсера (опционально, если парсер является частью набора парсеров, представленного в виде объекта, где ключами являются таките имена(идентификаторы) парсеров)
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

         //_dotTplFn: null,
         $protected: {
            _options: {
            },
            _result: null,
            _resultHandler: null,
            _areaContainer: null
         },

         /**
          * Открыть настройщик импорта. Возвращает обещание, которое будет разрешено после завершения редактирования пользователем. В случае, если
          * пользователь после редактирования нажал кнопку применения результата редактирования, то обещание будет разрешено результатом
          * редактирования. Если же пользователь просто закрыл настройщик кнопкой "Закрыть", то обещание будет разрешено значением null.
          *
          * Все параметры этого метода в точности соответствуют собственным опциям класса {@link SBIS3.CONTROLS/ImportCustomizer/Area}.
          * Любой из параметров этого метода может быть указан через шаблон в виде опции этого класса, если он известен на момент парсинга шаблона.
          *
          * @public
          * @param {object} options Входные аргументы("мета-данные") настройщика импорта:
          * @param {string} options.dataType Тип импортируемых данных. Должен сооветствовать одной из констант: Area.DATA_TYPE_EXCEL, Area.DATA_TYPE_DBF, Area.DATA_TYPE_CML, Area.DATA_TYPES
          * @param {ImportFile} options.file Информация о файле с импортируемыми данными
          * @param {string} [options.baseParamsComponent] Класс компонента для настройки параметров импортирования (опционально)
          * @param {object} [options.baseParams] Опции компонента для настройки параметров импортирования (опционально)
          * @param {object<ImportParser>} options.parsers Список доступных провайдеров парсинга импортируемых данных
          * @param {object} options.providerArgs Опции провайдера парсинга (отдельно по каждому парсеру). Состав опций может быть различным для каждого парсера (опционально)
          * @param {ImportTargetFields|Core/Deferred<ImportTargetFields>|ImportRemoteCall} options.fields Полный список полей, к которым должны быть привязаны импортируемые данные. Можкт быть как задано явно, так и указано в виде обещания(Deferred) или вызова метода удалённого сервиса
          * @param {Array<ImportSheet>} options.sheets Список объектов, представляющих имеющиеся области данных
          * @param {number} [options.sheetIndex] Индекс выбранной области данных (опционально)
          * @param {boolean} [options.sameSheetConfigs] Обрабатываются ли все области данных одинаково (опционально)
          * @param {object|Array<object>} options.columnBindingMapping Перечень соответствий идентификатор поля - индекс колонки в под-компоненте привязки колонок. Может быть представлен как один объект для всех листов, так и массив объектов по одному на каждый лист (опционально)
          * @param {ImportMapping} options.mapping Информацию о настройке соответствий значений
          * @param {Array<ImportValidator>} options.validators Список валидаторов результатов редактирования
          * @param {ImportRemoteCall} [options.inputCall] Информация для вызова метода удалённого сервиса для получения данных ввода (опционально)
          * @param {ImportRemoteCall} [options.outputCall] Информация для вызова метода удалённого сервиса для отправки данных вывода (опционально)
          * @param {string} options.dialogTitle Заголовок диалога настройщика импорта (опционально)
          * @param {string} options.dialogButtonTitle Подпись кнопки диалога применения результата редактирования (опционально)
          * @param {string} options.allSheetsTitle Название опции для выбора одинаковых настроек для всех листов файла в под-компоненте выбора области данных (опционально)
          * @param {string} options.columnBindingMenuTitle Заголовок для меню выбора соответствия в колонках в под-компоненте привязки колонок (опционально)
          * @param {string} options.columnBindingHeadTitle Всплывающая подсказака в заголовке колонки в под-компоненте привязки колонок (опционально)
          * @param {string} options.mapperFieldColumnTitle Заголовок колонки целевых элементов сопоставления в под-компоненте настройки соответствия/мэпинга значений (опционально)
          * @param {string} options.mapperVariantColumnTitle Заголовок колонки вариантов сопоставления в под-компоненте настройки соответствия/мэпинга значений (опционально)
          * @param {string} options.resultNotation Нотация, в которой будут представлены имена свойств результата. Допустимые значения: "lowDash" и "camelCase" (по умолчанию). При указании "lowDash" результат с помощью хелпера {@link SBIS3.CONTROLS/Utils/ImportExport/PropertyNames} будет приведён в нотацию с символом нижнего подчёркивания в качестве разделителя. При указании "camelCase" (или без указания совсем) результат будет возвращён "как есть", согласно {@link https://wi.sbis.ru/doc/platform/developmentapl/standards/styleguide-js/ стандарту разработки JavaScript} (опционально)
          * @return {Deferred<ImportResults>}
          */
         execute: function (options) {
            return ImportCustomizerAction.superclass.execute.apply(this, arguments);
         },

         /**
          * Метод, выполняющий основное действие
          * @protected
          * @param {object} options Входные аргументы("мета-данные") настройщика импорта (согласно описанию в методе {@link execute})
          */
         _doExecute: function (options) {
            if (!options || typeof options !== 'object') {
               throw new Error('No arguments');
            }
            if (this._result) {
               return Deferred.fail('Allready open');
            }
            var defaults = this._options;
            var inputCall = options.inputCall || defaults.inputCall;
            if (inputCall) {
               inputCall = new RemoteCall(inputCall);
            }
            var outputCall = options.outputCall || defaults.outputCall;
            if (outputCall) {
               outputCall = new RemoteCall(outputCall);
            }
            var opts = options.inputCall || options.outputCall ? Object.keys(options).reduce(function (r, v) { if (v !== 'inputCall' && v !== 'outputCall') { r[v] = options[v]; }; return r; }, {}) : options;
            this._result = new Deferred();
            if (inputCall) {
               inputCall.call(opts).addCallbacks(
                  function (data) {
                     this._open(cMerge(opts, data));
                  }.bind(this),
                  this._completeWithError.bind(this, true, rk('При анализе файла поизошла ошибка', 'НастройщикИмпорта'))
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
          * Открыть область редактирования настройщика импорта
          *
          * @protected
          * @param {object} options Входные аргументы("мета-данные") настройщика импорта (согласно описанию в методе {@link execute})
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
            Object.keys(options).concat(Area.getOwnOptionNames()).forEach(function (name) {
               var value = options[name];
               componentOptions[name] = value !== undefined ? value : defaults[name];
            });
            // Если указан не поддерживаемый тип данных - завершить с ошибкой
            if (Area.DATA_TYPES.indexOf(componentOptions.dataType) === -1) {
               var err = new Error(rk('Тип данных в этом файле не поддерживается', 'НастройщикИмпорта'));
               err.name = 'NotSupportedDataType';
               this._completeWithError(true, err);
               return;
            }
            this._areaContainer = new OpenDialogAction({
               mode: 'floatArea',
               template: 'SBIS3.CONTROLS/ImportCustomizer/Area'
            });
            this._areaContainer.execute({
               dialogOptions: {
                  opener: this,
                  direction: 'left',
                  animation: 'slide',
                  isStack: true,
                  autoCloseOnHide: true,
                  className: 'controls-ImportCustomizer__area',
                  closeByExternalClick: true,
                  closeButton: true,
                  handlers: {
                     //onClose: this._onAreaClose.bind(this)
                  }
               },
               componentOptions: componentOptions
            }).addBoth(this._onAreaClose.bind(this));
            this._notify('onSizeChange');
            this.subscribeOnceTo(this._areaContainer, 'onDestroy', this._notify.bind(this, 'onSizeChange'));
            //this._notify('onOpen');
         },

         /**
          * Встроенный обработчик ошибок, возникших в результате выполнения Deferred-a, возвращённого методом  _doExecute
          * @protected
          * @param {Error} error Ошибка
          * @param {object} options Входные аргументы("мета-данные") настройщика импорта (согласно описанию в методе {@link execute})
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
               this._areaContainer.closeDialog();
            }
            if (isSuccess) {
               if (resultHandler) {
                  result.dependOn(
                     resultHandler(outcome)
                        .addErrback(function (err) { return rk('При отправке данных поизошла ошибка', 'НастройщикИмпорта'); })
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
                  rk('Ошибка', 'НастройщикИмпорта'),
                  ((err && err.message ? err.message : err) || rk('При получении данных поизошла неизвестная ошибка', 'НастройщикИмпорта')) + '\n' +
                     rk('Настройка импорта будет прервана', 'НастройщикИмпорта')
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
          * @param {object} options Входные аргументы("мета-данные") настройщика импорта (согласно описанию в методе {@link execute})
          * @param {ImportResults} results Результат редактирования
          * @return {object|*}
          */
         _notifyOnExecuted: function (options, results) {
            return this._notify(this, 'onExecuted', options, results) || results;
         }
      });



      return ImportCustomizerAction;
   }
);
