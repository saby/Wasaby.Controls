/* global define */
define('js!WS.Data/Entity/Model', [
   'js!WS.Data/Entity/Record',
   'js!WS.Data/Entity/IInstantiable',
   'js!WS.Data/Entity/InstantiableMixin',
   'js!WS.Data/Entity/SerializableMixin',
   'js!WS.Data/Entity/FormattableMixin',
   'js!WS.Data/Collection/ArrayEnumerator',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'Core/core-functions',
   'Core/helpers/collection-helpers'
], function (
   Record,
   IInstantiable,
   InstantiableMixin,
   SerializableMixin,
   FormattableMixin,
   ArrayEnumerator,
   Di,
   Utils,
   CoreFunctions,
   CollectionHelpers
) {
   'use strict';

   /**
    * Абстрактная модель.
    * Модели обеспечивают доступ к данным и поведению объектов предметной области (сущностям).
    * Такими сущностями могут быть, например, товары, пользователи, документы - и другие предметы окружающего мира, которые вы моделируете в своем приложении.
    *
    * В основе абстрактной модели лежит {@link WS.Data/Entity/Record запись}.
    * Основные аспекты модели (дополнительно к аспектам записи):
    * <ul>
    *    <li>определение {@link properties собственных свойств} сущности;</li>
    *    <li>{@link getId уникальный идентификатор сущности} среди ей подобных.</li>
    * </ul>
    *
    * Поведенческие аспекты каждой сущности реализуются ее прикладным модулем в виде публичных методов.
    * Прикладные модели могут внедряться в порождающие их объекты, такие как {@link WS.Data/Source/ISource#model источники данных} или {@link WS.Data/Collection/RecordSet#model рекордсеты}.
    *
    * Для реализации конкретной модели используется наследование от абстрактной либо промежуточной.
    *
    * Для корректной сериализации и клонирования моделей необходимо выносить их в отдельные модули и указывать имя модуля в свойстве _moduleName каждого наследника:
    * <pre>
    * define('js!My.Awesome.Model', ['js!WS.Data/Entity/Model'], function (Model) {
    *    'use strict';
    *
    *    var AwesomeModel = Model.extend({
    *      _moduleName: 'My.Awesome.Model'
    *      //...
    *    });
    *
    *    return AwesomeModel;
    * });
    * </pre>
    *
    * Определим модель пользователя:
    * <pre>
    *    define('js!Application/Model/User', ['js!WS.Data/Entity/Model', 'js!Application/Lib/Salt'], function (Model, Salt) {
    *       var User = Model.extend({
    *          _moduleName: 'Application/Model/User'
    *          _$format: [
    *             {name: 'login', type: 'string'},
    *             {name: 'salt', type: 'string'}
    *          ],
    *          _$idProperty: 'login',
    *          authenticate: function(password) {
    *             return Salt.encode(this.get('login') + ':' + password) === this.get('salt');
    *          }
    *       });
    *
    *       return User;
    *    });
    * </pre>
    * Создадим модель пользователя:
    * <pre>
    *    define('js!Application/Controller/Test/Auth', ['js!Application/Model/User'], function (User) {
    *       var user = new User();
    *       user.set({
    *          login: 'i.c.wiener',
    *          salt: 'grhS2Nys345fsSW3mL9'
    *       });
    *       var testOk = user.authenticate('its pizza time!');
    *    });
    * </pre>
    *
    * Модели могут объединяться по принципу "матрёшки" - сырыми данными одной модели является другая модель. Для организации такой структуры следует использовать {@link WS.Data/Adapter/RecordSet адаптер рекордсета}:
    * <pre>
    *    var MyEngine, MyTransmission, myCar;
    *
    *    MyEngine = Model.extend({
    *       _$properties: {
    *          fuelType: {
    *             get: function() {
    *                return 'Diesel';
    *             }
    *          }
    *       }
    *    });
    *
    *    MyTransmission = Model.extend({
    *       _$properties: {
    *          transmissionType: {
    *             get: function() {
    *                return 'Manual';
    *             }
    *          }
    *       }
    *    });
    *
    *    myCar = new MyEngine({
    *       rawData: new MyTransmission({
    *          rawData: {
    *             color: 'Red',
    *             fuelType: '',
    *             transmissionType: ''
    *          }
    *       }),
    *       adapter: new RecordSetAdapter()
    *   });
    *
    *   myCar.get('fuelType');//'Diesel'
    *   myCar.get('transmissionType');//'Manual'
    *   myCar.get('color');//'Red'
    * </pre>
    * @class WS.Data/Entity/Model
    * @extends WS.Data/Entity/Record
    * @implements WS.Data/Entity/IInstantiable
    * @mixes WS.Data/Entity/InstantiableMixin
    * @public
    * @ignoreMethods getDefault
    * @author Мальцев Алексей
    */

   var Model = Record.extend([IInstantiable, InstantiableMixin], /** @lends WS.Data/Entity/Model.prototype */{
      /**
       * @typedef {Object} Property
       * @property {*|Function} [def] Значение по умолчанию (используется, если свойства нет в сырых данных).
       * @property {Function} [get] Метод, возвращающий значение свойства. Первым аргументом придет значение свойства в сырых данных (если оно там есть).
       * @property {Function} [set] Метод, устанавливающий значение свойства. Если метод вернет значение, отличное от undefined, то будет осуществлена попытка сохранить его в сырых данных.
       */

      _moduleName: 'WS.Data/Entity/Model',

      _instancePrefix: 'model-',

      /**
       * @cfg {Object.<String, Property>} Описание собственных свойств модели. Дополняет/уточняет свойства, уже существующие в сырых данных.
       * @name WS.Data/Entity/Model#properties
       * @see Property
       * @see getProperties
       * @example
       * Создадим модель пользователя со свойствами:
       * <ul>
       *    <li>id (чтение/запись, динамическая конвертация, хранится в сырых данных)</li>
       *    <li>group (чтение/запись, хранится в защищенном свойстве)</li>
       *    <li>guid (только чтение, значение по умолчанию генерируется динамически)</li>
       *    <li>displayName (только чтение, значение вычисляется из трех других свойств - login, firstName, lastName)</li>
       * </ul>
       * <pre>
       *    define(['Core/helpers/generate-helpers'], function(GenHelpers) {
       *       var User = Model.extend({
       *          _$properties: {
       *             id: {
       *                get: function(value) {
       *                   return '№' + value;
       *                },
       *                set: function(value) {
       *                   return (value + '')[0] === '№' ? value.substr(1) : value;
       *                }
       *             },
       *             group: {
       *                get: function() {
       *                   this._group;
       *                },
       *                set: function(value) {
       *                   this._group = value;
       *                }
       *             },
       *             guid: {
       *                def: function() {
       *                   return GenHelpers.createGUID();
       *                },
       *                get: function(value) {
       *                   return value;
       *                }
       *             },
       *             displayName: {
       *                get: function() {
       *                   return this.get('firstName') + ' a.k.a "' + this.get('login') + '" ' + this.get('lastName');
       *                }
       *             }
       *          },
       *          _group: null
       *       });
       *
       *       var user = new User({
       *          rawData: {
       *             id: 5,
       *             login: 'Keanu',
       *             firstName: 'Johnny',
       *             lastName: 'Mnemonic',
       *             job: 'Memory stick'
       *          }
       *       });
       *
       *       user.get('id');//№5
       *       user.get('group');//null
       *       user.get('guid');//010a151c-1160-d31d-11b3-18189155cc13
       *       user.get('displayName');//Johnny a.k.a "Keanu" Mnemonic
       *       user.get('job');//Memory stick
       *       user.get('uptime');//undefined
       *
       *       user.set('id', '№6');
       *       user.getRawData().id;//6
       *
       *       user.set('group', {id: 1, name: 'The One'});
       *       user.get('group');//{id: 1, name: 'The One'}
       *
       *       user.set('guid', 'new-one');//ReferenceError 'Model::set(): property "guid" is read only'
       *       user.set('displayName', 'Thomas a.k.a. "Neo" Anderson');//ReferenceError 'Model::set(): property "displayName" is read only'
       *    });
       * </pre>
       */
      _$properties: null,

      /**
       * @cfg {String} Название свойства, содержащего первичный ключ
       * @name WS.Data/Entity/Model#idProperty
       * @see getIdProperty
       * @see setIdProperty
       * @see getId
       * @example
       * Зададим первичным ключом модели свойство с названием id:
       * <pre>
       *    var article = new Model({
       *       idProperty: 'id',
       *       rawData: {
       *          id: 1,
       *          title: 'How to make a Model'
       *       }
       *    });
       *    article.getId();//1
       * </pre>
       */
      _$idProperty: '',

      /**
       * @member {Boolean} Признак, что модель удалена из источника данных
       */
      _isDeleted: false,

      /**
       * @member {Object.<String, *>} Объект, содержащий вычисленные значения свойств по умолчанию
       */
      _defaultPropertiesValues: null,

      /**
       * @member {Object.<String, Array.<Sting>>} Зависимости свойств: название свойства -> массив названий свойств, которые от него зависят
       */
      _propertiesDependency: null,

      /**
       * @member {String} Имя свойства, для которого сейчас осуществляется сбор зависимостей
       */
      _propertiesDependencyGathering: '',

      /**
       * @member {Object.<String, Boolean>} Объект, содержащий названия свойств, для которых сейчас выполняется вычисление значения
       */
      _nowCalculatingProperties: null,

      /**
       * @member {Object} Флаг показывающий была ли модель синхронизирована
       */
      _synced: false,

      constructor: function $Model(options) {
         this._defaultPropertiesValues = {};
         this._propertiesDependency = {};
         this._nowCalculatingProperties = {};
         Model.superclass.constructor.call(this, options);

         //FIXME: don't allow to inject properties through constructor
         this._propertiesInjected = options && 'properties' in options;

         //FIXME: backward compatibility for _options
         if (this._options) {
            //for _$properties
            if (this._options.properties) {
               this._$properties = CoreFunctions.merge(this._$properties || {}, this._options.properties);
            }
            //for _$idProperty
            if (this._options.idProperty) {
               this._$idProperty = this._options.idProperty;
            }
         }

         if (!this._$idProperty) {
            this._$idProperty = this._getAdapter().getKeyField(this._getRawData()) || '';
         }
      },

      destroy: function() {
         this._defaultPropertiesValues = null;
         this._propertiesDependency = null;
         this._nowCalculatingProperties = null;

         Model.superclass.destroy.call(this);
      },

      // region WS.Data/Entity/IObject

      get: function (name) {
         this._pushDependency(name);

         if (this._hasInPropertiesCache(name)) {
            return this._getFromPropertiesCache(name);
         }

         var superValue = Model.superclass.get.call(this, name),
            property = this._$properties && this._$properties[name];
         if (property) {
            if ('def' in property && !this._getRawDataAdapter().has(name)) {
               superValue = this.getDefault(name);
            }
            if (property.get) {
               var value = this._processCalculatedValue(name, superValue, property, true);

               if (value !== superValue) {
                  this._removeChild(superValue);
                  this._addChild(value, this._getRelationNameForField(name));
               }

               if (this._isFieldValueCacheable(value)) {
                  this._setToPropertiesCache(name, value);
               } else if (this._hasInPropertiesCache(name)) {
                  this._unsetFromPropertiesCache(name);
               }

               return value;
            }
         }

         return superValue;
      },

      set: function (name, value) {
         if (!this._$properties) {
            Model.superclass.set.call(this, name, value);
            return;
         }

         var map = this._getHashMap(name, value),
            superMap = {},
            key,
            property,
            errors;

         for (key in map) {
            if (!map.hasOwnProperty(key)) {
               continue;
            }

            this._deleteDependencyCache(key);

            value = map[key];

            property = this._$properties && this._$properties[key];
            if (property) {
               if (property.set) {
                  if (this._hasInPropertiesCache(key)) {
                     this._removeChild(
                        this._getFromPropertiesCache(key)
                     );
                     this._unsetFromPropertiesCache(key);
                  }

                  value = this._processCalculatedValue(key, value, property, false);
                  if (value === undefined) {
                     continue;
                  }
               } else if (property.get) {
                  errors = errors || [];
                  errors.push('property "' + key + '" is read only');
                  continue;
               }
            }

            superMap[key] = value;
         }

         Model.superclass.set.call(this, superMap);

         if (errors) {
            throw new ReferenceError(this._moduleName + '::set(): ' + errors.join(', '));
         }
      },

      has: function (name) {
         return (this._$properties && this._$properties.hasOwnProperty(name)) || Model.superclass.has.call(this, name);
      },

      // endregion WS.Data/Entity/IObject

      // region WS.Data/Collection/IEnumerable

      /**
       * Возвращает энумератор для перебора названий свойств модели
       * @return {WS.Data/Collection/ArrayEnumerator}
       * @example
       * Смотри пример {@link WS.Data/Entity/Record#getEnumerator для записи}:
       */
      getEnumerator: function () {
         return new ArrayEnumerator(this._getAllProperties());
      },

      /**
       * Перебирает все свойства модели (включая имеющиеся в "сырых" данных)
       * @param {Function(String, *)} callback Ф-я обратного вызова для каждого свойства. Первым аргументом придет название свойства, вторым - его значение.
       * @param {Object} [context] Контекст вызова callback.
       * @example
       * Смотри пример {@link WS.Data/Entity/Record#each для записи}:
       */
      each: function (callback, context) {
         return Model.superclass.each.call(this, callback, context);
      },

      // endregion WS.Data/Collection/IEnumerable

      // region WS.Data/Entity/SerializableMixin

      _getSerializableState: function() {
         var state = Model.superclass._getSerializableState.call(this);

         //Properties are owned by class, not by instance
         if (!this._propertiesInjected) {
            delete state.$options.properties;
         }

         state._instanceId = this.getInstanceId();
         state._isDeleted = this._isDeleted;
         state._defaultPropertiesValues = this._defaultPropertiesValues;

         return state;
      },

      _setSerializableState: function(state) {
         return Model.superclass._setSerializableState(state).callNext(function() {
            this._instanceId = state._instanceId;
            this._isDeleted = state._isDeleted;
            this._defaultPropertiesValues = state._defaultPropertiesValues;
         });
      },

      // endregion WS.Data/Entity/SerializableMixin

      // region Public methods

      /**
       * Возвращает описание свойств модели.
       * @return {Object.<String, Property>}
       * @see properties
       * @see Property
       * @example
       * Получим описание свойств модели:
       * <pre>
       *    var User = Model.extend({
       *          _$properties: {
       *             id: {
       *                get: function() {
       *                   this._id;
       *                },
       *                set: function(value) {
       *                   this._id = value;
       *                }
       *             },
       *             group: {
       *                get: function() {
       *                   this._group;
       *                }
       *             }
       *          },
       *          _id: 0
       *          _group: null
       *       }),
       *       user = new User();
       *
       *    user.getProperties();//{id: {get: Function, set: Function}, group: {get: Function}}
       * </pre>
       */
      getProperties: function () {
         return this._$properties;
      },

      /**
       * Возвращает значение свойства по умолчанию
       * @param {String} name Название свойства
       * @return {*}
       * @example
       * Получим дефолтное значение свойства id:
       * <pre>
       *    var User = Model.extend({
       *          _$properties: {
       *             id: {
       *                get: function() {
       *                   this._id;
       *                },
       *                def: function(value) {
       *                   return Date.now();
       *                }
       *             }
       *          },
       *          _id: 0
       *       }),
       *       user = new User();
       *
       *    user.getDefault('id');//1466419984715
       *    setTimeout(function(){
       *       user.getDefault('id');//1466419984715
       *    }, 100);
       * </pre>
       */
      getDefault: function (name) {
         if (!this._defaultPropertiesValues.hasOwnProperty(name)) {
            var property = this._$properties[name];
            if (property && 'def' in property) {
               this._defaultPropertiesValues[name] = [property.def instanceof Function ? property.def.call(this) : property.def];
            } else {
               this._defaultPropertiesValues[name] = [];
            }
         }
         return this._defaultPropertiesValues[name][0];
      },

      /**
       * Объединяет модель с данными другой модели
       * @param {WS.Data/Entity/Model} model Модель, с которой будет произведено объединение
       * @example
       * Объединим модели пользователя и группы пользователей:
       * <pre>
       *    var user = new Model({
       *          rawData: {
       *             id: 1,
       *             login: 'user1',
       *             group_id: 3
       *          }
       *       }),
       *       userGroup = new Model({
       *          rawData: {
       *             group_id: 3,
       *             group_name: 'Domain Users',
       *             group_members: 126
       *          }
       *       });
       *
       *    user.merge(userGroup);
       *    user.get('id');//1
       *    user.get('group_id');//3
       *    user.get('group_name');//'Domain Users'
       * </pre>
       */
      merge: function (model) {
         try {
            var modelData = {};
            model.each(function(key, val) {
               modelData[key] = val;
            });
            this.set(modelData);
         } catch (e) {
            if (!(e instanceof ReferenceError)) {
               throw e;
            }
         }
      },

      /**
       * Возвращает значение первичного ключа модели
       * @return {*}
       * @see idProperty
       * @see getIdProperty
       * @see setIdProperty
       * @example
       * Получим значение первичного ключа статьи:
       * <pre>
       *    var article = new Model({
       *       idProperty: 'id',
       *       rawData: {
       *          id: 1,
       *          title: 'How to make a Model'
       *       }
       *    });
       *    article.getId();//1
       * </pre>
       */
      getId: function () {
         var idProperty = this.getIdProperty();
         if (!idProperty) {
            Utils.logger.info(this._moduleName + '::getId(): idProperty is not defined');
            return undefined;
         }
         return this.get(idProperty);
      },

      /**
       * Возвращает название свойства, в котором хранится первичный ключ модели
       * @return {String}
       * @see idProperty
       * @see setIdProperty
       * @see getId
       * @example
       * Получим название свойства первичного ключа:
       * <pre>
       *    var article = new Model({
       *       idProperty: 'id',
       *       rawData: {
       *          id: 1,
       *          title: 'How to make a Model'
       *       }
       *    });
       *    article.getIdProperty();//'id'
       * </pre>
       */
      getIdProperty: function () {
         return this._$idProperty;
      },

      /**
       * Устанавливает название свойства, в котором хранится первичный ключ модели
       * @param {String} idProperty Название свойства для первичного ключа модели.
       * @see idProperty
       * @see getIdProperty
       * @see getId
       * @example
       * Зададим название свойства первичного ключа:
       * <pre>
       *    var article = new Model({
       *       rawData: {
       *          id: 1,
       *          title: 'How to make a Model'
       *       }
       *    });
       *    article.setIdProperty('id');
       *    article.getId();//1
       * </pre>
       */
      setIdProperty: function (idProperty) {
         if (idProperty && !this.has(idProperty)) {
            Utils.logger.info(this._moduleName + '::setIdProperty(): property "' + idProperty + '" is not defined');
            return;
         }
         this._$idProperty = idProperty;
      },

      /**
       * Возвращает значения всех свойств в виде объекта ключ-значение
       * @return {Object.<String, *>}
       * @example
       * Получим значения всех свойств в виде объекта:
       * <pre>
       *    var article = new Model({
       *       adapter: 'adapter.xml',
       *       rawData: '<?xml version="1.0"?><response><id>1</id><title>Article 1</title></response>'
       *    });
       *    article.toObject();//{id: 1, title: 'Article 1'}
       * </pre>
       * @deprecated Метод будет удален в 3.7.5, используйте {@link WS.Data/Chain}::toObject()
       */
      toObject: function() {
         Utils.logger.stack(this._moduleName + '::toObject(): method is deprecated and will be removed in 3.7.5. Use WS.Data/Chain::toObject() instead. See https://wi.sbis.ru/docs/WS/Data/Chain/ for details.');
         var data = {};
         this.each(function(field, value) {
            data[field] = value;
         });
         return data;
      },

      /**
      * Возвращает значения всех свойств в виде строки формата json
      * @return {String}
       * @example
       * Получим значения всех свойств в виде строки:
       * <pre>
       *    var article = new Model({
       *       rawData: {id: 1, title: 'Article 1'}
       *    });
       *    article.toString();//'{"id": 1, "title": "Article 1"}'
       * </pre>
      */
      toString: function() {
         var result = {};
         this.each(function(key, value) {
            result[key] = value;
         });
         return JSON.stringify(result);
      },


      // endregion Public methods

      //region Protected methods

      /**
       * Возвращает массив названий всех свойств (включая свойства в "сырых" данных)
       * @return {Array.<String>}
       * @protected
       */
      _getAllProperties: function() {
         var fields = this._getRawDataFields(),
            objProps,
            props;

         if (!this._$properties) {
            return fields;
         }

         objProps = this._$properties;
         props = Object.keys(objProps);
         return props.concat(CollectionHelpers.filter(fields, function(field) {
            return !objProps.hasOwnProperty(field);
         }));
      },

      /**
       * Возвращает вычисленное значение свойства
       * @param {String} name Имя свойства
       * @param {*} value Значение свойства
       * @param {Property} property Описание свойства
       * @param {Boolean} isReading Вычисление при чтении
       * @return {*}
       * @protected
       */
      _processCalculatedValue: function (name, value, property, isReading) {
         var checkKey = name + '|' + isReading,
            prevGathering;
         if (this._nowCalculatingProperties.hasOwnProperty(checkKey)) {
            throw new Error('Recursive value ' +  (isReading ? 'reading' : 'writing') + ' detected for property ' + name);
         }

         if (isReading) {
            prevGathering = this._propertiesDependencyGathering;
            this._propertiesDependencyGathering = name;
         }
         this._nowCalculatingProperties[checkKey] = true;
         try {
            value = isReading ?
               property.get.call(this, value) :
               property.set.call(this, value);
         } finally {
            delete this._nowCalculatingProperties[checkKey];
            if (isReading) {
               this._propertiesDependencyGathering = prevGathering;
            }
         }

         return value;
      },

      /**
       * Добавляет зависимое свойство
       * @param {String} name Название свойства.
       * @protected
       */
      _pushDependency: function (name) {
         if (this._propertiesDependencyGathering) {
            if (!this._propertiesDependency.hasOwnProperty(name)) {
               this._propertiesDependency[name] = [];
            }
            var dep = this._propertiesDependency[name];
            if (dep.indexOf(this._propertiesDependencyGathering) === -1) {
               dep.push(this._propertiesDependencyGathering);
            }
         }
      },

      /**
      * Удаляет закешированное значение для свойства и всех от него зависимых свойств
      * @param {String} name Название свойства.
      * @protected
      */
      _deleteDependencyCache: function (name) {
         if (this._propertiesDependency.hasOwnProperty(name)) {
            var dependency = this._propertiesDependency[name];
            for (var i = 0; i < dependency.length; i++) {
               this._unsetFromPropertiesCache(dependency[i]);
               this._deleteDependencyCache(dependency[i]);
            }
         }
      },

      //endregion Protected methods

      //region Deprecated methods

      setChanged: function (changed) {
         Utils.logger.stack('WS.Data/Entity/Model: method setChanged() is deprecated and will be removed in 3.7.6.', 0, 'error');
         if (changed) {
            this._changedFields.__fake_field = '__fake_value';
         } else {
            this._changedFields = {};
         }
      }

      //endregion Deprecated methods
   });

   Model.fromObject = function(data, adapter) {
      var record = Record.fromObject(data, adapter);
      if (!record) {
         return record;
      }
      return new Model({
         rawData: record.getRawData(true),
         adapter: record.getAdapter(),
         format: record._getFormat(true)//"Anakin, I Am Your Son"
      });
   };

   Di.register('entity.$model', Model, {instantiate: false});
   Di.register('entity.model', Model);
   Di.register('model', Model);//deprecated

   return Model;
});
