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
      'Core/helpers/Object/isEqual',
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/WaitIndicator',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Di',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Formatter/View',
      'css!SBIS3.CONTROLS/ExportCustomizer/_Formatter/View'
   ],

   function (Deferred, coreDebounce, cObjectIsEqual, CompoundControl, WaitIndicator, RecordSet, Di, dotTplFn) {
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
                * @cfg {object} Описание потребителя (обычно идентификатор пресета и его редактируемость)
                */
               consumer: null
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
            _creation: {}
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
               this._callFormatterMethod(method);
            }
         },

         /**
          * Вызвать метод форматера
          *
          * @protected
          * @param {string} method Имя метода
          * return {Core/Deferred}
          */
         _callFormatterMethod: function (method) {
            var options = this._options;
            var isCreate = method === 'create';
            if (isCreate && this._creation[options.consumer ? options.consumer.id : '']) {
               throw new Error('Already in creation');
            }
            var args = [];
            var useBoth = method === 'update' || method === 'open' || method === 'openApp';
            if (method === 'delete' || useBoth) {
               args.push(options.fileUuid);
            }
            if (isCreate || useBoth) {
               var fieldIds = options.fieldIds;
               args.push(fieldIds || [], this._selectFields(options.allFields, fieldIds, function (v) { return v.title; }) || [], options.serviceParams);
            }
            var formatter = this._exportFormatter;
            var promise = formatter[method].apply(formatter, args).addCallbacks(
               this._onFormatter.bind(this, method),
               function (err) { return err; }
            );
            if (isCreate) {
               var consumer = options.consumer;
               var consumerId = consumer ? consumer.id : '';
               this._creation[consumerId] = promise.createDependent().addBoth(function (consumerId) {
                  delete this._creation[consumerId];
               }.bind(this, consumerId));
            }
            return promise;
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
          * @param {string} fileUuid Uuid шаблона форматирования эксель-файла
          */
         _onFormatter: function (method, fileUuid) {
            var has = method === 'create' && !!fileUuid;
            if (has) {
               this._options.fileUuid = fileUuid;
            }
            if (has || method === 'open' || method === 'openApp') {
               this.sendCommand('subviewChanged');
            }
            this._updatePreview();
         },

         /**
          * Обновить изображение предпросмотра
          *
          * @protected
          */
         _updatePreview: function () {
            var fieldIds = this._options.fieldIds;
            if (fieldIds && fieldIds.length) {
               this._updatePreviewStart();
            }
            else {
               var img = this._preview[0];
               img.src = '';
               img.title = '';
               this._preview.removeClass('ws-enabled').addClass('ws-disabled');
            }
         },
         _updatePreviewClearStop: function () {
            var stopper = this._updatePreviewStopper;
            if (stopper) {
               stopper.callback();
               this._updatePreviewStopper = null;
            }
         },
         _updatePreviewStart: coreDebounce(function () {
            var size = this._previewSize;
            if (!size) {
               var previewContainer = this._preview.parent();
               this._previewSize = size = {width:previewContainer.width(), height:previewContainer.height()};
            }
            this._updatePreviewClearStop();
            var img = this._preview[0];
            var stopper = this._updatePreviewStopper = new Deferred();
            WaitIndicator.make({target:img.parentNode, delay:1000}, stopper);
            var options = this._options;
            this._exportFormatter.getPreviewUrl(options.fileUuid, size.width, size.height).addCallbacks(
               function (url) {
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
          */
         setValues: function (values) {
            if (!values || typeof values !== 'object') {
               throw new Error('Object required');
            }
            var options = this._options;
            var waited = {fieldIds:true, fileUuid:false, consumer:true};
            var has = {};
            for (var name in values) {
               if (name in waited) {
                  var value = values[name];
                  if (!(value == null && options[name] == null) && !(waited[name] ? cObjectIsEqual(value, options[name]) : value === options[name])) {
                     has[name] = true;
                     options[name] = value;
                  }
               }
            }
            if (has.fieldIds || has.fileUuid) {
               var method = options.fileUuid ? 'update' : 'create';
               var promise;
               if (method === 'create') {
                  var consumer = options.consumer;
                  promise = this._creation[consumer ? consumer.id : ''];
               }

               if (promise) {
                  promise.addCallback(this._callFormatterMethod.bind(this, 'update'));
               }
               else {
                  this._callFormatterMethod(method);
               }
               var fieldIds = options.fieldIds;
               var isAllow = !!(fieldIds && fieldIds.length);
               this.setEnabled(isAllow);
               this.setVisible(isAllow);
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
