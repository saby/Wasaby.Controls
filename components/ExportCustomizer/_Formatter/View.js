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
               consumerId: null
            },
            // Объект, предоставляющий методы форматирования стилевого эксель-файла
            _exportFormatter: null,
            // Контрол меню выбора способа форматирования
            _formatterMenu: null,
            // Контрол предпросмотра
            _preview: null,
            // Размер области предпросмотра
            _previewSize: null,
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
               this._formatterMenu = this.getChildControlByName('controls-ExportCustomizer-Formatter-View__formatterMenu');
               this._preview = this.getContainer().find('.controls-ExportCustomizer-Formatter-View__preview img');
               this._bindEvents();
               var options = this._options;
               var fieldIds = options.fieldIds;
               if (fieldIds && fieldIds.length) {
                  if (!options.primaryUuid) {
                     this._callFormatterCreate();
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
            this.subscribeTo(this._formatterMenu, 'onActivated', function (evtName) {
               if (!this._isAppAllowed) {
                  this._formatterMenu.hidePicker();
                  this._startFormatEditing(false);
               }
            }.bind(this));

            this.subscribeTo(this._formatterMenu, 'onMenuItemActivate', function (evtName, selectedId) {
               this._startFormatEditing(selectedId === 'app');
            }.bind(this));

            this._preview.on('click', this._startFormatEditing.bind(this, false));
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
                  this._callFormatterMethods([{method:'clone', args:[options.primaryUuid, false]}, {method:'open', args:[useApp, true]}]);
               }
               else {
                  this._callFormatterOpen(useApp);
               }
            }
         },

         /**
          * Вызвать метод форматера "create" или "clone"
          *
          * @protected
          * @param {string} [fileUuid] Uuid стилевого эксель-файла. Если указан, то будет произведено клонирование (опционально)
          * @param {boolean} [updateCloned] И сразу обновить колонки у только что клонированного стилевого эксель-файла (только при клонировании) (опционально)
          * return {Core/Deferred}
          */
         _callFormatterCreate: function (fileUuid, updateCloned) {
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
                  this.sendCommand('subviewChanged');
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
            return promise;
         },

         /**
          * Вызвать метод форматера "update"
          *
          * @protected
          * return {Core/Deferred}
          */
         _callFormatterUpdate: function () {
            var options = this._options;
            var fieldIds = options.fieldIds;
            var promise = this._exportFormatter.update(options.fileUuid, fieldIds || [], this._getFieldTitles(fieldIds), options.serviceParams).addCallbacks(
               this._updatePreview.bind(this, false),
               function (err) { return err; }
            );
            // Запустить индикатор сразу
            this._waitIndicatorStart();
            return promise;
         },

         /**
          * Вызвать метод форматера "open" или "openApp"
          *
          * @protected
          * @param {boolean} useApp Открыть в отдельном приложении
          * @param {boolean} deleteNotChanged Удалить файл если он не будет изменён
          * return {Core/Deferred}
          */
         _callFormatterOpen: function (useApp, deleteNotChanged) {
            var options = this._options;
            var fieldIds = options.fieldIds;
            return this._exportFormatter[useApp ? 'openApp' : 'open'](options.fileUuid || options.primaryUuid, fieldIds || [], this._getFieldTitles(fieldIds), options.serviceParams).addCallbacks(
               function (result) {
                  if (result) {
                     this.sendCommand('subviewChanged', 'afterOpen');
                     this._updatePreview();
                  }
                  else
                  if (deleteNotChanged) {
                     this._callFormatterDelete(options.fileUuid);
                     options.fileUuid = null;
                  }
               }.bind(this),
               function (err) { return err; }
            );
         },

         /**
          * Вызвать метод форматера "delete"
          *
          * @protected
          * @param {string} fileUuid Uuid стилевого эксель-файла
          * return {Core/Deferred}
          */
         _callFormatterDelete: function (fileUuid) {
            return this._exportFormatter.remove(fileUuid).addCallbacks(
               function (result) {},
               function (err) { return err; }
            );
         },

         /**
          * Получить список отображаемых названий полей для указанного списка полей данных
          *
          * @protected
          * @param {Array<string>} fieldIds Список идентификаторв полей данных
          * return {Array<string>}
          */
         _getFieldTitles: function (fieldIds) {
            return fieldIds && fieldIds.length ? this._selectFields(this._options.allFields, fieldIds, function (v) { return v.title; }) || [] : [];
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
          * Запустить индикатор ожидания
          *
          * @protected
          * @param {boolean} isForced Запустить заново, если индикатор уже запущен
          */
         _waitIndicatorStart: function (isForced) {
            if (isForced) {
               this._updatePreviewClearStop();
            }
            if (!this._waitIndicatorStopper) {
               WaitIndicator.make({target:this._preview[0].parentNode, overlay:'dark', delay:0}, this._waitIndicatorStopper = new Deferred());
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
            this._exportFormatter.getPreviewUrl(options.fileUuid || options.primaryUuid, size.width, size.height).addCallbacks(
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
          * Завершить транзакцию
          *
          * @protected
          * @param {boolean} isCommit Сохранить или откатить изменения
          * @param {object} saving Дополнительные опции сохранения
          * @param {boolean} saving.isClone В транзакции производилось клонирование - нельзя удалять исходный файл (только при сохранении)
          * @return {Core/Deferred<string>}
          */
         _endTransaction: function (isCommit, saving) {
            var options = this._options;
            var fileUuid = options.fileUuid;
            if (!isCommit) {
               options.consumerId = null;
            }
            if (isCommit && saving && saving.isClone && !fileUuid) {
               return this._callFormatterCreate(options.primaryUuid, false).addCallback(this._endTransaction.bind(this, true, saving));
            }
            var deleteUuid = isCommit ? (saving && saving.isClone ? null : options.primaryUuid) : fileUuid;
            if (deleteUuid) {
               this._callFormatterDelete(deleteUuid);
            }
            if (isCommit) {
               options.primaryUuid = fileUuid;
            }
            options.fileUuid = null;
            return Deferred.success(fileUuid);
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
            if (meta) {
               var args = meta.args;
               switch (meta.reason) {
                  case 'delete':
                     this._callFormatterDelete(args[0]);
                     return;
                  case 'transaction':
                     return this._endTransaction(args[0], args[1]);
               }
            }
            var options = this._options;
            var changes = objectChange(options, values, {fieldIds:true, primaryUuid:false, fileUuid:false, consumerId:false});
            if (changes) {
               var fieldIds = options.fieldIds;
               var hasFields = !!(fieldIds && fieldIds.length);
               var methods = [];
               if (hasFields) {
                  //Если не поменялся consumerId, но поменялись поля; или если это клонирование с изменением
                  if ((!('consumerId' in changes) && 'fieldIds' in changes) || (meta && meta.reason === 'clone' && meta.args[0] && meta.args[0].isChanged)) {
                     if (!options.fileUuid) {
                        var primaryUuid = options.primaryUuid;
                        methods.push(primaryUuid ? {method:'clone', args:[primaryUuid, true]} : 'create');
                     }
                     else {
                        methods.push('update');
                     }
                  }
               }
               if (methods.length) {
                  this._callFormatterMethods(methods);
               }
               else {
                  this._updatePreview();
               }
               this.setEnabled(hasFields);
               this.setVisible(hasFields);
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
            var formatter = this._exportFormatter;
            if (typeof formatter.clear === 'function') {
               formatter.clear();
            }
            View.superclass.destroy.apply(this, arguments);
         }
      });

      return View;
   }
);
