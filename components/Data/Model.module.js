/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Model', [
   'js!SBIS3.CONTROLS.Data.IPropertyAccess',
   'js!SBIS3.CONTROLS.Data.IHashable',
   'js!SBIS3.CONTROLS.Data.HashableMixin',
   'js!SBIS3.CONTROLS.Data.Factory',
   'js!SBIS3.CONTROLS.Data.Adapter.Json'
], function (IPropertyAccess, IHashable, HashableMixin, Factory, JsonAdapter) {
   'use strict';

   /**
    * Модель - обеспечивает доступ к данным субъекта предметной области
    * @class SBIS3.CONTROLS.Data.Model
    * @extends $ws.proto.Abstract
    * @mixes SBIS3.CONTROLS.Data.IPropertyAccess
    * @mixes SBIS3.CONTROLS.Data.IHashable
    * @mixes SBIS3.CONTROLS.Data.HashableMixin
    * @public
    * @author Мальцев Алексей
    */

   var Model = $ws.proto.Abstract.extend([IPropertyAccess, IHashable, HashableMixin], /** @lends SBIS3.CONTROLS.Data.Model.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Model',
      $protected: {
         _options: {
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
             * @cfg {SBIS3.CONTROLS.Source.ISource} Источник данных модели. Требутся для методов {@link load}, {@link save} и {@link remove}
             * @see getSource
             * @see setSource
             * @see load
             * @see save
             * @see remove
             */
            source: undefined,

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
             * @typedef {Object} Property
             * @property {String} name Имя свойства
             * @property {Function} [readConverter] Метод, конвертирующий значение свойства при чтении. Первым аргументом придет текущее значение свойства. Должен веруть сконвертированное значение свойства.
             * @property {Function} [writeConverter] Метод, конвертирующий значение свойства при записи. Первым аргументом придет текущее значение свойства. Должен веруть сконвертированное значение свойства.
             */

            /**
             * @cfg {Property[]} Свойства модели. Дополняют/уточняют свойства, уже существующие в сырых данных.
             * @example
             * <pre>
             *    var user = new Model({
             *       data: {
             *          id: 5,
             *          login: 'mnemonic',
             *          firstName: 'John',
             *          lastName: 'Smith',
             *          job: 'Memory stick'
             *       },
             *       properties: [{
             *          name: 'id',
             *          readConverter: function(value) {
             *             return '№' + value;
             *          }
             *       }, {
             *          name: 'displayName',
             *          readConverter: function() {
             *             return this.get('firstName') + ' a.k.a "' + this.get('login') + '" ' + this.get('lastName');
             *          }
             *       }]
             *    });
             *    user.get('id');//№5
             *    user.get('displayName');//John a.k.a "mnemonic" Smith
             *    user.get('job');//Memory stick
             *    user.get('uptime');//undefined
             * </pre>
             * @see getProperties
             * @see setProperties
             */
            properties: [],

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
          * @var {Object} Свойства модели
          */
         _properties: {},

         /**
          * @var {Object} Объект содержащий закэшированные инстансы значений-объектов
          */
         _propertiesCache: {},

         /**
          * @var {Object} Объект содержащий названия свойств, для которых сейчас выполняется конвертация значения
          */
         _nowConvertingProperties: {},

         /**
          * @var {Object} Работа в режиме совместимости API
          */
         _compatibleMode: false
      },

      $constructor: function (cfg) {
         cfg = cfg || {};
         //TODO: убрать после перехода на ISource
         this._compatibleMode = cfg.compatibleMode;

         this._options.idProperty = this._options.idProperty || '';
         this._initAdapter();
         this.setRawData(this._options.data);
         this._publish('onPropertyChange');
      },

      // region SBIS3.CONTROLS.Data.IPropertyAccess

      get: function (name) {
         if (this._propertiesCache.hasOwnProperty(name)) {
            return this._propertiesCache[name];
         }

         if (!this.has(name)) {
            return undefined;
         }

         var property = this._properties[name],
            value = this._getOriginalPropertyValue(name);
         if (property && property.readConverter) {
            value = this._getConvertedValue(value, property, true);
         }

         //Инстансы объектов кэшируем
         if (typeof value === 'object') {
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

         var property = this._properties[name];
         if (property && property.writeConverter) {
            value = this._getConvertedValue(value, property, false);
         }

         if (this._getOriginalPropertyValue(name) !== value) {
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

            this._setChanged(true);
            delete this._propertiesCache[name];
            this._notify('onPropertyChange', name, value);
         }
      },

      has: function (name) {
         return this._properties.hasOwnProperty(name);
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
         for (var  name in this._properties) {
            if (this._properties.hasOwnProperty(name)) {
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
       * Возвращает источник данных
       * @returns {SBIS3.CONTROLS.Data.Source.BaseSource}
       * @see source
       * @see setSource
       */
      getSource: function () {
         return this._options.source;
      },

      /**
       * Устанавливает источник данных
       * @param {SBIS3.CONTROLS.Data.Source.BaseSource} source
       * @see source
       * @see getSource
       */
      setSource: function (source) {
         this._options.source = source;
         this._propertiesCache = {};
      },

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
       * @returns {Property[]}
       * @see properties
       * @see setProperties
       */
      getProperties: function () {
         var properties = [];
         for (var key in this._properties) {
            if (this._properties.hasOwnProperty(key)) {
               properties.push(this._properties[key]);
            }
         }
         return properties;
      },

      /**
       * Устанавливает cвойства модели
       * @param {Property[]} properties Cвойства модели
       * @see properties
       * @see getProperties
       */
      setProperties: function (properties) {
         var property,
            i,
            length;
         this._properties = {};
         if (properties instanceof Array) {
            for (i = 0, length = properties.length; i < length; i++) {
               property = properties[i];
               this._properties[property.name] = property;
            }
         }
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
         return new Model(this._options);
      },

      /**
       * Объединяет модель с данными и состоянием другой модели
       * @param {SBIS3.CONTROLS.Data.Model} model Модель, с которой будет произведено объединение
       */
      merge: function (model) {
         //FIXME: подразумевается, что адаптеры моделей должны быть одинаковы. Сделать объединение data через адаптеры.
         $ws.core.merge(this._options.data, model._options.data);
         this._isStored = model._isStored;
         this._isChanged = model._isChanged;
         this._isDeleted = model._isDeleted;
         this._initProperties();
      },

      /**
       * Синхронизирует изменения в модели с источником данных
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет обновленный инстанс модели.
       * @see load
       * @see save
       * @see remove
       * @see source
       * @see getSource
       * @see setSource
       */
      sync: function () {
         if (this._isDeleted) {
            return this.remove();
         } else if (this._isChanged || !this._isStored) {
            return this.save();
         } else {
            return $ws.proto.Deferred.success(this);
         }
      },

      /**
       * Загружает модель из источника данных
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет обновленный инстанс модели.
       * @see save
       * @see remove
       * @see source
       * @see getSource
       * @see setSource
       */
      load: function() {
         this._checkSource();
         var self = this;
         return this._options.source.read(this.getId()).addCallback((function(instance) {
            self.setRawData(instance.getRawData());
            self.setStored(true);
            self._setChanged(false);
            return self;
         }).bind(this));
      },

      /**
       * Сохраняет модель в источник данных
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет обновленный инстанс модели.
       * @see load
       * @see remove
       * @see source
       * @see getSource
       * @see setSource
       */
      save: function() {
         this.validate();
         this._checkSource();
         var self = this;
         return this._options.source.update(this).addCallback((function() {
            self._setChanged(false);
            return self;
         }).bind(this));
      },

      /**
       * Удаляет модель в источника данных
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет обновленный инстанс модели.
       * @see load
       * @see save
       * @see source
       * @see getSource
       * @see setSource
       */
      remove: function() {
         this._checkSource();
         var self = this;
         return this._options.source.destroy(this.getId()).addCallback((function() {
            self._propertiesCache = {};
            self._setDeleted(true);
            self.setStored(false);
            return self;
         }).bind(this));
      },

      /**
       * Запускает валидацию модели
       */
      validate: function() {
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
      setRawData: function (data) {
         this._options.data = data || {};
         this._propertiesCache = {};
         this._initProperties();
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
         return JSON.stringify(this._options.data);
      },

      // endregion Public methods

      //region Protected methods

      /**
       * Проверяет наличие источника данных
       * @private
       */
      _checkSource: function () {
         if (!this._options.source) {
            throw new Error('Source is not defined');
         }
      },

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
         this.setProperties(this._options.properties);

         var adapter = this._options.adapter.forRecord(),
            fields = adapter.getFields(this._options.data),
            i,
            length;
         for (i = 0, length = fields.length; i < length; i++) {
            if (!this._properties.hasOwnProperty(fields[i])) {
               this._properties[fields[i]] = {
                  name: fields[i]
               };
            }
         }
      },

      /**
       * Добавляет свойство модели
       * @private
       */
      _addProperty: function(name) {
         var property = {
            name: name
         };
         this._properties[name] = property;
      },

      /**
       * Возварщает оригинальное (не сконвертированное) значение свойства
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
       * Возвращает сконвертированное значение свойства
       * @param {*} value Модель изменена
       * @param {Property} property Описание свойства
       * @param {Boolean} isReading Конвертация при чтении
       * @returns {*}
       * @private
       */
      _getConvertedValue: function (value, property, isReading) {
         //TODO: отследить зависимости от других свойств (например, отлеживая вызов get() внутри _getConvertedValue), и сбрасывать кэш для зависимых полей при set()
         if (this._nowConvertingProperties[property.name]) {
            throw new Error('Recursive value converting detected for property ' + property.name);
         }
         this._nowConvertingProperties[property.name] = true;
         value = isReading ?
            property.readConverter.call(this, value) :
            property.writeConverter.call(this, value);
         this._nowConvertingProperties[property.name] = false;

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

   return Model;
});
