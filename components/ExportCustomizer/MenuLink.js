/**
 * Контрол "Ссылка-меню, открывающая настройщик экспорта"
 *
 * Для того, чтобы возможно было использовать сохранямые и редактируемые пресеты (предустановленные сочетания параметров экспорта), необходимо подключить модуль 'SBIS3.ENGINE/Controls/ExportPresets/Loader'
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/MenuLink
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/MenuLink',
   [
      'Core/core-extend',
      'Core/Deferred',
      'SBIS3.CONTROLS/Menu/MenuLink',
      'WS.Data/Di',
      'WS.Data/Entity/ObservableMixin',
      'WS.Data/Source/DataSet',
      'WS.Data/Source/ISource'
   ],

   function (CoreExtend, Deferred, MenuLink, Di, ObservableMixin, DataSet, ISource) {
      'use strict';

      /**
       * @typedef {object} ExportPreset Тип, содержащий информацию о предустановленных настройках экспорта
       * @property {string|number} id Идентификатор пресета
       * @property {string} title Отображаемое название пресета
       * @property {Array<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
       * @property {string} fileUuid Uuid шаблона форматирования эксель-файла
       */

      var ExportMenuLink = MenuLink.extend(/**@lends SBIS3.CONTROLS/ExportCustomizer/MenuLink.prototype*/ {
         $protected: {
            _options: {
               /**
                * @cfg {Array<ExportPreset>} Список неизменяемых пресетов (предустановленных настроек экспорта) (опционально)
                */
               staticPresets: null,
               /**
                * @cfg {string} Пространство имён для сохранения пользовательских пресетов (опционально)
                */
               presetNamespace: null,
            },
         },

         _modifyOptions: function () {
            var options = ExportMenuLink.superclass._modifyOptions.apply(this, arguments);
            options.dataSource = new ExportMenuLinkDataSource({
               statics: options.staticPresets,
               namespace: options.presetNamespace
            });
            return options;
         }
      });



      /**
       * Имя регистрации объекта, предоставляющего методы загрузки и сохранения пользовательских пресетов, в инжекторе зависимостей
       * @private
       * @type {string}
       */
      var _DI_STORAGE_NAME = 'ExportPresets.Loader';

      /**
       * Простая оболочка над SBIS3.ENGINE/Controls/ExportPresets/Loader для имплементации интерфейса WS.Data/Source/ISource
       * @private
       * @type {WS.Data/Source/ISource}
       */
      var ExportMenuLinkDataSource = CoreExtend.extend({}, [ISource, ObservableMixin], /** @lends SBIS3.CONTROLS/ExportCustomizer/ExportMenuLinkDataSource.prototype */{
         $protected: {
            _options: {
               statics: null,
               namespace: null
            },
            _storage: undefined
         },

         /**
          * Возвращает имя свойства, в котором находится идентификатор
          * @return {string}
          */
         getIdProperty: function () {
            return 'id';
         },

         /**
          * Выполняет запрос на выборку
          * @param {WS.Data/Query/Query} [query] Запрос
          * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Source/DataSet}.
          */
         query: function (query) {
            var options = this._options;
            var storage = this._storage;
            if (storage === undefined) {
               this._storage = storage = Di.isRegistered(_DI_STORAGE_NAME) ? Di.resolve(_DI_STORAGE_NAME) : null;
            }
            return (storage ? storage.load(options.namespace) : Deferred.success(null)).addCallback(function (presets) {
               var items = [];
               var statics = options.statics;
               if (statics && statics.length) {
                  items.push.apply(items, statics);
               }
               if (presets && presets.length) {
                  items.push.apply(items, presets);
               }
               items.push({id:'', title:rk('Создать новый шаблон', 'НастройщикЭкспорта')});
               return new DataSet({
                  rawData: {
                     items: items,
                     more: false
                  },
                  idProperty: 'id',
                  itemsProperty: 'items',
                  totalProperty: 'more'
               });
            });
         },
      });



      return ExportMenuLink;
   }
);
