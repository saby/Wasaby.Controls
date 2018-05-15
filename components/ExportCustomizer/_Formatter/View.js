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
      'Core/helpers/Object/isEqual',
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/WaitIndicator',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Di',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Formatter/View',
      'css!SBIS3.CONTROLS/ExportCustomizer/_Formatter/View'
   ],

   function (Deferred, cObjectIsEqual, CompoundControl, WaitIndicator, RecordSet, Di, dotTplFn) {
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
               fileUuid: null
            },
            // Объект, предоставляющий методы форматирования шаблона эксель-файла
            _exportFormatter: null,
            // Контрол выбора способа форматирования
            _formatterMenu: null,
            // Контрол предпросмотра
            _preview: null,
            // Размер области предпросмотра
            _previewSize: null
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
                     this._callFormatterMethod('create').addCallback(this._onFormatter.bind(this));
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
               this._callFormatterMethod(useApp ? 'openApp' : 'open').addCallback(this._onFormatter.bind(this));
            }
         },

         /**
          * Вызвать метод форматера
          *
          * @protected
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          * return {Core/Deferred}
          */
         _callFormatterMethod: function (method) {
            var args = [];
            var options = this._options;
            var useBoth = method === 'update' || method === 'open' || method === 'openApp';
            if (method === 'delete' || useBoth) {
               args.push(options.fileUuid);
            }
            if (method === 'create' || useBoth) {
               var fieldIds = options.fieldIds;
               // TODO: Как быть, если массив полей пуст, а файл уже есть? вызывать с пустым массивом или удалять файл?
               args.push(fieldIds || [], this._selectFields(options.allFields, fieldIds, function (v) { return v.title; }) || [], options.serviceParams);
            }
            var formatter = this._exportFormatter;
            return formatter[method].apply(formatter, args).addErrback(function (err) {
               //^^^
               return err;
            });
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
          * @param {string} fileUuid Uuid шаблона форматирования эксель-файла
          */
         _onFormatter: function (fileUuid) {
            var options = this._options;
            if (fileUuid && !options.fileUuid) {
               options.fileUuid = fileUuid;
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
            this._updatePreviewClear();
            this._updatePreviewDelay = setTimeout(this._updatePreviewStart.bind(this), PREVIEW_DELAY);
         },
         _updatePreviewClear: function () {
            if (this._updatePreviewDelay) {
               clearTimeout(this._updatePreviewDelay);
               this._updatePreviewDelay = null;
            }
         },
         _updatePreviewStart: function () {
            var size = this._previewSize;
            if (!size) {
               var previewContainer = this._preview.parent();
               this._previewSize = size = {width:previewContainer.width(), height:previewContainer.height()};
            }
            var url = this._exportFormatter.getPreviewUrl(this._options.fileUuid, size.width, size.height);
            var img = this._preview[0];
            var stopper = new Deferred();
            WaitIndicator.make({target:img.parentNode, delay:1000}, stopper);
            img.onload = img.onerror = stopper.callback.bind(stopper);
            img.src = url;
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
            var options = this._options;
            var waited = {fieldIds:true, fileUuid:false};
            var has = {};
            for (var name in values) {
               if (name in waited) {
                  var value = values[name];
                  if (waited[name] ? !cObjectIsEqual(value, options[name]) : value !== options[name]) {
                     has[name] = true;
                     options[name] = value;
                  }
               }
            }
            if (has.fieldIds) {
               this._callFormatterMethod(options.fileUuid ? 'update' : 'create').addCallback(this._onFormatter.bind(this));
            }
            else
            if (has.fileUuid) {
               this._callFormatterMethod('update').addCallback(this._onFormatter.bind(this));
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
            this._updatePreviewClear();
            View.superclass.destroy.apply(this, arguments);
         }
      });

      return View;
   }
);
