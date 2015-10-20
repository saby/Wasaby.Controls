/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.DataSet', [
   'js!SBIS3.CONTROLS.Data.Collection.List'
], function (List) {
   'use strict';

   /**
    * Набор данных, полученный из источника
    * @class SBIS3.CONTROLS.Data.Source.DataSet
    * @public
    * @author Мальцев Алексей
    */

   /**
    * @faq Почему я вижу ошибки от $ws.single.ioc?
    * Для корректной работы с зависимости снала надо загрузить {@link SBIS3.CONTROLS.Data.Factory}, а уже потом {@link SBIS3.CONTROLS.Data.Source.DataSet}
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
             * @cfg {String} Данные, выданные источником
             */
            data: '',

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

      $constructor: function () {
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
       * @returns {SBIS3.CONTROLS.Data.Collection.IList}
       */
      getAll: function (property) {
         if (property === undefined) {
            property = this._options.itemsProperty;
         }
         var adapter = this.getAdapter().forTable(),
             data = this._getDataProperty(property),
             count = adapter.getCount(data),
             items = [];
         for (var i = 0; i < count; i++) {
            items.push(
               this._getModelInstance(
                  adapter.at(data, i)
               )
            );
         }

         return new List({
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
         if (property === undefined) {
            property = this._options.itemsProperty;
         }
         var adapter = this.getAdapter().forTable(),
            data = this._getDataProperty(property),
            type = adapter.getProperty(data, '_type');
         if (type === 'recordset') {
            if (adapter.getCount(data) > 0) {
               return this._getModelInstance(
                  adapter.at(data, 0)
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
       * @returns {Boolean}
       */
      getProperty: function (property) {
         return this._getDataProperty(property);
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
         return property ?
            this.getAdapter().getProperty(this._options.data, property) :
            this._options.data;
      },

      /**
       * Возвращает инстанс модели
       * @param {*} data Данные модели
       * @returns {Function}
       * @private
       */
      _getModelInstance: function (data) {
         return new this._options.model({
            source: this,
            data: data
         });
      },

      /**
       * Устанавливает данные в DataSet.
       * @param data {Object} Объект содержащий набор записе, формат объекта
       * должен соответсвовать текущей стратегии работы с данными.
       * @see strategy
       */
      setRawData: function(data) {
         this._options.data = data;
      },
      /**
       * Возвращает данные "как есть", в том виде в каком они были установлены.
       * @returns {Object}
       */
      getRawData: function() {
         return this._options.data;
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
