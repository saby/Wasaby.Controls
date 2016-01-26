/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Model', [
   'js!SBIS3.CONTROLS.Data.Record',
   'js!SBIS3.CONTROLS.Data.IHashable',
   'js!SBIS3.CONTROLS.Data.HashableMixin',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator'
], function (Record, IHashable, HashableMixin, Di, ArrayEnumerator) {
   'use strict';

   /**
    * Модель - обеспечивает доступ к данным объекта предметной области
    * @class SBIS3.CONTROLS.Data.Model
    * @extends SBIS3.CONTROLS.Data.Record
    * @mixes SBIS3.CONTROLS.Data.IHashable
    * @mixes SBIS3.CONTROLS.Data.HashableMixin
    * @public
    * @author Мальцев Алексей
    */

   var Model = Record.extend([IHashable, HashableMixin], /** @lends SBIS3.CONTROLS.Data.Model.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Model',
      $protected: {
         _options: {
            /**
             * @typedef {Object} Property
             * @property {*|Function} [def] Значение по умолчанию (используется, если свойства нет в сырых данных)
             * @property {Function} [get] Метод, возвращающий значение свойства. Первым аргументом придет значение свойства в сырых данных.
             * @property {Function} [set] Метод, устанавливающий значение свойства.
             */

            /**
             * @cfg {Object.<String, Property>} Описание свойств модели. Дополняет/уточняет свойства, уже существующие в сырых данных.
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
             *                guid: {
             *                   def: function() {
             *                      return $ws.helpers.createGUID();
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
          * @var {Object.<String, *>} Объект содержащий вычисленные значения свойств по умолчанию
          */
         _defaultPropertiesValues: {},

         /**
          * @var {Object.<String, Boolean>} Объект содержащий названия свойств, для которых сейчас выполняется вычисление значения
          */
         _nowCalculatingProperties: {},

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
         if (!this._options.idProperty) {
            this._options.idProperty = this._getRecordAdapter().getKeyField();
         }
      },

      // region SBIS3.CONTROLS.Data.IPropertyAccess

      get: function (name) {
         var value = Model.superclass.get.call(this, name),
            property = this.getProperties()[name];
         if (property) {
            if ('def' in property && !this._getRecordAdapter().has(name)) {
               value = this.getDefault(name);
            }
            if (property.get) {
               value = this._processCalculatedValue(name, value, property, true);
               if (this._isFieldValueCacheable(value)) {
                  this._propertiesCache[name] = value;
               }
            }
         }

         if (this._options.usingDataSetAsList &&
            this._isFieldValueCacheable(value) &&
            $ws.helpers.instanceOfModule(value, 'SBIS3.CONTROLS.Data.Source.DataSet')
         ) {
            value = value.getAll();
            this._propertiesCache[name] = value;
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
         return this.getProperties().hasOwnProperty(name) || Model.superclass.has.call(this, name);
      },

      // endregion SBIS3.CONTROLS.Data.IPropertyAccess

      // region SBIS3.CONTROLS.Data.Collection.IEnumerable

      /**
       * Возвращает энумератор для перебора названий свойств модели
       * @returns {SBIS3.CONTROLS.Data.Collection.ArrayEnumerator}
       */
      getEnumerator: function () {
         return new ArrayEnumerator({
            items: this._getAllProperties()
         });
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
               _defaultPropertiesValues: this._defaultPropertiesValues,
               _compatibleMode: this._compatibleMode
            }
         );
      },

      _setSerializableState: function(state) {
         return Model.superclass._setSerializableState(state).callNext(function() {
            this._hash = state._hash;
            this._isStored = state._isStored;
            this._isDeleted = state._isDeleted;
            this._defaultPropertiesValues = state._defaultPropertiesValues;
            this._compatibleMode = state._compatibleMode;
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

      //
      // * Возвращает значение свойства по умолчанию
      // * @param {String} name Название свойства
      // * @returns {*}
      // */
      getDefault: function (name) {
         if (!this._defaultPropertiesValues.hasOwnProperty(name)) {
            var property = this._options.properties[name];
            if (property && 'def' in property) {
               this._defaultPropertiesValues[name] = [typeof property.def === 'function' ? property.def.call(this) : property.def];
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
       * Проверяет эквивалентность формата и данных другой модели
       * @param {SBIS3.CONTROLS.Data.Model} model Модель, с которой сравнить
       * @returns {Boolean}
       */
      isEqual: function (model) {
         return !!(model &&
            model.$constructor &&
            this.$constructor.prototype === model.$constructor.prototype &&
            $ws.helpers.isEqualObject(
               this._options.rawData,
               model.getRawData()
            )
         );
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
         if (!this._options.idProperty) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model::getId()', 'Option idProperty is not defined');
            return undefined;
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
         if (!this.has(idProperty)) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model::setIdProperty()', 'Property "' + idProperty + '" is not defined');
            return;
         }
         this._options.idProperty = idProperty;
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

      // endregion Public methods

      //region Protected methods

      /**
       * Возвращает массив названий всех свойств (включая поля в "сырых" данных)
       * @returns {Array.<String>}
       * @protected
       */
      _getAllProperties: function() {
         var fields = this._getRawDataFields(),
            props = Object.keys(this.getProperties());
         return props.concat($ws.helpers.filter(fields, function(field) {
            return props.indexOf(field) === -1;
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
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method getType() is deprecated and will be removed in 3.7.4');
         }
         var adapter = this._getRecordAdapter(),
            info = adapter.getInfo(field);
         return info && info.meta && info.meta.t ?
            (typeof info.meta.t === 'object' ? info.meta.t.n : info.meta.t) :
            (field ? 'Текст' : undefined);
      },

      setCreated: function (created) {
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method setCreated() is deprecated and will be removed in 3.7.4. Use setStored() instead.');
         }
         this.setStored(created);
      },

      isCreated: function () {
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method isCreated() is deprecated and will be removed in 3.7.4. Use isStored() instead.');
         }
         return this.isStored();
      },

      setDeleted: function (deleted) {
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method setDeleted() is deprecated and will be removed in 3.7.4.');
         }
         this._setDeleted(deleted);
      },

      setChanged: function (changed) {
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method setChanged() is deprecated and will be removed in 3.7.4.');
         }
         if (changed) {
            this._changedFields.__fake_field = '__fake_value';
         } else {
            this._changedFields = {};
         }
      },

      getKey: function () {
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method getKey() is deprecated and will be removed in 3.7.4. Use getId() instead.');
         }
         return this.getId();
      },

      getKeyField: function () {
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method getKeyField() is deprecated and will be removed in 3.7.4. Use getIdProperty() instead.');
         }
         return this.getIdProperty();
      },

      getRaw: function () {
         if (!this._compatibleMode) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Model', 'method getRaw() is deprecated and will be removed in 3.7.4. Use getRawData() instead.');
         }
         return this.getRawData();
      }

      //endregion SBIS3.CONTROLS.Record
   });

   Di.register('model', Model);

   return Model;
});
