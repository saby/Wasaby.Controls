/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.DataSet', [
   'js!SBIS3.CONTROLS.Data.Model',
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableList'
], function (Model, List, RecordSet, ObservableList) {
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
             * @see getSource
             * @see SBIS3.CONTROLS.Data.Source.ISource
             */
            source: null,

            /**
             * @cfg {SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с данными
             * @see getAdapter
             * @see SBIS3.CONTROLS.Data.Adapter.IAdapter
             */
            adapter: null,

            /**
             * @cfg {String} Сырые данные, выданные источником
             * @see getRawData
             * @see setRawData
             */
            rawData: null,

            /**
             * @cfg {Function} Конструктор модели, по умолчанию {@link SBIS3.CONTROLS.Data.Model}
             * @see getModel
             * @see setModel
             * @see SBIS3.CONTROLS.Data.Model
             */
            model: Model,

            /**
             * @cfg {Function} Конструктор списка моделей, по умолчанию {@link SBIS3.CONTROLS.Data.Collection.ObservableList}
             * @see getListModule
             * @see setListModule
             * @see SBIS3.CONTROLS.Data.Collection.List
             */
            listModule: List,

            /**
             * @cfg {String} Поле модели, содержащее первичный ключ
             * @see getIdProperty
             * @see setIdProperty
             * @see SBIS3.CONTROLS.Data.Model#idProperty
             */
            idProperty: '',

            /**
             * @cfg {String} Свойство данных, в которых находится выборка
             * @see getItemsProperty
             * @see setItemsProperty
             */
            itemsProperty: '',

            /**
             * @cfg {String} Свойство данных, в которых находится общее число элементов выборки
             * @see getTotalProperty
             * @see setTotalProperty
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
      },

      //region Public methods

      /**
       * Возвращает источник, из которого получены данные
       * @returns {SBIS3.CONTROLS.Data.Source.ISource}
       * @see source
       * @see SBIS3.CONTROLS.Data.Source.ISource
       */
      getSource: function () {
         return this._options.source;
      },

      /**
       * Возвращает адаптер для работы с данными
       * @returns {SBIS3.CONTROLS.Data.Adapter.IAdapter}
       * @see adapter
       * @see SBIS3.CONTROLS.Data.Adapter.IAdapter
       */
      getAdapter: function () {
         return this._options.adapter;
      },

      /**
       * Возвращает конструктор модели
       * @returns {Function}
       * @see setModel
       * @see model
       * @see SBIS3.CONTROLS.Data.Model
       */
      getModel: function () {
         return this._options.model;
      },

      /**
       * Устанавливает конструктор модели
       * @param {Function} model
       * @see getModel
       * @see model
       * @see SBIS3.CONTROLS.Data.Model
       */
      setModel: function (model) {
         this._options.model = model;
      },

      /**
       * Возвращает конструктор списка моделей
       * @returns {Function}
       * @see setListModule
       * @see listModule
       * @see SBIS3.CONTROLS.Data.Collection.List
       */
      getListModule: function () {
         return this._options.listModule;
      },

      /**
       * Устанавливает конструктор списка моделей
       * @param {Function} listModule
       * @see getListModule
       * @see listModule
       * @see SBIS3.CONTROLS.Data.Collection.List
       */
      setListModule: function (listModule) {
         this._options.listModule = listModule;
      },

      /**
       * Возвращает свойство модели, содержащее первичный ключ
       * @returns {String}
       * @see setIdProperty
       * @see idProperty
       * @see SBIS3.CONTROLS.Data.Model#idProperty
       */
      getIdProperty: function () {
         return this._options.idProperty;
      },

      /**
       * Устанавливает свойство модели, содержащее первичный ключ
       * @param {String} name
       * @see getIdProperty
       * @see idProperty
       * @see SBIS3.CONTROLS.Data.Model#idProperty
       */
      setIdProperty: function (name) {
         this._options.idProperty = name;
      },

      /**
       * Возвращает свойство данных, в которых находится выборка
       * @returns {String}
       * @see setItemsProperty
       * @see itemsProperty
       */
      getItemsProperty: function () {
         return this._options.itemsProperty;
      },

      /**
       * Устанавливает свойство данных, в которых находится выборка
       * @param {String} name
       * @see getItemsProperty
       * @see itemsProperty
       */
      setItemsProperty: function (name) {
         this._options.itemsProperty = name;
      },

      /**
       * Возвращает свойство данных, в которых находится выборка
       * @returns {String}
       * @see setTotalProperty
       * @see totalProperty
       */
      getTotalProperty: function () {
         return this._options.totalProperty;
      },

      /**
       * Устанавливает свойство данных, в которых находится выборка
       * @param {String} name
       * @see getTotalProperty
       * @see totalProperty
       */
      setTotalProperty: function (name) {
         this._options.totalProperty = name;
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
         if($ws.helpers.isEqualObject(this._options.listModule, RecordSet)){
            return new RecordSet({
               rawData: this._getDataProperty(property),
               adapter: this.getAdapter(),
               model: this._options.model
            });
         } else {
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
         }
         return observable ? new ObservableList({
            items: items
         }) : new this._options.listModule({
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
       * @see setRawData
       * @see rawData
       */
      getRawData: function() {
         return this._options.rawData;
      },

      /**
       * Устанавливает сырые данные
       * @param rawData {Object} Сырые данные
       * @see getRawData
       * @see rawData
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
