/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Model', [
   'js!SBIS3.CONTROLS.Data.ISerializable',
   'js!SBIS3.CONTROLS.Data.SerializableMixin',
   'js!SBIS3.CONTROLS.Data.IPropertyAccess',
   'js!SBIS3.CONTROLS.Data.IHashable',
   'js!SBIS3.CONTROLS.Data.HashableMixin',
   'js!SBIS3.CONTROLS.Data.ContextField',
   'js!SBIS3.CONTROLS.Data.Factory',
   'js!SBIS3.CONTROLS.Data.Adapter.Json'
], function (ISerializable, SerializableMixin, IPropertyAccess, IHashable, HashableMixin, ContextField, Factory, JsonAdapter) {
   'use strict';

   /**
    * Модель - обеспечивает доступ к данным субъекта предметной области
    * @class SBIS3.CONTROLS.Data.Model
    * @extends $ws.proto.Abstract
    * @mixes SBIS3.CONTROLS.Data.ISerializable
    * @mixes SBIS3.CONTROLS.Data.SerializableMixin
    * @mixes SBIS3.CONTROLS.Data.IPropertyAccess
    * @mixes SBIS3.CONTROLS.Data.IHashable
    * @mixes SBIS3.CONTROLS.Data.HashableMixin
    * @public
    * @author Мальцев Алексей
    */

   var Model = $ws.proto.Abstract.extend([ISerializable, SerializableMixin, IPropertyAccess, IHashable, HashableMixin], /** @lends SBIS3.CONTROLS.Data.Model.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Model',
      $protected: {
         _options: {
            /**
             * @cfg {Object} Данные в "сыром" виде
             * @example
             * <pre>
             *    var user = new Model({
             *       data: {
             *          id: 1,
             *          firstName: 'John',
             *          lastName: 'Smith'
             *       }
             *    });
             *    user.get('id');//5
             *    user.get('firstName');//John
             * </pre>
             * @see getRawData
             * @see setRawData
             */
            data: {},

            /**
             * @cfg {SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с данными
             * @example
             * <pre>
             *    var user = new Model({
             *       adapter: new SbisAdapter()
             *    });
             * </pre>
             * @see getAdapter
             * @see setAdapter
             */
            adapter: undefined,

            /**
             * @typedef {Object} Property
             * @property {*|Function} def Значение по умолчанию
             * @property {Function} [get] Метод, возвращающий значение свойства. Первым аргументом придет значение свойства в сырых данных.
             * @property {Function} [set] Метод, устанавливающий значение свойства.
             */

            /**
             * @cfg {Object.<String, Property>} Свойства модели. Дополняют/уточняют свойства, уже существующие в сырых данных.
             * @example
             * <pre>
             *    var User = Model.extend({
             *       $protected: {
             *          _options: {
             *             properties: {
             *                id: {
             *                   get: function(value) {
             *                      return '№' + value;
             *                   }
             *                },
             *                displayName: {
             *                   get: function() {
             *                      return this.get('firstName') + ' a.k.a "' + this.get('login') + '" ' + this.get('lastName');
             *                   }
             *                }
             *             }
             *          }
             *       }
             *    });
             *    var user = new User({
             *       data: {
             *          id: 5,
             *          login: 'Keanu',
             *          firstName: 'Johnny',
             *          lastName: 'Mnemonic',
             *          job: 'Memory stick'
             *       }
             *    });
             *    user.get('id');//№5
             *    user.get('displayName');//Johnny a.k.a "Keanu" Mnemonic
             *    user.get('job');//Memory stick
             *    user.get('uptime');//undefined
             * </pre>
             * @see getProperties
             */
            properties: {},

            /**
             * @cfg {String} Поле, содержащее первичный ключ
             * @see getIdProperty
             * @see setIdProperty
             */
            idProperty: '',

            /**
             * @cfg {Boolean} Использовать вложенные рекордсеты как List, а не как DataSet. По умолчанию - true
             */
            usingDataSetAsList: true
         },

         _hashPrefix: 'model-',

         /**
          * @var {Boolean} Признак, что модель существует в источнике данных
          */
         _isStored: false,

         /**
          * @var {Boolean} Признак, что модель удалена из источника данных
          */
         _isDeleted: false,

         /**
          * @var {Boolean} Признак, что модель изменения модели не синхронизированы с хранилищем данных
          */
         _isChanged: false,

         /**
          * @var {Object} Объект содержащий закэшированные инстансы значений-объектов
          */
         _propertiesCache: {},

         /**
          * @var {Object} Объект содержащий названия свойств, для которых сейчас выполняется вычисление значения
          */
         _nowCalculatingProperties: {},

         /**
          * @var {Object} Работа в режиме совместимости API
          */
         _compatibleMode: false
      },

      $constructor: function (cfg) {
         cfg = cfg || {};
         this._publish('onPropertyChange');

         //TODO: убрать после перехода на ISource
         this._compatibleMode = cfg.compatibleMode;

         this._options.idProperty = this._options.idProperty || '';
         this._initAdapter();
         if (!this._options.idProperty) {
            this._options.idProperty = this.getAdapter().getKeyField(this._options.data);
         }
         this.setRawData(this._options.data, true);
      },

      // region SBIS3.CONTROLS.Data.SerializableMixin

      _getSerializableState: function() {
         return $ws.core.merge(
            Model.superclass._getSerializableState.call(this), {
               _hash: this.getHash(),
               _isStored: this._isStored,
               _isDeleted: this._isDeleted,
               _isChanged: this._isChanged,
               _compatibleMode: this._compatibleMode
            }
         );
      },

      // endregion SBIS3.CONTROLS.Data.SerializableMixin

      // region SBIS3.CONTROLS.Data.IPropertyAccess

      get: function (name) {
         if (this._propertiesCache.hasOwnProperty(name)) {
            return this._propertiesCache[name];
         }

         if (!this.has(name)) {
            return undefined;
         }

         var property = this._options.properties[name],
            value = this._getOriginalPropertyValue(name);
         if (value === undefined && 'def' in property) {
            value = typeof property.def === 'function' ? property.def() : property.def;
            this._setOriginalPropertyValue(name, value);
         }
         if (property.get) {
            value = this._getCalculatedValue(name, value, property, true);
         }

         //Инстансы объектов кэшируем
         if (value && typeof value === 'object') {
            this._propertiesCache[name] = value;
         }

         return value;
      },

      set: function (name, value) {
         if (!name) {
            $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Model::set()', 'Property name is empty');
         }

         if (!this.has(name)) {
            this._addProperty(name);
         }

         var property = this._options.properties[name];
         if (property && property.set) {
            value = this._getCalculatedValue(name, value, property, false);
         }

         if (this._getOriginalPropertyValue(name) !== value) {
            this._setOriginalPropertyValue(name, value);
            this._setChanged(true);
            if (value && typeof value === 'object') {
               this._propertiesCache[name] = value;
            }
            this._notify('onPropertyChange', name, value);
         }
      },

      has: function (name) {
         return this._options.properties.hasOwnProperty(name);
      },

      // endregion SBIS3.CONTROLS.Data.IPropertyAccess

      //TODO: поддержать данный интерфейс явно
      // region SBIS3.CONTROLS.Data.Collection.IEnumerable

      /**
       * Перебирает все свойства модели
       * @param {Function(*, Number)} callback Ф-я обратного вызова для каждого свойства. Первым аргументом придет название свойства, вторым - его значение.
       * @param {Object} [context] Конекст вызова callback.
       */
      each: function (callback, context) {
         for (var  name in this._options.properties) {
            if (this._options.properties.hasOwnProperty(name)) {
               callback.call(
                  context || this,
                  name,
                  this.get(name)
               );
            }
         }
      },

      // endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      // region Public methods

      /**
       * Возвращает адаптер для работы с данными
       * @returns {SBIS3.CONTROLS.Data.Adapter.IAdapter}
       * @see adapter
       * @see setAdapter
       */
      getAdapter: function () {
         return this._options.adapter;
      },

      /**
       * Устанавливает адаптер для работы с данными
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter
       * @see adapter
       * @see getAdapter
       */
      setAdapter: function (adapter) {
         this._options.adapter = adapter;
         this._propertiesCache = {};
      },

      /**
       * Возвращает cвойства модели
       * @returns {Object.<String, Property>}
       * @see properties
       */
      getProperties: function () {
         return this._options.properties;
      },

      /**
       * Возвращает признак, что вложенные рекордсеты используются как List, а не как DataSet
       * @returns {Boolean}
       * @see usingDataSetAsList
       * @see setUsingDataSetAsList
       */
      isUsingDataSetAsList: function () {
         return this._options.usingDataSetAsList;
      },

      /**
       * Устанавливает признак, что вложенные рекордсеты используются как List, а не как DataSet
       * @param {Boolean} usingDataSetAsList Вложенные рекордсеты использовать как List, а не как DataSet
       * @see usingDataSetAsList
       * @see isUsingDataSetAsList
       */
      setUsingDataSetAsList: function (usingDataSetAsList) {
         this._options.usingDataSetAsList = usingDataSetAsList;
      },


      /**
       * Клонирует модель
       * @returns {SBIS3.CONTROLS.Data.Model}
       */
      clone: function() {
         var clone = new Model($ws.core.clone(this._options));
         clone._isStored = this._isStored;
         clone._isChanged = this._isChanged;
         clone._isDeleted = this._isDeleted;
         clone._initProperties();
         return clone;
      },

      /**
       * Объединяет модель с данными и состоянием другой модели
       * @param {SBIS3.CONTROLS.Data.Model} model Модель, с которой будет произведено объединение
       */
      merge: function (model) {
         model.each(function(field, value) {
            this.set(field, value);
         }, this);
         this._isStored = this._isStored || model._isStored;
         this._isDeleted = this._isDeleted || model._isDeleted;
         this._initProperties();
      },

      /**
       * Возвращает признак, что модель удалена
       * @returns {Boolean}
       */
      isDeleted: function () {
         return this._isDeleted;
      },

      /**
       * Возвращает признак, что модель изменена
       * @returns {Boolean}
       */
      isChanged: function () {
         return this._isChanged;
      },

      /**
       * Возвращает значение первичного ключа модели
       * @returns {*}
       */
      getId: function () {
         if (!this._options.idProperty) {
            throw new Error('Id property is not defined');
         }
         return this.get(this._options.idProperty);
      },

      /**
       * Возвращает свойство, в котором хранится первичный ключ модели
       * @returns {String}
       */
      getIdProperty: function () {
         return this._options.idProperty;
      },

      /**
       * Устанавливает свойство, в котором хранится первичный ключ модели
       * @param {String} idProperty Первичный ключ модели.
       */
      setIdProperty: function (idProperty) {
         this._options.idProperty = idProperty;
      },

      /**
       * Возвращает данные модели в "сыром" виде
       * @returns {Object}
       */
      getRawData: function () {
         return this._options.data;
      },

      /**
       * Устанавливает данные модели в "сыром" виде
       * @param {Object} data Данные модели
       */
      setRawData: function (data, silent) {
         this._options.data = data || {};
         this._propertiesCache = {};
         this._initProperties();
         if (!silent) {
            this._notify('onPropertyChange');
         }
      },

      /**
       * Возвращает признак, что модель существует в источнике данных
       * @returns {Boolean}
       */
      isStored: function () {
         return this._isStored;
      },

      /**
       * Устанавливает, существует ли модель в источнике данных
       * @param {Boolean} stored Модель существует в источнике данных
       */
      setStored: function (stored) {
         this._isStored = stored;
      },

      /**
      * Возвращает строку с данными в формате json
      * @returns {String}
      */
      toString: function() {
         var data = {};
         this.each(function(field, value) {
            data[field] = value;
         });
         return JSON.stringify(data);
      },

      // endregion Public methods

      //region Protected methods

      /**
       * Инициализирует адаптер
       * @private
       */
      _initAdapter: function() {
         if (!this._options.adapter && this._options.source) {
            this._options.adapter = this._options.source.getAdapter();
         }
         if (!this._options.adapter) {
            this._options.adapter = new JsonAdapter();
         }
      },

      /**
       * Инициализирует свойства модели
       * @private
       */
      _initProperties: function() {
         var adapter = this._options.adapter.forRecord(),
            fields = adapter.getFields(this._options.data),
            i,
            length;
         for (i = 0, length = fields.length; i < length; i++) {
            if (!this._options.properties.hasOwnProperty(fields[i])) {
               this._options.properties[fields[i]] = {};
            }
         }
      },

      /**
       * Добавляет свойство модели
       * @private
       */
      _addProperty: function(name) {
         this._options.properties[name] = {};
      },

      /**
       * Возвращает значение свойства из сырых данных
       * @param {String} name Название свойства
       * @private
       */
      _getOriginalPropertyValue: function(name) {
         var adapter = this._options.adapter.forRecord(),
            rawValue = adapter.get(this._options.data, name),
            fieldData = adapter.getFullFieldData(this._options.data, name),
            value = Factory.cast(
               rawValue,
               fieldData.type,
               this._options.adapter,
               fieldData.meta
            );
         if (value && this._options.usingDataSetAsList && fieldData.type === 'DataSet') {
            value = value.getAll();
         }
         return value;
      },

      /**
       * Устанавливает значение свойства в сырых данных
       * @param {String} name Название свойства
       * @param {*} value Значение свойства
       * @private
       */
      _setOriginalPropertyValue: function(name, value) {
         var adapter = this._options.adapter.forRecord(),
            fieldData = adapter.getFullFieldData(this._options.data, name);

         adapter.set(
            this._options.data,
            name,
            Factory.serialize(
               value,
               fieldData.type,
               this._options.adapter,
               fieldData.meta
            )
         );
      },

      /**
       * Устанавливает, удалена ли модель
       * @param {Boolean} deleted Модель удалена
       * @private
       */
      _setDeleted: function (deleted) {
         this._isDeleted = deleted;
      },

      /**
       * Устанавливает изменена ли модель
       * @param {Boolean} changed Модель изменена
       * @returns {Boolean}
       * @private
       */
      _setChanged: function (changed) {
         this._isChanged = changed;
      },

      /**
       * Возвращает вычисленное значение свойства
       * @param {String} name Ися свойства
       * @param {*} value Значение свойства
       * @param {Property} property Описание свойства
       * @param {Boolean} isReading Вычисление при чтении
       * @returns {*}
       * @private
       */
      _getCalculatedValue: function (name, value, property, isReading) {
         //TODO: отследить зависимости от других свойств (например, отлеживая вызов get() внутри _getCalculatedValue), и сбрасывать кэш для зависимых полей при set()
         if (this._nowCalculatingProperties[name]) {
            throw new Error('Recursive value calculate detected for property ' + name);
         }
         this._nowCalculatingProperties[name] = true;
         value = isReading ?
            property.get.call(this, value) :
            property.set.call(this, value);
         this._nowCalculatingProperties[name] = false;

         return value;
      },

      //endregion Protected methods

      //TODO: совместимость с SBIS3.CONTROLS.Record - выплить после перехода на ISource
      //region SBIS3.CONTROLS.Record

      getType: function (field) {
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method getType() is deprecated and will be removed in 3.8.0.');
         }
         return field ? 'Текст' : undefined;
      },

      setCreated: function (created) {
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method setCreated() is deprecated and will be removed in 3.8.0. Use setStored() instead.');
         }
         this.setStored(created);
      },

      isCreated: function () {
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method isCreated() is deprecated and will be removed in 3.8.0. Use isStored() instead.');
         }
         return this.isStored();
      },

      setDeleted: function (deleted) {
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method setDeleted() is deprecated and will be removed in 3.8.0.');
         }
         this._setDeleted(deleted);
      },

      setChanged: function (changed) {
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method setChanged() is deprecated and will be removed in 3.8.0.');
         }
         this._setChanged(changed);
      },

      getKey: function () {
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method getKey() is deprecated and will be removed in 3.8.0. Use getId() instead.');
         }
         return this.getId();
      },

      getKeyField: function () {
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method getKeyField() is deprecated and will be removed in 3.8.0. Use getIdProperty() instead.');
         }
         return this.getIdProperty();
      },

      getRaw: function () {
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method getRaw() is deprecated and will be removed in 3.8.0. Use getRawData() instead.');
         }
         return this.getRawData();
      }

      //endregion SBIS3.CONTROLS.Record
   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Model', function(config) {
      return new Model(config);
   });
   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.ModelConstructor', function() {
      return Model;
   });

   ContextField.register('ControlsFieldTypeModel', Model, 'onPropertyChange');

   return Model;
});
