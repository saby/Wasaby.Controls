/**
 * Простая оболочка над ^^^SBIS3.ENGINE/Controls/ExportPresets/Loader для имплементации интерфейса WS.Data/Source/ISource
 *
 * @class SBIS3.CONTROLS/ExportCustomizer/LinkDataSource
 * @implements WS.Data/Source/ISource
 * @author Спирин В.А.
 * @public
 */
define('SBIS3.CONTROLS/ExportCustomizer/LinkDataSource',
   [
      'Core/core-extend',
      'Core/Deferred',
      'WS.Data/Di',
      'WS.Data/Entity/ObservableMixin',
      'WS.Data/Source/DataSet',
      'WS.Data/Source/ISource'
   ],

   function (CoreExtend, Deferred, Di, ObservableMixin, DataSet, ISource) {
      'use strict';

      /**
       * Имя регистрации объекта, предоставляющего методы загрузки и сохранения пользовательских пресетов, в инжекторе зависимостей
       * @private
       * @type {string}
       */
      var _DI_STORAGE_NAME = 'ExportPresets.Loader';

      /**
       * Простая оболочка над ^^^SBIS3.ENGINE/Controls/ExportPresets/Loader для имплементации интерфейса WS.Data/Source/ISource
       * @public
       * @type {WS.Data/Source/ISource}
       */
      var DataSource = CoreExtend.extend({}, [ISource, ObservableMixin], /** @lends SBIS3.CONTROLS/ExportCustomizer/LinkDataSource.prototype */{
         $protected: {
            _options: {
               navigationType: 'Page',
               namespace: null
            },
            _storage: null
         },

         $constructor: function () {
            this._publish('onBeforeProviderCall');
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
            return this._options;
         },

         /**
          * Возвращает дополнительные настройки источника данных.
          * @param {Object}
          */
         setOptions: function (options) {
            this._options = options;
         },

         /**
          * Выполняет запрос на выборку
          * @param {WS.Data/Query/Query} [query] Запрос
          * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Source/DataSet}.
          */
         query: function (query) {
            this._notify('onBeforeProviderCall');
            return (this._storage ? this._storage.load(this._options.namespace) : Deferred.success(null)).addCallback(function (presets) {
               return new DataSet({
                  rawData: {
                     items: presets,
                     more: false
                  },
                  idProperty: 'id',
                  itemsProperty: 'items',
                  totalProperty: 'more'
               });
            });
         },
      });



      return DataSource;
   }
);
