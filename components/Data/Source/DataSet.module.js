/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.DataSet', [
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableList'
], function (List, ObservableList) {
   'use strict';

   /**
    * Набор данных, полученный из источника
    * @class SBIS3.CONTROLS.Data.Source.DataSet
    * @public
    * @author Мальцев Алексей
    */

   var DataSet = $ws.core.extend({}, /** @lends SBIS3.CONTROLS.Data.Source.DataSet.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Source.DataSet',
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Source.ISource} Источник, из которого получены данные
             */
            source: undefined,

            /**
             * @cfg {SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с данными
             */
            adapter: undefined,

            /**
             * @cfg {String} Сырые данные, выданные источником
             */
            rawData: null,

            /**
             * @cfg {Function} Конструктор модели
             */
            model: undefined,

            /**
             * @cfg {String} Поле модели, содержащее первичный ключ
             */
            idProperty: '',

            /**
             * @cfg {String} Свойство данных, в которых находится выборка
             */
            itemsProperty: '',

            /**
             * @cfg {String} Свойство данных, в которых находится общее число элементов выборки
             */
            totalProperty: ''
         }
      },

      $constructor: function (cfg) {
         cfg = cfg || {};
         if ('data' in cfg && !('rawData' in cfg)) {
            this._options.rawData = cfg.data;
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.DataSet', 'option "data" is deprecated and will be removed in 3.7.20. Use "rawData" instead.');
         }
         if (!this._options.adapter && this._options.source) {
            this._options.adapter = this._options.source.getAdapter();
         }
         if (!this._options.model && this._options.source) {
            this._options.model = this._options.source.getModel();
         }
         if (!this._options.idProperty && this._options.source) {
            this._options.idProperty = this._options.source.getIdProperty();
         }
      },

      //region Public methods

      /**
       * Возвращает источник, из которого получены данные
       * @returns {SBIS3.CONTROLS.Data.Source.ISource}
       */
      getSource: function () {
         return this._options.source;
      },

      /**
       * Возвращает адаптер для работы с данными
       * @returns {SBIS3.CONTROLS.Data.Adapter.IAdapter}
       */
      getAdapter: function () {
         return this._options.adapter;
      },

      /**
       * Возвращает конструктор модели
       * @returns {Function}
       */
      getModel: function () {
         return this._options.model;
      },

      /**
       * Устанавливает конструктор модели
       * @param {Function} model
       */
      setModel: function (model) {
         this._options.model = model;
      },

      /**
       * Возвращает свойство модели, содержащее первичный ключ
       * @returns {String}
       */
      getIdProperty: function () {
         return this._options.idProperty;
      },

      /**
       * Устанавливает свойство модели, содержащее первичный ключ
       * @param {String} name
       */
      setIdProperty: function (name) {
         this._options.idProperty = name;
      },

      /**
       * Возвращает элементы выборки
       * @param {String} [property] Свойство данных, в которых находятся элементы выборки
       * @param {Boolean} [observable=false] Вернуть {SBIS3.CONTROLS.Data.Collection.ObservableList}, а не {SBIS3.CONTROLS.Data.Collection.List}
       * @returns {SBIS3.CONTROLS.Data.Collection.IList}
       */
      getAll: function (property, observable) {
         this._checkAdapter();
         if (property === undefined) {
            property = this._options.itemsProperty;
         }
         var adapter = this.getAdapter().forTable(this._getDataProperty(property)),
             count = adapter.getCount(),
             items = [];
         for (var i = 0; i < count; i++) {
            items.push(
               this._getModelInstance(
                  adapter.at(i)
               )
            );
         }

         return observable ? new ObservableList({
            items: items
         }) : new List({
            items: items
         });
      },

      /**
       * Возвращает общее число элементов выборки
       * @param {String} [property] Свойство данных, в которых находится общее число элементов выборки
       * @returns {*}
       */
      getTotal: function (property) {
         if (property === undefined) {
            property = this._options.totalProperty;
         }
         return this._getDataProperty(property);
      },

      /**
       * Возвращает модель
       * @param {String} [property] Свойство данных, в которых находится модель
       * @returns {SBIS3.CONTROLS.Data.Model|undefined}
       */
      getRow: function (property) {
         this._checkAdapter();
         if (property === undefined) {
            property = this._options.itemsProperty;
         }
         var data = this._getDataProperty(property),
            adapter = this.getAdapter().forTable(data),
            type = this.getAdapter().getProperty(data, '_type');
         if (type === 'recordset') {
            if (adapter.getCount() > 0) {
               return this._getModelInstance(
                  adapter.at(0)
               );
            }
         } else {
            return this._getModelInstance(
               data
            );
         }

         return undefined;
      },

      /**
       * Возвращает значение
       * @param {String} [property] Свойство данных, в которых находится значение
       * @returns {*}
       */
      getScalar: function (property) {
         if (property === undefined) {
            property = this._options.itemsProperty;
         }
         return this._getDataProperty(property);
      },

      /**
       * Проверяет наличие свойства в данных
       * @param {String} property Свойство
       * @returns {Boolean}
       */
      hasProperty: function (property) {
         return this._getDataProperty(property) !== undefined;
      },

      /**
       * Возвращает значение свойства в данных
       * @param {String} property Свойство
       * @returns {*}
       */
      getProperty: function (property) {
         return this._getDataProperty(property);
      },

      /**
       * Возвращает сырые данные
       * @returns {Object}
       */
      getRawData: function() {
         return this._options.rawData;
      },

      /**
       * Устанавливает сырые данные
       * @param rawData {Object} Сырые данные
       */
      setRawData: function(rawData) {
         this._options.rawData = rawData;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает свойство данных
       * @param {String} property Свойство
       * @returns {*}
       * @private
       */
      _getDataProperty: function (property) {
         this._checkAdapter();
         return property ?
            this.getAdapter().getProperty(this._options.rawData, property) :
            this._options.rawData;
      },

      /**
       * Возвращает инстанс модели
       * @param {*} rawData Данные модели
       * @returns {Function}
       * @private
       */
      _getModelInstance: function (rawData) {
         if (!this._options.model) {
            throw new Error('Model is not defined');
         }
         return new this._options.model({
            rawData: rawData,
            adapter: this.getAdapter(),
            source: this.getSource(),
            compatibleMode: true
         });
      },

      /**
       * Проверят наличие адаптера
       * @private
       */
      _checkAdapter: function () {
         if (!this._options.adapter) {
            throw new Error('Adapter is not defined');
         }
      }

      //endregion Protected methods

   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Source.DataSet', function(config) {
      return new DataSet(config);
   });
   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Source.DataSetConstructor', function() {
      return DataSet;
   });

   return DataSet;
});
