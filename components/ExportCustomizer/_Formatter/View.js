/**
 * Контрол "Форматирование экспортируемого файла настройщика экспорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/_Formatter/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/_Formatter/View',
   [
      'Core/Deferred',
      'Core/ParallelDeferred',
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/ExportCustomizer/Utils/CollectionSelectByIds',
      'SBIS3.CONTROLS/Utils/ObjectChange',
      'SBIS3.CONTROLS/WaitIndicator',
      'WS.Data/Di',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Formatter/View',
      'css!SBIS3.CONTROLS/ExportCustomizer/_Formatter/View',

      'i18n!SBIS3.CONTROLS/ExportCustomizer/_Formatter/View'
   ],

   function (Deferred, ParallelDeferred, CompoundControl, collectionSelectByIds, objectChange, WaitIndicator, Di, dotTplFn) {
      'use strict';

      /**
       * @typedef {object} ExportServiceParams Тип, содержащий информацию о прочих параметрах, необходимых для работы БЛ
       * @property {string} MethodName Имя списочного метода, результат раболты которого будет сохранён в эксель-файл
       * @property {WS.Data/Entity/Record} [Filter] Параметры фильтрации для списочного метода (опционально)
       * @property {WS.Data/Entity/Record} [Pagination] Навигация для списочного метода (опционально)
       * @property {string} [HierarchyField] Название поля иерархии (опционально)
       * @property {string} FileName Название результирующего эксель-файла
       */

      /**
       * @typedef {object} ExportFormatterResult Тип, описывающий возвращаемые настраиваемые значения компонента
       * @property {string} primaryUuid Исходный uuid стилевого эксель-файла
       * @property {string} fileUuid Транзакционный uuid стилевого эксель-файла
       *
       * @see primaryUuid
       * @see fileUuid
       */

      /**
       * Имя регистрации объекта, предоставляющего методы форматирования стилевого эксель-файла, в инжекторе зависимостей
       * @private
       * @type {string}
       */
      var EXPORT_FORMATTER_NAME = 'ExportFormatter.Excel';

      /**
       * Задержка блокировки интерфейса при начале редактирования пользователем стилевого эксель-файла
       * @private
       * @type {number}
       */
      var LOCK_DELAY = 750;

      /**
       * Задержка показа индикатора ожидания
       * @private
       * @type {number}
       */
      var WAIT_INDICATOR_DELAY = 600;

      /**
       * Масштаб  изображения предпросмотра
       * @private
       * @type {number}
       */
      var PREVIEW_SCALE = 0.8;

      /**
       * Размер запрашиваемого изображения предпросмотра
       * @private
       * @type {number}
       */
      var PREVIEW_WIDTH = 1000;

      /**
       * Размер запрашиваемого изображения предпросмотра
       * @private
       * @type {number}
       */
      var PREVIEW_HEIGHT = 0;



      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ExportCustomizer/_Formatter/View.prototype*/ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Заголовок компонента
                */
               title: null,//Определено в шаблоне
               /**
                * @cfg {string} Заголовок меню выбора способа форматирования
                */
               menuTitle: rk('Редактировать', 'НастройщикЭкспорта'),
               /**
                * @cfg {string} Название пункта меню выбора способа форматирования для редактирования в браузере
                */
               menuItemInlineTitle: rk('в браузере', 'НастройщикЭкспорта'),
               /**
                * @cfg {string} Название пункта меню выбора способа форматирования для редактирования в отдельном приложении
                */
               menuItemAppTitle: rk('в приложении', 'НастройщикЭкспорта'),
               /**
                * @cfg {string} Подпись на изображении предпросмотра
                */
               previewTitle: rk('Редактировать формат отображения в браузере', 'НастройщикЭкспорта'),
               /**
                * @cfg {ExportServiceParams} Прочие параметры, необходимых для работы БЛ
                */
               serviceParams: null,
               /**
                * @cfg {Array<BrowserColumnInfo>|WS.Data/Collection/RecordSet<BrowserColumnInfo>} Список объектов с информацией о всех колонках в формате, используемом в браузере
                */
               allFields: null,
               /**
                * @cfg {Array<string>} Список привязки колонок в экспортируемом файле к полям данных
                */
               fieldIds: null,
               /**
                * @cfg {string} Исходный uuid стилевого эксель-файла (неизменного)
                */
               primaryUuid: null,
               /**
                * @cfg {string} Транзакционный uuid стилевого эксель-файла (изменяемого)
                */
               fileUuid: null,
               /**
                * @cfg {string|number} Идентификатор потребителя (обычно пресета)
                */
               consumerId: null,
               /**
                * @cfg {bolean} Допускаются ли изменения
                */
               readOnly: null
            },
            // Массив обещаний, ожидающих результатов вызовов форматера
            _promises: [],
            // Объект, предоставляющий методы форматирования стилевого эксель-файла
            _exportFormatter: null,
            // Контрол меню выбора способа форматирования
            _formatterMenu: null,
            // Контрол предпросмотра
            _preview: null,
            // Происходит ли в данный момент процесс редактирования стилевого эксель-файла пользователем
            _isEditing: null,
            // Изменён ли пользователем стилевой эксель-файл
            _isDifferent: null,
            // Поддерживается ли редактирование стилевого эксель-файла в отдельном приложении
            // TODO: Это временное решение пока метод canEditInApp форматтера не полностью фунционален. Позже заменить на прямые вызовы этого метода при каждом использовании меню выбора способв форматирования
            _isAppAllowed: null
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            options._menuItems = [
               {id:'inline', title:options.menuItemInlineTitle},
               {id:'app', title:options.menuItemAppTitle}
            ];
            return options;
         },

         /*$constructor: function () {
         },*/

         init: function () {
            View.superclass.init.apply(this, arguments);
            if (Di.isRegistered(EXPORT_FORMATTER_NAME)) {
               var formatter = this._exportFormatter = Di.resolve(EXPORT_FORMATTER_NAME);
               formatter.canEditInApp().addCallback(function (isAllow) {
                  this._isAppAllowed = isAllow;
               }.bind(this));
               var options = this._options;
               if (!options.readOnly) {
                  this._formatterMenu = this.getChildControlByName('controls-ExportCustomizer-Formatter-View__formatterMenu');
               }
               this._preview = this.getContainer().find('.controls-ExportCustomizer-Formatter-View__preview img');
               this._bindEvents();
               var fieldIds = options.fieldIds;
               if (fieldIds && fieldIds.length) {
                  this._checkExistence().addCallback(function () {
                     /*if (!options.primaryUuid) {
                        this._callFormatterCreate();
                     }
                     else {*/
                        this._updatePreview();
                     /*}*/
                  }.bind(this));
               }
            }
            else {
               this.setEnabled(false);
               this.setVisible(false);
            }
         },

         _bindEvents: function () {
            if (!this._options.readOnly) {
               this.subscribeTo(this._formatterMenu, 'onActivated', function (evtName) {
                  if (!this._isAppAllowed) {
                     this._formatterMenu.hidePicker();
                     this._startFormatEditing(false);
                  }
               }.bind(this));

               this.subscribeTo(this._formatterMenu, 'onMenuItemActivate', function (evtName, selectedId) {
                  this._startFormatEditing(selectedId === 'app');
               }.bind(this));

               this.subscribeTo(this._exportFormatter, 'editStart', function () {
                  this._onFormatEditStarted();
               }.bind(this));

               this.subscribeTo(this._exportFormatter, 'edit', function () {
                  this._onFormatEdited();
               }.bind(this));

               this.subscribeTo(this._exportFormatter, 'editEnd', function (evtName, isChanged) {
                  this._onFormatEditEnded(isChanged);
               }.bind(this));

               this._preview.on('click', function () {
                  if (this.isEnabled()) {
                     this._startFormatEditing(false);
                  }
               }.bind(this));
            }
         },

         /**
          * Открыть для редактирования пользователем (в браузере или в отдельном приложении) стилевой эксель-файл
          *
          * @protected
          * @param {boolean} useApp Открыть в отдельном приложении
          */
         _startFormatEditing: function (useApp) {
            var options = this._options;
            var fieldIds = options.fieldIds;
            if (fieldIds && fieldIds.length) {
               if (!options.fileUuid) {
                  this._callFormatterMethods([{method:'clone', args:[options.primaryUuid, false, true]}, {method:'open', args:[useApp]}]);
               }
               else {
                  this._callFormatterOpen(useApp);
               }
            }
         },

         /**
          * Обработчик начала редактирования пользователем стилевого эксель-файла
          *
          * @protected
          */
         _onFormatEditStarted: function () {
            this._isEditing = true;
            // Заблокировать интерфейс с небольшой задержкой, так как при первом открытии экселя (при редактировании в приложении) файл откроется
            // заблокированным и сессия редактирования сразу завершиться. При снятии блокировки в экселе будет начата новая сессия редактирования
            setTimeout(function () {
               if (this._isEditing) {
                  this.setEnabled(false);
               }
            }.bind(this), LOCK_DELAY);
         },

         /**
          * Обработчик единичного изменения при редактировании пользователем стилевого эксель-файла
          *
          * @protected
          */
         _onFormatEdited: function () {
            this._isDifferent = true;
            this._updatePreview();
         },

         /**
          * Обработчик завершения редактирования пользователем стилевого эксель-файла
          *
          * @protected
          * @param {boolean} isChanged При редактировании были
          */
         _onFormatEditEnded: function (isChanged) {
            this._isEditing = null;
            this.setEnabled(true);
            if (isChanged) {
               this._isDifferent = true;
               this.sendCommand('subviewChanged', 'afterOpen');
               this._updatePreview();
            }
         },

         /**
          * Проверить существование стилевого файла, указанного в опции primaryUuid. Если его не существует, то значение опции будет обнулено
          *
          * @protected
          * @return {Core/Deferred}
          */
         _checkExistence: function () {
            var options = this._options;
            var fileUuid = options.primaryUuid;
            if (fileUuid) {
               return this._callFormatterIsExists(fileUuid).addCallback(function (isSuccess) {
                  if (!isSuccess) {
                     options.primaryUuid = null;
                     this.sendCommand('subviewChanged', 'uuidNullified', fileUuid);
                  }
               }.bind(this));
            }
            else {
               return Deferred.success();
            }
         },

         /**
          * Вызвать метод форматера "getPreviewUrl"
          *
          * @protected
          * @return {Core/Deferred<string>}
          */
         _callFormatterGetPreviewUrl: function () {
            var options = this._options;
            var usePrimary = !this._isDifferent && !!options.primaryUuid;
            return this._exportFormatter.getPreviewUrl(
               usePrimary ? options.primaryUuid : options.fileUuid, PREVIEW_WIDTH, PREVIEW_HEIGHT
            ).addCallbacks(
               function (url) {
                  return usePrimary ? '/previewer' + url : url;
               }.bind(this),
               function (err) { return err; }
            );
         },

         /**
          * Вызвать метод форматера "create" или "clone"
          *
          * @protected
          * @param {string} [fileUuid] Uuid стилевого эксель-файла. Если указан, то будет произведено клонирование (опционально)
          * @param {boolean} [updateCloned] И сразу обновить колонки у только что клонированного стилевого эксель-файла (только при клонировании) (опционально)
          * @param {boolean} [isSilent] Не формирорвать событие (опционально)
          * @return {Core/Deferred}
          */
         _callFormatterCreate: function (fileUuid, updateCloned, isSilent) {
            var isClone = !!fileUuid;
            var options = this._options;
            var fieldIds = options.fieldIds;
            var formatter = this._exportFormatter;
            var promise = (isClone
                  ? formatter.copy(fileUuid)
                  : formatter.create(fieldIds || [], this._getFieldTitles(fieldIds), options.serviceParams)
            ).addCallbacks(
               function (result) {
                  options.fileUuid = result;
                  if (!isSilent) {
                     this.sendCommand('subviewChanged');
                  }
                  if (isClone && updateCloned) {
                     this._callFormatterUpdate();
                  }
                  else {
                     this._updatePreview();
                  }
               }.bind(this),
               function (err) { return err; }
            );
            // Запустить индикатор сразу
            this._waitIndicatorStart();
            return this._keepInMindPromise(promise);
         },

         /**
          * Вызвать метод форматера "update"
          *
          * @protected
          * @param {string} [fileUuid] Uuid стилевого эксель-файла. Если не указан, то будет использован текущий uuid из опций (опционально)
          * @return {Core/Deferred}
          */
         _callFormatterUpdate: function (fileUuid) {
            var options = this._options;
            var fieldIds = options.fieldIds;
            var promise = this._exportFormatter.update(fileUuid || options.fileUuid, fieldIds || [], this._getFieldTitles(fieldIds), options.serviceParams).addCallbacks(
               function () {
                  this._isDifferent = true;
                  this._updatePreview();
               }.bind(this),
               function (err) { return err; }
            );
            // Запустить индикатор сразу
            this._waitIndicatorStart();
            return this._keepInMindPromise(promise);
         },

         /**
          * Вызвать метод форматера "isExists"
          *
          * @protected
          * @param {string} [fileUuid] Uuid стилевого эксель-файла
          * @return {Core/Deferred<boolean>}
          */
         _callFormatterIsExists: function (fileUuid) {
            return this._keepInMindPromise(this._exportFormatter.isExists(fileUuid).addErrback(
               function (err) { return err; }
            ));
         },

         /**
          * Вызвать метод форматера "delete"
          *
          * @protected
          * @param {string} fileUuid Uuid стилевого эксель-файла
          * @param {object} historyInfo Информация для сохранения истроии
          * @return {Core/Deferred}
          */
         _callFormatterDelete: function (fileUuid, historyInfo) {
            return this._keepInMindPromise(this._exportFormatter.remove(fileUuid, this._options.serviceParams, historyInfo).addErrback(
               function (err) { return err; }
            ));
         },

         /**
          * Вызвать метод форматера "open" или "openApp"
          *
          * @protected
          * @param {boolean} useApp Открыть в отдельном приложении
          */
         _callFormatterOpen: function (useApp) {
            var options = this._options;
            var fieldIds = options.fieldIds;
            this._exportFormatter[useApp ? 'openApp' : 'open'](options.fileUuid || options.primaryUuid, fieldIds || [], this._getFieldTitles(fieldIds), options.serviceParams);
         },

         /**
          * Получить список отображаемых названий полей для указанного списка полей данных
          *
          * @protected
          * @param {Array<string>} fieldIds Список идентификаторв полей данных
          * @return {Array<string>}
          */
         _getFieldTitles: function (fieldIds) {
            return fieldIds && fieldIds.length ? collectionSelectByIds(this._options.allFields, fieldIds, function (v) { return v.title; }) || [] : [];
         },

         /**
          * Вызвать последовательно несколько методов форматера
          *
          * @protected
          * @param {Array<string|object>} methods Список вызываемых методов
          * @return {Core/Deferred}
          */
         _callFormatterMethods: function (methods) {
            if (methods && methods.length) {
               var methodMap = {
                  'create': '_callFormatterCreate',
                  'clone': '_callFormatterCreate',
                  'update': '_callFormatterUpdate',
                  'open': '_callFormatterOpen',
                  'openApp': '_callFormatterOpen',
                  'delete': '_callFormatterDelete'
               };
               var inf = methods[0];
               var isComplex = typeof inf === 'object';
               var method = isComplex ? inf.method : inf;
               var promise = this[methodMap[method]].apply(this, isComplex ? (inf.args || []) : (method === 'openApp' ? [true] : []));
               if (1 < methods.length) {
                  promise.addCallback(this._callFormatterMethods.bind(this, methods.slice(1)));
               }
               return promise;
            }
         },

         /**
          * Иметь ввиду, что указанное обещание есть и выпоняется
          *
          * @protected
          * @param {Core/Deferred} promise Обещание
          * @return {Core/Deferred}
          */
         _keepInMindPromise: function (promise) {
            var promises = this._promises;
            promises.push(promise);
            promise.addBoth(function (args) {
               var i = promises.indexOf(promise);
               if (i !== -1) {
                  promises.splice(i, 1);
               }
               return args;
            });
            return promise;
         },

         /**
          * Запустить индикатор ожидания
          *
          * @protected
          */
         _waitIndicatorStart: function () {
            if (!this._waitIndicatorStopper) {
               WaitIndicator.make({target:this._preview[0].parentNode, overlay:'white', delay:WAIT_INDICATOR_DELAY}, this._waitIndicatorStopper = new Deferred());
            }
         },

         /**
          * Остановить индикатор ожидания
          *
          * @protected
          */
         _waitIndicatorEnd: function () {
            var stopper = this._waitIndicatorStopper;
            if (stopper) {
               stopper.callback();
               this._waitIndicatorStopper = null;
            }
         },

         /**
          * Обновить изображение предпросмотра
          *
          * @protected
          * @param {object} features Уточняющие параметры (опционально)
          * @param {boolean} [features.withClear] Очистить сразу от предыдущего изображения (опционально)
          * @param {boolean} [features.isSilent] Не показывать индикатор ожидания (опционально)
          */
         _updatePreview: function (features) {
            var fieldIds = this._options.fieldIds;
            var has = !!(fieldIds && fieldIds.length);
            if (!has || (features && features.withClear)) {
               var img = this._preview[0];
               img.src = '';
               img.title = '';
               this._preview.removeClass('ws-enabled').addClass('ws-disabled');
            }
            if (has) {
               this._updatePreviewStart(!(features && features.isSilent));
            }
         },

         /**
          * Очистка после завершения процесса обновление изображения предпросмотра
          *
          * @protected
          */
         _updatePreviewClear: function () {
            this._waitIndicatorEnd();
         },

         /**
          * Начать процесс обновление изображения предпросмотра
          *
          * @protected
          * @param {boolean} [withWaitIndicator] Показывать индикатор ожидания (опционально)
          */
         _updatePreviewStart: function (withWaitIndicator) {
            if (withWaitIndicator) {
               this._waitIndicatorStart();
            }
            this._callFormatterGetPreviewUrl().addCallbacks(
               this._updatePreviewStartOnUrl.bind(this),
               this._updatePreviewClear.bind(this)
            );
         },

         /**
          * Процесс обновления изображения предпросмотра - обработчие при получении url-а изображения
          *
          * @protected
          * @param {string} url Адресс изображения предпросмотра
          */
         _updatePreviewStartOnUrl: function (url) {
            var cache = new Image();
            cache.onload = cache.onerror = this._updatePreviewStartOnImgGet.bind(this, cache);
            cache.onerror = this._updatePreviewClear.bind(this);
            cache.src = url;
         },

         /**
          * Процесс обновления изображения предпросмотра - обработчие при полной загрузке изображения
          *
          * @protected
          */
         _updatePreviewStartOnImgGet: function (cache) {
            var img = this._preview[0];
            var options = this._options;
            img.onload = img.onerror = this._updatePreviewStartOnImgComplete.bind(this);
            img.src = cache.src;
            img.width = PREVIEW_SCALE*cache.width;
            img.title = !options.readOnly ? options.previewTitle : '';
            this._preview.removeClass('ws-disabled').addClass('ws-enabled');
         },

         /**
          * Процесс обновления изображения предпросмотра - обработчие при завершении
          *
          * @protected
          */
         _updatePreviewStartOnImgComplete: function () {
            this._updatePreviewClear();
            var img = this._preview[0];
            img.onload = img.onerror = null;
         },

         /**
          * Удалить стилевой эксель файл
          *
          * @public
          * @param {string} fileUuid Uuid стилевого эксель-файла
          * @param {object} historyInfo Информация для сохранения истроии
          * @return {Core/Deferred}
          */
         remove: function (fileUuid, historyInfo) {
            return this._formatter ? this._callFormatterDelete(fileUuid, historyInfo) : Deferred.success();
         },

         /**
          * Завершить транзакцию
          *
          * @public
          * @param {boolean} isCommit Сохранить или откатить изменения
          * @param {object} historyInfo Информация для сохранения истроии
          * @param {object} [saving] Дополнительные опции сохранения (опционально)
          * @param {boolean} saving.isClone В транзакции производилось клонирование - нельзя удалять исходный файл (только при сохранении)
          * @return {Core/Deferred<string>}
          */
         endTransaction: function (isCommit, historyInfo, saving) {
            if (!this._formatter) {
               return Deferred.success();
            }
            var promises = this._promises;
            if (promises.length) {
               // Если есть незавершённые вызовы форматтера - дождаться их
               var promise = new Deferred();
               (new ParallelDeferred({steps:promises})).done().getResult().addCallback(function () {
                  this.endTransaction(isCommit, historyInfo, saving).addCallback(promise.callback.bind(promise));
               }.bind(this));
               return promise;
            }
            var options = this._options;
            var fileUuid = options.fileUuid;
            if (!isCommit) {
               options.consumerId = null;
            }
            if (isCommit && saving && saving.isClone && !fileUuid) {
               return this._callFormatterCreate(options.primaryUuid, false).addCallback(this.endTransaction.bind(this, true, historyInfo, saving));
            }
            var result;
            //var isDifferent = fileUuid && this._isDifferent;
            if (isCommit) {
               var args = {
                  id: historyInfo.id,
                  action: historyInfo.action,
                  newUuid: fileUuid,
                  newTitle: historyInfo.title
               };
               if (historyInfo.action === 'update') {
                  args.fileUuid = options.primaryUuid;
                  args.title = historyInfo.title;
               }
               this._exportFormatter.commit(args, options.serviceParams);
               result = saving && saving.isClone ? fileUuid : options.primaryUuid || fileUuid;
               /*if (fileUuid && !(saving && saving.isClone)) {
                  var deleteUuid = options.primaryUuid;
                  if (deleteUuid) {
                     this._callFormatterDelete(deleteUuid);
                  }
               }
               result = fileUuid;
               options.primaryUuid = fileUuid;*/
            }
            else {
               if (fileUuid) {
                  this._callFormatterDelete(fileUuid);
               }
               result = options.primaryUuid;
            }
            options.fileUuid = null;
            this._isDifferent = null;
            return Deferred.success(result);
         },

         /**
          * Установить указанные настраиваемые значения компонента
          *
          * @public
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          * @param {object} meta Дополнительная информация об изменении
          */
         restate: function (values, meta) {
            if (!values || typeof values !== 'object') {
               throw new Error('Object required');
            }
            if (!this._formatter) {
               return;
            }
            var options = this._options;
            var changes = objectChange(options, values, {fieldIds:true, primaryUuid:false, fileUuid:false, consumerId:false});
            if (changes) {
               var isConsumerChanged = 'consumerId' in changes;
               var isFieldsChanged = 'fieldIds' in changes;
               if (isConsumerChanged) {
                  this._isDifferent = null;
               }
               if (isConsumerChanged && options.primaryUuid) {
                  this._checkExistence().addCallback(this._restate.bind(this, isConsumerChanged, isFieldsChanged, meta));
               }
               else {
                  this._restate(isConsumerChanged, isFieldsChanged, meta);
               }
            }
         },

         /**
          * Доустановить настраиваемые значения компонента
          *
          * @protected
          * @param {boolean} isConsumerChanged Было ли изменено значение consumerId
          * @param {boolean} isFieldsChanged Было ли изменено значение fieldIds
          * @param {object} meta Дополнительная информация об изменении
          */
         _restate: function (isConsumerChanged, isFieldsChanged, meta) {
            var options = this._options;
            var fieldIds = options.fieldIds;
            var hasFields = !!(fieldIds && fieldIds.length);
            var methods = [];
            if (hasFields) {
               var reason = meta ? meta.reason : null;
               var arg = meta && meta.args ? meta.args[0] : null;
               //Если не поменялся consumerId, но поменялись поля; или если это клонирование с изменением
               if ((!isConsumerChanged && isFieldsChanged) || (reason === 'clone' && arg && arg.isChanged)) {
                  if (!options.fileUuid) {
                     var primaryUuid = options.primaryUuid;
                     methods.push(primaryUuid ? {method:'clone', args:[primaryUuid, true]} : 'create');
                  }
                  else {
                     methods.push('update');
                  }
               }
               else
               if (isConsumerChanged && reason === 'select') {
                  if (!options.primaryUuid) {
                     methods.push('create');
                  }
                  else
                  if (arg && arg.isChanged) {
                     // Стилевой эксель-файл устарел, обновить его
                     methods.push({method:'update', args:[options.primaryUuid]});
                  }
               }
            }
            if (methods.length) {
               this._callFormatterMethods(methods);
            }
            else {
               // Если изменился родительский шаблон - убирать предыдущее изображениесразу
               // Если шаблон родительский прежний и нет видимых изменений - не показывать индикатор ожиджания
               this._updatePreview({withClear:isConsumerChanged, isSilent:!(isConsumerChanged || isFieldsChanged || !options.primaryUuid)});
            }
            this.setEnabled(hasFields);
            this.setVisible(hasFields);
         },

         /**
          * Получить все настраиваемые значения компонента
          *
          * @public
          * @return {ExportFormatterResult}
          */
         getValues: function () {
            var options = this._options;
            return {
               fileUuid: options.fileUuid
            };
         },

         /**
          * Уничтожить экземпляр
          *
          * @public
          */
         destroy: function () {
            this._updatePreviewClear();
            this._exportFormatter && this._exportFormatter.clear();
            View.superclass.destroy.apply(this, arguments);
         }
      });

      return View;
   }
);
