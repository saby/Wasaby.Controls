/**
 * Контрол "Ссылка-меню, открывающая настройщик экспорта"
 *
 * Для того, чтобы возможно было использовать сохранямые и редактируемые пресеты (предустановленные сочетания параметров экспорта), необходимо подключить модуль 'WS3ExportPresets/Loader'
 *
 * Кроме указанных опций доступны все опции компонента {@link SBIS3.CONTROLS/Menu/MenuLink}
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/MenuLink
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/MenuLink',
   [
      'Core/Deferred',
      'Core/core-merge',
      'Core/RightsManager',
      'SBIS3.CONTROLS/CompoundControl',
      'WS.Data/Di',
      'WS.Data/Collection/RecordSet',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/MenuLink',
      'css!SBIS3.CONTROLS/ExportCustomizer/MenuLink',

      'i18n!SBIS3.CONTROLS/ExportCustomizer/MenuLink'
   ],

   function (Deferred, cMerge, RightsManager, CompoundControl, Di, RecordSet, tmpl) {
      'use strict';

      /**
       * @typedef {object} ExportPreset Тип, содержащий информацию о предустановленных настройках экспорта
       * @property {string|number} id Идентификатор пресета
       * @property {string} title Отображаемое название пресета
       * @property {Array<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
       * @property {string} fileUuid Uuid стилевого эксель-файла
       */

      /**
       * @typedef {object} ExportPresetGroup Тип, содержащий информацию о группе пунктов меню, содержащей пресеты
       * @property {string} icon Пиктограмка, которая будет показана у первого пресета (опционально)
       * @property {string} caption Название, которым будет заменено название первого статического пресета (опционально)
       * @property {Array<ExportPreset>} staticPresets Список неизменяемых пресетов (предустановленных настроек экспорта) (опционально)
       * @property {string} namespace Пространство имён для сохранения пользовательских пресетов (опционально)
       * @property {string} accessZone Зона доступа пользовательских пресетов (опционально)
       */

      /**
       * @event onMenuItemActivate Происходит при выборе пункта меню
       * @param {Core/EventObject} evtDescriptor Дескриптор события
       * @param {string} menuItemId Идентификатор выбранного пункта меню
       * @param {object} domEvent Исходное событие
       * @param {boolean} skipCustomization Применить пресет сразу, без показа настройщика экспорта
       */

      /**
       * Имя регистрации объекта, предоставляющего методы загрузки и сохранения пользовательских пресетов, в инжекторе зависимостей
       * @private
       * @type {string}
       */
      var _DI_STORAGE_NAME = 'ExportPresets.Loader';

      var ExportMenuLink = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ExportCustomizer/MenuLink.prototype*/ {
         _dotTplFn: tmpl,
         $protected: {
            _options: {
               idProperty: 'id',
               /**
                * @cfg {ExportPresetGroup} Опции группы пунктов меню, содержащей пресеты
                */
               presetGroup: null,
               /**
                * @cfg {Array<object>} Список объектов с опциями для пунктов меню, которые будут показаны над пунктами пресетов (опционально)
                */
               items: null
            },
            _storage: null,
            _menuLink: null
         },

         _modifyOptions: function () {
            var options = ExportMenuLink.superclass._modifyOptions.apply(this, arguments);
            var scope = options._scope = cMerge({}, options);
            scope.handlers = cMerge({}, scope.handlers);
            delete scope.items;
            delete scope.handlers.onMenuItemActivate;
            return options;
         },

         init: function () {
            this._publish('onMenuItemActivate');
            ExportMenuLink.superclass.init.apply(this, arguments);
            var menuLink = this._menuLink = this.getChildControlByName('controls-ExportCustomizer-MenuLink__menuLink');
            if (Di.isRegistered(_DI_STORAGE_NAME)) {
               this._storage = Di.resolve(_DI_STORAGE_NAME);
            }
            //this._update();
            this.subscribeTo(menuLink, 'onActivated', function () {
               this._update().addCallback(menuLink.showPicker.bind(menuLink));
            }.bind(this));
            this.subscribeTo(menuLink, 'onMenuItemActivate', function (evt, menuItemId, origEvt) {
               var item = menuLink.getItems().getRecordById(menuItemId).getRawData();
               if (item.isPreset) {
                  this._notify('onMenuItemActivate', menuItemId, origEvt, !$(origEvt.target).hasClass('controls-ExportCustomizer-MenuLink__edit'));
               }
               else {
                  this._notify('onMenuItemActivate', menuItemId, origEvt);
               }
            }.bind(this));
         },

         _update: function () {
            var menuLink = this._menuLink;
            return this._makeItems().addCallback(menuLink.setItems.bind(menuLink));
         },

         _makeItems: function () {
            var options = this._options;
            var presetGroup = options.presetGroup;
            var storage = this._storage;
            var canUseCustom = !!(storage && presetGroup && presetGroup.namespace);
            var canSetCustom;
            if (canUseCustom) {
               canSetCustom = true;
               var accessZone = presetGroup.accessZone;
               if (accessZone) {
                  var rights = RightsManager.getRights(accessZone)[accessZone];
                  canUseCustom = !!(rights & RightsManager.READ_MASK);
                  canSetCustom = !!(rights & RightsManager.WRITE_MASK);
               }
            }
            return (canUseCustom ? storage.load(presetGroup.namespace/*, presetGroup.accessZone*/) : Deferred.success(null)).addCallback(function (presets) {
               var items = [];
               var _mapper = function (preset) { return cMerge({isPreset:true}, preset); };
               var statics = presetGroup ? presetGroup.staticPresets : null;
               if (statics && statics.length) {
                  items.push.apply(items, statics.map(_mapper));
                  var presetCaption = presetGroup ? presetGroup.caption : null;
                  if (presetCaption) {
                     items[0].title = presetCaption;
                  }
               }
               if (presets && presets.length) {
                  items.push.apply(items, presets.map(canSetCustom ? function (preset) {
                     var item = cMerge({isPreset:true, className:'controls-ExportCustomizer-MenuLink__dual'}, preset);
                     item.title = '<span class="controls-ExportCustomizer-MenuLink__edit icon-16 icon-Edit icon-primary action-hover" title="' + rk('Редактировать шаблон', 'НастройщикЭкспорта') + '"></span>' + item.title;
                     return item;
                  } : _mapper));
               }
               if (items.length) {
                  var presetIcon = presetGroup ? presetGroup.icon : null;
                  if (presetIcon) {
                     items[0].icon = presetIcon;
                  }
               }
               var firstItems = options.items;
               if (firstItems && firstItems.length) {
                  items.unshift.apply(items, firstItems);
               }
               if (canSetCustom) {
                  items.push({id:'', title:rk('Создать новый шаблон', 'НастройщикЭкспорта'), className:'controls-ExportCustomizer-MenuLink__last'});
               }
               return new RecordSet({
                  rawData: items,
                  idProperty: 'id'
               });
            });
         }
      });



      return ExportMenuLink;
   }
);
