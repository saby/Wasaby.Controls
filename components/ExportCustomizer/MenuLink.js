/**
 * Контрол "Ссылка-меню, открывающая настройщик экспорта"
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
      'WS.Data/Source/ISource'/*^^^,
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/MenuLink',
      'css!SBIS3.CONTROLS/ExportCustomizer/MenuLink'*/
   ],

   function (CoreExtend, Deferred, MenuLink, Di, ObservableMixin, DataSet, ISource/*^^^, tmpl*/) {
      'use strict';

      /**
       * @typedef {object} ExportPreset Тип, содержащий информацию о предустановленных настройках экспорта
       * @property {string|number} id Идентификатор пресета
       * @property {string} title Отображаемое название пресета
       * @property {Array<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
       * @property {string} fileUuid Uuid шаблона форматирования эксель-файла
       */

      var ExportMenuLink = MenuLink.extend(/**@lends SBIS3.CONTROLS/ExportCustomizer/MenuLink.prototype*/ {
         /*^^^_dotTplFn: tmpl,*/
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
         }/*^^^,*/

         /*^^^$constructor: function () {
         },*/

         /*^^^init: function () {
          ExportMenuLink.superclass.init.apply(this, arguments);
         },*/

         /*destroy: function () {
          ExportMenuLink.superclass.destroy.apply(this, arguments);
         }*/
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
               namespace: null,
               navigationType: 'Page'
            },
            _storage: null
         },

         $constructor: function () {
            this._publish('onBeforeProviderCall');//^^^
         },

         init: function () {
            DataSource.superclass.init.apply(this, arguments);
            if (Di.isRegistered(_DI_STORAGE_NAME)) {
               this._storage = Di.resolve(_DI_STORAGE_NAME);
            }
         },

         /**
          * Возвращает дополнительные настройки источника данных.
          * @return {Object}
          */
         getOptions: function () {
            return this._options;//^^^
         },

         /**
          * Возвращает дополнительные настройки источника данных.
          * @param {Object}
          */
         setOptions: function (options) {
            this._options = options;//^^^
         },

         /**
          * Выполняет запрос на выборку
          * @param {WS.Data/Query/Query} [query] Запрос
          * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Source/DataSet}.
          */
         query: function (query) {
            this._notify('onBeforeProviderCall');//^^^
            var options = this._options;
            return (this._storage ? this._storage.load(options.namespace) : Deferred.success(null)).addCallback(function (presets) {
               var items = [];
               var statics = options.statics;
               if (statics && statics.length) {
                  items.push.apply(items, statics);
               }
               if (presets && presets.length) {
                  items.push.apply(items, presets);
               }
               items.push({id:null, title:rk('Создать новый шаблон', 'НастройщикЭкспорта')});
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
