/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Model', [
   'js!SBIS3.CONTROLS.Data.Record',
   'js!SBIS3.CONTROLS.Data.IHashable',
   'js!SBIS3.CONTROLS.Data.HashableMixin',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (
   Record,
   IHashable,
   HashableMixin,
   ArrayEnumerator,
   Di,
   Utils
) {
   'use strict';

   /**
    * Модель - обеспечивает доступ к данным объекта предметной области
    * @class SBIS3.CONTROLS.Data.Model
    * @extends SBIS3.CONTROLS.Data.Record
    * @mixes SBIS3.CONTROLS.Data.IHashable
    * @mixes SBIS3.CONTROLS.Data.HashableMixin
    * @public
    * @ignoreMethods getDefault
    * @author Мальцев Алексей
    */

   var Model = Record.extend([IHashable, HashableMixin], /** @lends SBIS3.CONTROLS.Data.Model.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Model',

      /**
       * @typedef {Object} Property
       * @property {*|Function} [def] Значение по умолчанию (используется, если свойства нет в сырых данных)
       * @property {Function} [get] Метод, возвращающий значение свойства. Первым аргументом придет значение свойства в сырых данных.
       * @property {Function} [set] Метод, устанавливающий значение свойства.
       */

      /**
       * @cfg {Object.<String, Property>} Описание свойств модели. Дополняет/уточняет свойства, уже существующие в сырых данных.
       * @name SBIS3.CONTROLS.Data.Mode#properties
       * @example
       * <pre>
       *    var User = Model.extend({
       *       $properties: {
       *          id: {
       *             get: function(value) {
       *                return '№' + value;
       *             }
       *          },
       *          guid: {
       *             def: function() {
       *                return $ws.helpers.createGUID();
       *             }
       *          },
       *          displayName: {
       *             get: function() {
       *                return this.get('firstName') + ' a.k.a "' + this.get('login') + '" ' + this.get('lastName');
       *             }
       *          }
       *       }
       *    });
       *    var user = new User({
       *       rawData: {
       *          id: 5,
       *          login: 'Keanu',
       *          firstName: 'Johnny',
       *          lastName: 'Mnemonic',
       *          job: 'Memory stick'
       *       }
       *    });
       *    user.get('id');//№5
       *    user.get('guid');//010a151c-1160-d31d-11b3-18189155cc13
       *    user.get('displayName');//Johnny a.k.a "Keanu" Mnemonic
       *    user.get('job');//Memory stick
       *    user.get('uptime');//undefined
       * </pre>
       * @see getProperties
       * @see Property
       */
      $properties: null,

      /**
       * @cfg {String} Поле, содержащее первичный ключ
       * @name SBIS3.CONTROLS.Data.Mode#idProperty
       * @see getIdProperty
       * @see setIdProperty
       */
      $idProperty: '',

      _hashPrefix: 'model-',

      /**
       * @member {Boolean} Признак, что модель существует в источнике данных
       */
      _isStored: false,

      /**
       * @member {Boolean} Признак, что модель удалена из источника данных
       */
      _isDeleted: false,

      /**
       * @member {Object.<String, *>} Объект содержащий вычисленные значения свойств по умолчанию
       */
      _defaultPropertiesValues: null,

      /**
       * @member {Object.<String, Boolean>} Объект содержащий названия свойств, для которых сейчас выполняется вычисление значения
       */
      _nowCalculatingProperties: null,

      /**
       * @member {Object} Флаг показывающий была ли модель синхронизирована
       */
      _synced: false,

      constructor: function $Model(options) {
         options = options || {};
         if ('usingDataSetAsList' in options) {
            Utils.logger.stack(this._moduleName + '::$constructor(): option "usingDataSetAsList" is deprecated and will be removed in 3.7.4', 1);
         }

         this.$properties = this.$properties || {};
         this._defaultPropertiesValues = {};
         this._nowCalculatingProperties = {};
         Model.superclass.constructor.call(this, options);
         if (!this.$idProperty) {
            this.$idProperty = this.getAdapter().getKeyField(this.$rawData);
         }
      },

      // region SBIS3.CONTROLS.Data.IObject

      get: function (name) {
         if (this._hasInPropertiesCache(name)) {
            return this._getFromPropertiesCache(name);
         }

         var value = Model.superclass.get.call(this, name),
            property = this.getProperties()[name];
         if (property) {
            if ('def' in property && !this._getRawDataAdapter().has(name)) {
               value = this.getDefault(name);
            }
            if (property.get) {
               value = this._processCalculatedValue(name, value, property, true);
               if (this._isFieldValueCacheable(value)) {
                  this._setToPropertiesCache(name, value);
               } else if (this._hasInPropertiesCache(name)) {
                  this._unsetFromPropertiesCache(name);
               }
            }
         }

         return value;
      },

      set: function (name, value) {
         var property = this.getProperties()[name];
         if (property && property.set) {
            value = this._processCalculatedValue(name, value, property, false);
            if (value === undefined) {
               return;
            }
         }

         Model.superclass.set.call(this, name, value);
      },

      has: function (name) {
         return this.$properties.hasOwnProperty(name) || Model.superclass.has.call(this, name);
      },

      // endregion SBIS3.CONTROLS.Data.IObject

      // region SBIS3.CONTROLS.Data.Collection.IEnumerable

      /**
       * Возвращает энумератор для перебора названий свойств модели
       * @returns {SBIS3.CONTROLS.Data.Collection.ArrayEnumerator}
       */
      getEnumerator: function () {
         return new ArrayEnumerator(this._getAllProperties());
      },

      /**
       * Перебирает все свойства модели (включая имеющиеся в "сырых" данных)
       * @param {Function(String, *)} callback Ф-я обратного вызова для каждого свойства. Первым аргументом придет название свойства, вторым - его значение.
       * @param {Object} [context] Контекст вызова callback.
       */
      each: function (callback, context) {
         return Model.superclass.each.call(this, callback, context);
      },

      // endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      // region SBIS3.CONTROLS.Data.SerializableMixin

      _getSerializableState: function() {
         return $ws.core.merge(
            Model.superclass._getSerializableState.call(this), {
               _hash: this.getHash(),
               _isStored: this._isStored,
               _isDeleted: this._isDeleted,
               _defaultPropertiesValues: this._defaultPropertiesValues
            }
         );
      },

      _setSerializableState: function(state) {
         return Model.superclass._setSerializableState(state).callNext(function() {
            this._hash = state._hash;
            this._isStored = state._isStored;
            this._isDeleted = state._isDeleted;
            this._defaultPropertiesValues = state._defaultPropertiesValues;
         });
      },

      // endregion SBIS3.CONTROLS.Data.SerializableMixin

      // region Public methods

      /**
       * Возвращает cвойства модели
       * @returns {Object.<String, Property>}
       * @see properties
       * @see Property
       */
      getProperties: function () {
         return this.$properties;
      },

      /**
       * Возвращает признак, что вложенные рекордсеты используются как List, а не как DataSet
       * @returns {Boolean}
       * @deprecated метод будет удален в 3.7.4 - поле с типом выборка всегда возвращается как RecordSet
       */
      isUsingDataSetAsList: function () {
         Utils.logger.stack(this._moduleName + '::isUsingDataSetAsList(): method is deprecated and will be removed in 3.7.4');
         return false;
      },

      /**
       * Устанавливает признак, что вложенные рекордсеты используются как List, а не как DataSet
       * @param {Boolean} usingDataSetAsList Вложенные рекордсеты использовать как List, а не как DataSet
       * @deprecated метод будет удален в 3.7.4 - поле с типом выборка всегда возвращается как RecordSet
       */
      setUsingDataSetAsList: function () {
         Utils.logger.stack(this._moduleName + '::setUsingDataSetAsList(): method is deprecated and will be removed in 3.7.4');
      },

      /**
       * Возвращает значение свойства по умолчанию
       * @param {String} name Название свойства
       * @returns {*}
       */
      getDefault: function (name) {
         if (!this._defaultPropertiesValues.hasOwnProperty(name)) {
            var property = this.$properties[name];
            if (property && 'def' in property) {
               this._defaultPropertiesValues[name] = [property.def instanceof Function ? property.def.call(this) : property.def];
            } else {
               this._defaultPropertiesValues[name] = [];
            }
         }
         return this._defaultPropertiesValues[name][0];
      },

      /**
       * Объединяет модель с данными и состоянием другой модели
       * @param {SBIS3.CONTROLS.Data.Model} model Модель, с которой будет произведено объединение
       */
      merge: function (model) {
         model.each(function(field, value) {
            try {
               this.set(field, value);
            } catch (e) {
               if (!(e instanceof ReferenceError)) {
                  throw e;
               }
            }
         }, this);
         this._isStored = this._isStored || model._isStored;
         this._isDeleted = this._isDeleted || model._isDeleted;
      },

      /**
       * Возвращает признак, что модель удалена
       * @returns {Boolean}
       */
      isDeleted: function () {
         return this._isDeleted;
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
       * Возвращает значение первичного ключа модели
       * @returns {*}
       */
      getId: function () {
         var idProperty = this._getIdProperty();
         if (!idProperty) {
            Utils.logger.info('SBIS3.CONTROLS.Data.Model::getId(): option idProperty is empty');
            return undefined;
         }
         return this.get(idProperty);
      },

      /**
       * Возвращает свойство, в котором хранится первичный ключ модели
       * @returns {String}
       */
      getIdProperty: function () {
         return this._getIdProperty();
      },

      /**
       * Устанавливает свойство, в котором хранится первичный ключ модели
       * @param {String} idProperty Первичный ключ модели.
       */
      setIdProperty: function (idProperty) {
         if (!this.has(idProperty)) {
            Utils.logger.info('SBIS3.CONTROLS.Data.Model::setIdProperty(): property "' + idProperty + '" is not defined');
            return;
         }
         this.$idProperty = idProperty;
      },

      /**
       * Возвращает данные в виде hash map свойство-значение
       * @returns {Object}
       */
      toObject: function() {
         var data = {};
         this.each(function(field, value) {
            data[field] = value;
         });
         return data;
      },

      /**
      * Возвращает строку с данными в формате json
      * @returns {String}
      */
      toString: function() {
         return JSON.stringify(this.toObject());
      },
      /**
       * Возвращает признак синхронизации модели
       * @returns {Boolean}
       */
      isSynced: function () {
         return this._synced;
      },
      /**
       * Устанавливает признак синхронизации модели
       * @param synced {Boolean}
       */
      setSynced: function (synced) {
         this._synced = synced;
      },

      // endregion Public methods

      //region Protected methods

      /**
       * Возвращает значение idProperty, при этом, если оно не задано явно, пытается втащить его через адаптер
       * @returns {String}
       * @protected
       */
      _getIdProperty: function () {
         if (this.$idProperty === undefined) {
            this.$idProperty = this._getRawDataAdapter().getKeyField() || '';
         }
         return this.$idProperty;
      },

      /**
       * Возвращает массив названий всех свойств (включая поля в "сырых" данных)
       * @returns {Array.<String>}
       * @protected
       */
      _getAllProperties: function() {
         var fields = this._getRawDataFields(),
            objProps = this.getProperties(),
            props = Object.keys(objProps);
         return props.concat($ws.helpers.filter(fields, function(field) {
            return !objProps.hasOwnProperty(field);
         }));
      },

      /**
       * Устанавливает, удалена ли модель
       * @param {Boolean} deleted Модель удалена
       * @protected
       */
      _setDeleted: function (deleted) {
         this._isDeleted = deleted;
      },

      /**
       * Возвращает вычисленное значение свойства
       * @param {String} name Ися свойства
       * @param {*} value Значение свойства
       * @param {Property} property Описание свойства
       * @param {Boolean} isReading Вычисление при чтении
       * @returns {*}
       * @protected
       */
      _processCalculatedValue: function (name, value, property, isReading) {
         //TODO: отследить зависимости от других свойств (например, отлеживая вызов get() внутри _processCalculatedValue), и сбрасывать кэш для зависимых полей при set()
         var checkKey = name + '|' + isReading;
         if (this._nowCalculatingProperties.hasOwnProperty(checkKey)) {
            throw new Error('Recursive value ' +  (isReading ? 'reading' : 'writing') + ' detected for property ' + name);
         }

         this._nowCalculatingProperties[checkKey] = true;
         value = isReading ?
            property.get.call(this, value) :
            property.set.call(this, value);
         delete this._nowCalculatingProperties[checkKey];

         return value;
      },

      //endregion Protected methods

      //TODO: совместимость с SBIS3.CONTROLS.Record - выплить после перехода на ISource
      //region SBIS3.CONTROLS.Record

      getType: function (field) {
         Utils.logger.stack('SBIS3.CONTROLS.Data.Model: method getType() is deprecated and will be removed in 3.7.4');
         var adapter = this._getRawDataAdapter(),
            info = adapter.getInfo(field);
         return info && info.meta && info.meta.t ?
            (info.meta.t instanceof Object ? info.meta.t.n : info.meta.t) :
            (field ? 'Текст' : undefined);
      },

      setCreated: function (created) {
         Utils.logger.stack('SBIS3.CONTROLS.Data.Model: method setCreated() is deprecated and will be removed in 3.7.4. Use setStored() instead.');
         this.setStored(created);
      },

      isCreated: function () {
         Utils.logger.stack('SBIS3.CONTROLS.Data.Model: method isCreated() is deprecated and will be removed in 3.7.4. Use isStored() instead.');
         return this.isStored();
      },

      setDeleted: function (deleted) {
         Utils.logger.stack('SBIS3.CONTROLS.Data.Model: method setDeleted() is deprecated and will be removed in 3.7.4.');
         this._setDeleted(deleted);
      },

      setChanged: function (changed) {
         Utils.logger.stack('SBIS3.CONTROLS.Data.Model: method setChanged() is deprecated and will be removed in 3.7.4.');
         if (changed) {
            this._changedFields.__fake_field = '__fake_value';
         } else {
            this._changedFields = {};
         }
      },

      getKey: function () {
         Utils.logger.stack('SBIS3.CONTROLS.Data.Model: method getKey() is deprecated and will be removed in 3.7.4. Use getId() instead.');
         return this.getId();
      },

      getKeyField: function () {
         Utils.logger.stack('SBIS3.CONTROLS.Data.Model: method getKeyField() is deprecated and will be removed in 3.7.4. Use getIdProperty() instead.');
         return this.getIdProperty();
      },

      getRaw: function () {
         Utils.logger.stack('SBIS3.CONTROLS.Data.Model: method getRaw() is deprecated and will be removed in 3.7.4. Use getRawData() instead.');
         return this.getRawData();
      }

      //endregion SBIS3.CONTROLS.Record
   });

   Di.register('model', Model);

   return Model;
});
