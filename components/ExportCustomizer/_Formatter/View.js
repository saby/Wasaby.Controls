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
      'Core/helpers/Function/debounce',
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/Utils/ObjectChange',
      'SBIS3.CONTROLS/WaitIndicator',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Di',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Formatter/View',
      'css!SBIS3.CONTROLS/ExportCustomizer/_Formatter/View'
   ],

   function (Deferred, coreDebounce, CompoundControl, objectChange, WaitIndicator, RecordSet, Di, dotTplFn) {
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
       * @property {string} fileUuid Uuid шаблона форматирования эксель-файла
       *
       * @see fileUuid
       */

      /**
       * Имя регистрации объекта, предоставляющего методы форматирования шаблона эксель-файла, в инжекторе зависимостей
       * @private
       * @type {string}
       */
      var EXPORT_FORMATTER_NAME = 'ExportFormatter.Excel';

      /**
       * Задержка обновления изображения предпросмотра
       * @private
       * @type {number}
       */
      var PREVIEW_DELAY = 750;



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
                * @cfg {string} Uuid шаблона форматирования эксель-файла
                */
               fileUuid: null,
               /**
                * @cfg {string|number} Идентификатор потребителя (обычно пресета)
                */
               consumerId: null
            },
            // Объект, предоставляющий методы форматирования шаблона эксель-файла
            _exportFormatter: null,
            // Контрол выбора способа форматирования
            _formatterMenu: null,
            // Контрол предпросмотра
            _preview: null,
            // Размер области предпросмотра
            _previewSize: null,
            // Набор обещаний, ожидающих создания шаблона эксель-файла
            _creation: {},
            // Ожидаемое открытие шаблона эксель-файла
            _opening: null
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            options._menuItems = [
               {id:'browser', title:'в браузере'},
               {id:'app', title:'в приложении'}
            ];
            return options;
         },

         /*$constructor: function () {
         },*/

         init: function () {
            View.superclass.init.apply(this, arguments);
            if (Di.isRegistered(EXPORT_FORMATTER_NAME)) {
               this._exportFormatter = Di.resolve(EXPORT_FORMATTER_NAME);
               this._formatterMenu = this.getChildControlByName('controls-ExportCustomizer-Formatter-View__formatterMenu');
               this._preview = this.getContainer().find('.controls-ExportCustomizer-Formatter-View__preview img');
               this._bindEvents();
               var options = this._options;
               var fieldIds = options.fieldIds;
               if (fieldIds && fieldIds.length) {
                  if (!options.fileUuid) {
                     this._callFormatterMethod('create');
                  }
                  else {
                     this._updatePreview();
                  }
               }
            }
            else {
               this.setEnabled(false);
               this.setVisible(false);
            }
         },

         _bindEvents: function () {
            this.subscribeTo(this._formatterMenu, 'onMenuItemActivate', function (evtName, selectedId) {
               this._startFormatEditing(selectedId === 'app');
            }.bind(this));

            this._preview.on('click', this._startFormatEditing.bind(this, false));
         },

         /**
          * Открыть для редактирования пользователем (в браузере или в отдельном приложении) шаблон форматирования эксель-файла
          *
          * @protected
          * @param {boolean} useApp Открыть в отдельном приложении
          */
         _startFormatEditing: function (useApp) {
            var options = this._options;
            var fieldIds = options.fieldIds;
            if (fieldIds && fieldIds.length) {
               var method = useApp ? 'openApp' : 'open';
               this._opening = method;
               var result = this.sendCommand('subviewChanged', 'open');
               if (!(result && result.isComplete)) {
                  this._callFormatterMethod(method);
               }
            }
         },

         /**
          * Вызвать метод форматера
          *
          * @protected
          * @param {string} method Имя метода
          * @param {*} [args] Дополнитьные аргументы (опционально)
          * return {Core/Deferred}
          */
         _callFormatterMethod: function (method, args) {
            var options = this._options;
            var isCreate = method === 'create';
            var isClone = method === 'clone';
            var consumerId = options.consumerId || '';
            if ((isCreate || isClone) && this._creation[consumerId]) {
               throw new Error('Already in creation');
            }
            var isOpen = method === 'open' || method === 'openApp';
            var isUpdate = method === 'update';
            var isDelete = method === 'delete';
            if (isOpen) {
               this._opening = null;
            }
            var formatterArgs = [];
            if (isClone || isDelete) {
               formatterArgs.push(args);
            }
            if (isOpen || isUpdate) {
               formatterArgs.push(options.fileUuid);
            }
            if (isCreate || isOpen || isUpdate) {
               var fieldIds = options.fieldIds;
               formatterArgs.push(fieldIds || [], this._selectFields(options.allFields, fieldIds, function (v) { return v.title; }) || [], options.serviceParams);
            }
            var formatter = this._exportFormatter;
            var promise = formatter[isClone ? 'copy' : (isDelete ? 'remove' : method)].apply(formatter, formatterArgs).addCallbacks(
               this._onFormatter.bind(this, method),
               function (err) { return err; }
            );
            if (isCreate || isClone) {
               this._creation[consumerId] = promise.createDependent().addBoth(function (consumerId) {
                  delete this._creation[consumerId];
               }.bind(this, consumerId));
            }
            if (isCreate || isClone || isUpdate) {
               this._waitIndicatorStart();
            }
            return promise;
         },

         /**
          * Вызвать последовательно несколько методов форматера
          *
          * @protected
          * @param {Array<string|object>} methods Список вызываемых методов
          * return {Core/Deferred}
          */
         _callFormatterMethods: function (methods) {
            if (methods && methods.length) {
               var inf = methods[0];
               var promise = this._callFormatterMethod.apply(this, typeof inf === 'object' ? [inf.method, inf.args] : [inf]);
               if (1 < methods.length) {
                  promise.addCallback(this._callFormatterMethods.bind(this, methods.slice(1)));
               }
               return promise;
            }
         },

         /**
          * Выбрать из списка всех колонок только объекты согласно указанным идентификаторам. Если указана функция-преобразователь, то преобразовать с её помощью каждый полученный элемент списка
          *
          * @protected
          * @param {Array<BrowserColumnInfo>|WS.Data/Collection/RecordSet<BrowserColumnInfo>} allFields Список объектов с информацией о всех колонках в формате, используемом в браузере
          * @param {Array<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
          * @param {function} [mapper] Функция-преобразователь отобранных объектов (опционально)
          * @return {Array<*>}
          */
         _selectFields: function (allFields, fieldIds, mapper) {
            if (allFields && fieldIds && fieldIds.length) {
               var isRecordSet = allFields instanceof RecordSet;
               if (isRecordSet ? allFields.getCount() : allFields.length) {
                  var needMap = typeof mapper === 'function';
                  return fieldIds.map(function (id, i) {
                     var field;
                     if (!isRecordSet) {
                        allFields.some(function (v) { if (v.id === id) { field = v; return true; } });
                     }
                     else {
                        var model = allFields.getRecordById(id);
                        if (model) {
                           field = model.getRawData();
                        }
                     }
                     return field && needMap ? mapper(field) : field;
                  });
               }
            }
         },

         /**
          * Обработчик обратного вызова после выполнения методов форматера
          *
          * @protected
          * @param {string} method Имя метода
          * @param {*} result Результат операции над шаблоном форматирования эксель-файла
          */
         _onFormatter: function (method, result) {
            var isCreate = method === 'create' || method === 'clone';
            var isOpen = method === 'open' || method === 'openApp';
            var isDelete = method === 'delete';
            if (isCreate) {
               this._options.fileUuid = result;
            }
            if (isCreate || isOpen) {
               this.sendCommand('subviewChanged', isOpen ? 'openEnd' : method);
            }
            if (isOpen) {
               this._waitIndicatorStart();
            }
            if (isOpen && typeof result !== 'boolean') {
               // TODO: Пока методы open и openApp в PrintingTemplates/ExportFormatter/Excel не умеют правильно возвращать логическое значение, показывающее, что пользователь изменил шаблон - всегда считаем, что шаблон изменён. Убрать это после исправления
               result = true;
            }
            if (!isDelete && !(isOpen && !result)) {
               this._updatePreview();
            }
         },

         /**
          * Запустить индикатор ожидания
          *
          * @protected
          */
         _waitIndicatorStart: function () {
            this._updatePreviewClearStop();
            var stopper = this._waitIndicatorStopper = new Deferred();
            WaitIndicator.make({target:this._preview[0].parentNode, overlay:'dark', delay:0}, stopper);
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
          * @param {boolean} withClear Указывает очистить сразу от предыдущего изображения
          */
         _updatePreview: function (withClear) {
            var fieldIds = this._options.fieldIds;
            var has = !!(fieldIds && fieldIds.length);
            if (!has || withClear) {
               var img = this._preview[0];
               img.src = '';
               img.title = '';
               this._preview.removeClass('ws-enabled').addClass('ws-disabled');
            }
            if (has) {
               this._updatePreviewStart();
            }
         },
         _updatePreviewClearStop: function () {
            this._waitIndicatorEnd();
         },
         _updatePreviewStart: coreDebounce(function () {
            var size = this._previewSize;
            if (!size) {
               var previewContainer = this._preview.parent();
               this._previewSize = size = {width:previewContainer.width(), height:previewContainer.height()};
            }
            this._waitIndicatorStart();
            var options = this._options;
            this._exportFormatter.getPreviewUrl(options.fileUuid, size.width, size.height).addCallbacks(
               function (url) {
                  var img = this._preview[0];
                  img.onload = img.onerror = this._updatePreviewClearStop.bind(this);
                  img.src = url;
                  img.title = options.previewTitle;
                  this._preview.removeClass('ws-disabled').addClass('ws-enabled');
               }.bind(this),
               this._updatePreviewClearStop.bind(this)
            );
         }, PREVIEW_DELAY),

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
            var options = this._options;
            var changes = objectChange(options, values, {fieldIds:true, fileUuid:false, consumerId:false});
            if (changes) {
               var fieldIds = options.fieldIds;
               var hasFields = !!(fieldIds && fieldIds.length);
               var consumerId = options.consumerId || '';
               var creating = this._creation[consumerId];
               var methods = [];
               if (options.fileUuid) {
                  if ('fieldIds' in changes && !('fileUuid' in changes) && hasFields) {
                     methods.push('update');
                  }
               }
               else {
                  if (hasFields) {
                     if (!creating) {
                        var isClone = meta /*&& meta.source === 'presets'*/ && meta.reason === 'clone';
                        methods.push(isClone ? {method:'clone', args:meta.args[0]} : 'create');
                        if (isClone && 'fieldIds' in changes) {
                           methods.push('update');
                        }
                     }
                     else {
                        methods.push('update');
                     }
                  }
               }
               if (this._opening) {
                  methods.push(this._opening);
               }
               if (methods.length) {
                  if (creating) {
                     creating.addCallback(this._callFormatterMethods.bind(this, methods));
                  }
                  else {
                     this._callFormatterMethods(methods);
                  }
               }
               else {
                  this._updatePreview();
               }
               this.setEnabled(hasFields);
               this.setVisible(hasFields);
            }
            if (meta /*&& meta.source === 'presets'*/ && meta.reason === 'delete') {
               this._callFormatterMethod('delete', meta.args[0]);
            }
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
            this._updatePreviewClearStop();
            View.superclass.destroy.apply(this, arguments);
         }
      });

      return View;
   }
);
