/**
 * Контрол "Ссылка-меню, открывающая настройщик экспорта"
 *
 * Для того, чтобы возможно было использовать сохранямые и редактируемые пресеты (предустановленные сочетания параметров экспорта), необходимо подключить модуль 'SBIS3.ENGINE/Controls/ExportPresets/Loader'
 *
 * Кроме указанных опций доступны все опции компонента {@link SBIS3.CONTROLS/ExportCustomizer/MenuLink}
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/MenuLink
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/MenuLink',
   [
      'Core/Deferred',
      'SBIS3.CONTROLS/CompoundControl',
      'WS.Data/Di',
      'WS.Data/Collection/RecordSet',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/MenuLink',
      'css!SBIS3.CONTROLS/ExportCustomizer/MenuLink'
   ],

   function (Deferred, CompoundControl, Di, RecordSet, tmpl) {
      'use strict';

      /**
       * @typedef {object} ExportPreset Тип, содержащий информацию о предустановленных настройках экспорта
       * @property {string|number} id Идентификатор пресета
       * @property {string} title Отображаемое название пресета
       * @property {Array<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
       * @property {string} fileUuid Uuid стилевого эксель-файла
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
                * @cfg {Array<ExportPreset>} Список неизменяемых пресетов (предустановленных настроек экспорта) (опционально)
                */
               staticPresets: null,
               /**
                * @cfg {string} Пространство имён для сохранения пользовательских пресетов (опционально)
                */
               presetNamespace: null
            },
            _storage: null,
            _menuLink: null
         },

         init: function () {
            ExportMenuLink.superclass.init.apply(this, arguments);
            var menuLink = this._menuLink = this.getChildControlByName('controls-ExportCustomizer-MenuLink__menuLink');
            if (Di.isRegistered(_DI_STORAGE_NAME)) {
               this._storage = Di.resolve(_DI_STORAGE_NAME);
            }
            //this._update();
            this.subscribeTo(menuLink, 'onActivated', function () {
               this._update().addCallback(menuLink.showPicker.bind(menuLink));
            }.bind(this));
         },

         _update: function () {
            var menuLink = this._menuLink;
            return this._makeItems().addCallback(menuLink.setItems.bind(menuLink));
         },

         _makeItems: function () {
            var options = this._options;
            var storage = this._storage;
            return (storage ? storage.load(options.presetNamespace) : Deferred.success(null)).addCallback(function (presets) {
               var items = [];
               if (presets && presets.length) {
                  items.push.apply(items, presets);
               }
               var statics = options.staticPresets;
               if (statics && statics.length) {
                  items.push.apply(items, statics);
               }
               items.push({id:'', title:rk('Создать новый шаблон', 'НастройщикЭкспорта'), className:'controls-ExportCustomizer-MenuLink__last'});
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
