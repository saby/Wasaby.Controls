/**
 * Контрол "Форматирование экспортируемого файла настройщика экспорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/_Formatter/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/_Formatter/View',
   [
      'Core/helpers/Object/isEqual',
      'SBIS3.CONTROLS/CompoundControl',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Di',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Formatter/View',
      'css!SBIS3.CONTROLS/ExportCustomizer/_Formatter/View'
   ],

   function (cObjectIsEqual, CompoundControl, RecordSet, Di, dotTplFn) {
      'use strict';

      /**
       * @typedef {object} ExportFormatterResult Тип, описывающий возвращаемые настраиваемые значения компонента
       * @property {string} fileUuid Uuid шаблона форматирования эксель-файла
       *
       * @see fileUuid
       */

      /**
       * @typedef {object} ExportFormatterColumnInfo Тип, содержащий информацию об одной колонке экспортируемого файла
       * @property {string} id Идентификатор колонки (как правило, имя поля в базе данных или БЛ)
       * @property {string} title Отображаемое имя колонки
       * @property {*} * Другие свойства
       */

      /**
       * Имя регистрации объекта, предоставляющего методы форматирования шаблона эксель-файла, в инжекторе зависимостей
       * @private
       * @type {string}
       */
      var ExportFormatterName = 'ExportFormatter.Excel';



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
            _preview: null
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
            this._exportFormatter = Di.isRegistered(ExportFormatterName) ? Di.resolve(ExportFormatterName) : null;
            if (this._exportFormatter) {
               this._formatterMenu = this.getChildControlByName('controls-ExportCustomizer-Formatter-View__formatterMenu');
               this._preview = this.getContainer().find('.controls-ExportCustomizer-Formatter-View__preview img');
               this._bindEvents();
            }
            else {
               this.setEnabled(false);
               this.setVisible(false);
            }
         },

         _bindEvents: function () {
            this.subscribeTo(this._formatterMenu, 'onMenuItemActivate', function (evtName, selectedId) {
               this._startFormatEditing(selectedId === 'app');
            }.bind(this))
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
               this._exportFormatter[useApp ? 'openApp' : 'open'](options.fileUuid || null, this._makeFormatterColumns()).addCallbacks(
                  function (fileUuid) {
                     if (!options.fileUuid) {
                        options.fileUuid = fileUuid;
                        this.sendCommand('subviewChanged');
                     }
                     this._updatePreview();
                  }.bind(this),
                  function (err) {
                     //^^^
                     return err;
                  }.bind(this)
               );
            }
         },

         /**
          * Подготовить список колонок для форматера
          *
          * @protected
          * @return {Array<ExportFormatterColumnInfo>}
          */
         _makeFormatterColumns: function () {
            var options = this._options;
            var fieldIds = options.fieldIds;
            if (fieldIds && fieldIds.length) {
               var allFields = options.allFields;
               var isRecordSet = allFields instanceof RecordSet;
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
                  if (!field) {
                     throw new Error('Unknown field: ' + id);
                  }
                  return {id:id, title:field.title};
               });
            }
         },

         /**
          * Обновить изображение предпросмотра
          *
          * @protected
          */
         _updatePreview: function () {
            var url = this._exportFormatter.getPreviewUrl(this._options.fileUuid);
            this._preview[0].src = url;
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
               if (has.fileUuid) {
                  //^^^
               }
               else {
                  //^^^
               }
            }
            else
            if (has.fileUuid) {
               //^^^
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
         }
      });

      return View;
   }
);
