/* global define, Object, Array */
define('/Source/LocalSession', [
   'Core/core-merge',
   'Core/Deferred',
   'Lib/Storage/LocalStorage',
   'WS.Data/Source/ISource',
   'WS.Data/Query/Query',
   'WS.Data/Entity/Record',
   'WS.Data/Entity/Model',
   'WS.Data/Collection/RecordSet',
   'WS.Data/Adapter/Json',
   'WS.Data/Di',
   'WS.Data/Entity/Abstract',
   'WS.Data/Entity/OptionsMixin',
   'WS.Data/Entity/ReadWriteMixin',
   'WS.Data/Utils'
], function (
   coreMerge,
   Deferred,
   LocalStorage,
   ISource,
   Query,
   Record,
   Model,
   RecordSet,
   JsonAdapter,
   Di,
   Abstract,
   OptionsMixin,
   ReadWriteMixin,
   Utils
) {
   'use strict';

   var DATA_FIELD_PREFIX = 'd',
      KEYS_FIELD = 'i',
      ID_COUNT = 'k',

      WhereTokenizer = (function () {
         function WhereTokenizer() {
         }

         WhereTokenizer.eq = function (field, val) {
            if (!(val instanceof Array)) {
               return field == val;
            }
            return val.indexOf(field) !== -1;
         };

         WhereTokenizer.ne = function (field, val) {
            return field != val;
         };

         WhereTokenizer.lt = function (field, val) {
            return field < val;
         };

         WhereTokenizer.le = function (field, val) {
            return field <= val;
         };

         WhereTokenizer.gt = function (field, val) {
            return field > val;
         };

         WhereTokenizer.ge = function (field, val) {
            return field >= val;
         };

         WhereTokenizer.prototype.query = /(\w+)([!><=]*)/;

         WhereTokenizer.prototype.tokinize = function (key) {
            var m = key.match(this.query);
            m.shift();
            var op;
            if (m.length > 1) {
               op = m.pop();
            }
            var fn;
            switch (op) {
               case '<':
                  fn = WhereTokenizer.lt;
                  break;
               case '<=':
                  fn = WhereTokenizer.le;
                  break;
               case '>':
                  fn = WhereTokenizer.gt;
                  break;
               case '>=':
                  fn = WhereTokenizer.ge;
                  break;
               case '!=':
                  fn = WhereTokenizer.ne;
                  break;
               case '<>':
                  fn = WhereTokenizer.ne;
                  break;
               default:
                  fn = WhereTokenizer.eq;
            }
            return {
               field: m[0],
               op: fn
            };
         };

         return WhereTokenizer;
      }()),

      whereTokenizer = new WhereTokenizer(),

      LocalQuery = (function () {
         function LocalQuery(query) {
            this.query = query;
         }

         LocalQuery.prototype.select = function (items) {
            var fields = this.query.getSelect();
            if (Object.keys(fields).length === 0) {
               return items;
            }
            return items.map(function (item) {
               var res = {},
                  name;
               for (var i = 0; i < fields.length; i++) {
                  name = fields[i];
                  res[name] = item[name];
               }
               return res;
            });
         };

         LocalQuery.prototype.where = function (items) {
            var where = this.query.getWhere(),
               conditions = [],
               adapter = new JsonAdapter();

            if (typeof where === 'function') {
               return items.filter(function (item, i) {
                  return where(adapter.forRecord(item), i);
               });
            }

            for (var key in where) {
               if (!where.hasOwnProperty(key)) {
                  continue;
               }
               if (where[key] === undefined) {
                  continue;
               }
               var token = whereTokenizer.tokinize(key);
               if (token === undefined) {
                  return [];
               }
               conditions.push({field: token.field, op: token.op, value: where[key]});
            }
            return items.filter(function (item) {
               for (var i = 0; i < conditions.length; i++) {
                  var token = conditions[i];
                  if (item[token.field] instanceof Array) {
                     var trigger = false;
                     for (var j = 0, field = item[token.field]; j < field.length; j++) {
                        trigger = token.op(field, token.value);
                     }
                     return trigger;
                  }

                  if (!token.op(item[token.field], token.value)) {
                     return false;
                  }
               }
               return true;
            });
         };

         LocalQuery.prototype.order = function (items) {
            var orders = this.query.getOrderBy();
            if (orders.length > 0) {
               return LocalQuery.orderBy(items, orders);
            }
            return items;
         };

         LocalQuery.prototype.offset = function (items) {
            if (!this.query.getOffset()) {
               return items;
            }
            return items.slice(this.query.getOffset());
         };

         LocalQuery.prototype.limit = function (items) {
            if (this.query.getLimit() === undefined) {
               return items;
            }
            return items.slice(0, this.query.getLimit());
         };

         LocalQuery.orderBy = function (items, orders) {
            var data = items;

            function compare(a, b) {
               if (a === null && b !== null) {
                  //Считаем null меньше любого не-null
                  return -1;
               }
               if (a !== null && b === null) {
                  //Считаем любое не-null больше null
                  return 1;
               }
               if (a === b) {
                  return 0;
               }
               return a > b ? 1 : -1;
            }

            data.sort(function (a, b) {
               var result = 0;
               for (var i = 0; i < orders.length; i++) {
                  var order = orders[i];
                  var direction = order.getOrder() ? -1 : 1;
                  var selector = order.getSelector();
                  result = direction * compare(a[selector], b[selector]);
                  if (result !== 0) {
                     break;
                  }
               }
               return result;
            });
            return data;
         };
         return LocalQuery;
      }()),

      RawManager = (function () {
         function RawManager(ls) {
            this.ls = ls;
            var count = this.getCount();
            if (count === null) {
               this.setCount(0);
            }
            var keys = this.getKeys();
            if (keys === null) {
               this.setKeys([]);
            }
         }

         RawManager.prototype.get = function (key) {
            return this.ls.getItem(DATA_FIELD_PREFIX + key);
         };

         RawManager.prototype.set = function (key, data) {
            var count = this.getCount() + 1;
            var keys = this.getKeys();
            if (keys.indexOf(key) === -1) {
               keys.push(key);
               this.setKeys(keys);
               this.setCount(count);
            }
            return this.ls.setItem(DATA_FIELD_PREFIX + key, data);
         };

         RawManager.prototype.move = function (sourceItems, to, meta) {
            var keys = this.getKeys();
            var toIndex;
            sourceItems.forEach(function (id) {
               var index = keys.indexOf(id);
               keys.splice(index, 1);
            }, this);
            if (to !== null) {
               toIndex = keys.indexOf(to);
               if (toIndex === -1) {
                  return Deferred.fail('Record "to" with key ' + to + ' is not found.');
               }
            }
            var shift = meta && (meta.before || meta.position === 'before') ? 0 : 1;
            sourceItems.forEach(function (id, index) {
               keys.splice(toIndex + shift + index, 0, id);
            }, this);
            this.setKeys(keys);
         };

         RawManager.prototype.remove = function (keys) {
            var count;
            if (!(keys instanceof Array)) {
               count = this.getCount();
               this.removeFromKeys(keys);
               this.setCount(count - 1);
               return this.ls.removeItem(DATA_FIELD_PREFIX + keys);
            }
            for (var i = 0; i < keys.length; i++) {
               var key = keys[i];
               count = this.getCount();
               this.setCount(count - 1);
               this.ls.removeItem(DATA_FIELD_PREFIX + key);
            }
            this.removeFromKeys(keys);
            return true;
         };

         RawManager.prototype.removeFromKeys = function (keys) {
            var ks;
            if (keys instanceof Array) {
               ks = keys;
            }
            else {
               ks = [keys];
            }
            var data = this.getKeys();
            for (var i = 0; i < ks.length; i++) {
               var key = ks[i];
               var index = data.indexOf(key);
               if (index === -1) {
                  continue;
               }
               data.splice(index, 1);
            }
            this.setKeys(data);
         };

         RawManager.prototype.getCount = function () {
            return this.ls.getItem(ID_COUNT);
         };

         RawManager.prototype.setCount = function (number) {
            this.ls.setItem(ID_COUNT, number);
         };

         RawManager.prototype.getKeys = function () {
            return this.ls.getItem(KEYS_FIELD);
         };

         RawManager.prototype.setKeys = function (keys) {
            this.ls.setItem(KEYS_FIELD, keys);
         };

         /**
          * Проверка существования ключей
          * @param {String|Array<String>} keys Значение ключа или ключей
          * @return {Boolean} true, если все ключи существуют, иначе false
          */
         RawManager.prototype.existKeys = function (keys) {
            var existedKeys = this.getKeys();
            if (existedKeys.length === 0) {
               return false;
            }

            if (keys instanceof Array) {
               for (var i = 0; i < keys.length; i++) {
                  if (existedKeys.indexOf(keys[i]) <= -1){
                     return false;
                  }
               }
               return true;
            }

            return (existedKeys.indexOf(keys) > -1);
         };

         RawManager.prototype.reserveId = function () {
            function genId() {
               function str() {
                  return Math.floor((1 + Math.random()) * 0x1d0aa0)
                     .toString(32)
                     .substring(1);
               }
               return str() + str() + '-' + str() + '-' + str() + '-' +str() + '-' + str() + str();
            }

            var lastId;

            do {
               lastId = genId();
            } while(this.existKeys(lastId));

            return lastId;
         };

         return RawManager;
      }()),

      ModelManager = (function () {
         function ModelManager(adapter, idProperty) {
           this.adapter = adapter;
           this.idProperty = idProperty;
         }

         ModelManager.prototype.get = function (data) {
            data = Utils.clone(data);
            switch (this.adapter) {
               case 'adapter.recordset':
                  return new Model({
                     rawData: new Record({rawData: data}),
                     adapter: Di.create(this.adapter),
                     idProperty: this.idProperty
                  });

               case 'adapter.sbis':
                  return this.sbis(data);

               default:
                  return new Model({
                     rawData: data,
                     adapter: Di.create(this.adapter),
                     idProperty: this.idProperty
                  });
            }
         };

         ModelManager.prototype.sbis = function (data) {
            var rec = new Record({rawData: data}),
               format = rec.getFormat(),
               enumerator = rec.getEnumerator();

            var model = new Model({
               format: format,
               adapter: Di.create(this.adapter),
               idProperty: this.idProperty
            });

            while (enumerator.moveNext()) {
               var key = enumerator.getCurrent();
               model.set(key, rec.get(key));
            }
            return model;
         };

         return ModelManager;
      }()),

      Converter = (function () {
         function Converter(adapter, idProperty, modelManager) {
            this.adapter = adapter;
            this.idProperty = idProperty;
            this.modelManager = modelManager;
         }

         Converter.prototype.get = function (data) {
            data = Utils.clone(data);
            switch (this.adapter) {
               case 'adapter.recordset':
                  return this.recordSet(data);
               case 'adapter.sbis':
                  return this.sbis(data);
               default:
                  return data;
            }
         };

         Converter.prototype.recordSet = function (data) {
            var _data = [];
            if (data.length === 0) {
               return new RecordSet({
                  rawData: _data,
                  idProperty: this.idProperty
               });
            }

            for (var i = 0; i < data.length; i++) {
               var item = data[i];
               var model = this.modelManager.get(item);
               _data.push(model);
            }
            return new RecordSet({
               rawData: _data,
               idProperty: this.idProperty
            });
         };

         Converter.prototype.sbis = function (data) {
            if (data.length === 0) {
               return data;
            }
            var rs = new RecordSet({
               adapter: this.adapter
            });

            var format = new Record({rawData: data[0]}).getFormat();

            for (var j = 0; j < data.length; j++) {
               var item = data[j],
                  rec = new Record({
                     format: format,
                     adapter: this.adapter
                  }),
                  enumerator = rec.getEnumerator();
               while (enumerator.moveNext()) {
                  var key = enumerator.getCurrent();
                  rec.set(key, item[key]);
               }
               rs.add(rec);
            }

            return rs.getRawData();
         };

         return Converter;
      }()),

      initJsonData = function(source, data) {
         var item,
            itemId,
            key,
            i;

         for (i = 0; i < data.length; i ++) {
            item = data[i];
            itemId = item[source.getIdProperty()];
            key = itemId === undefined ? source.rawManager.reserveId() : itemId;
            source.rawManager.set(key, item);
         }
      },

      itemToObject = function (item, adapter) {
         if (!item) {
            return {};
         }

         var record = item,
            isRecord = item && item instanceof Record;

         if (!isRecord && isJsonAdapter(adapter)) {
            return item;
         }

         if (!isRecord) {
            record = new Record({
               adapter: adapter,
               rawData: item
            });
         }

         var data = {},
            enumerator = record.getEnumerator();

         while (enumerator.moveNext()) {
            var key = enumerator.getCurrent();
            data[key] = record.get(key);
         }

         return data;
      },

      isJsonAdapter = function(adapter) {
         if (typeof adapter === 'string') {
            return adapter.indexOf('adapter.json') > -1;
         }

         return adapter instanceof JsonAdapter;
      },

      LocalSession;

   /**
    * Общий локальный источник данных для всех вкладок.
    * Источник позволяет хранить данные в локальной сессии браузера.
    * Во всех вкладках будут одни и те же данные.
    *
    * @class /Source/LocalSession
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Source/ISource
    * @mixes WS.Data/Entity/OptionsMixin
    * @author Санников Кирилл
    * @public
    * @example
    * Создадим источник со списком объектов солнечной системы:
    * <pre>
    *    var solarSystem = new LocalSession({
    *       data: [
    *          {id: '1', name: 'Sun', kind: 'Star'},
    *          {id: '2', name: 'Mercury', kind: 'Planet'},
    *          {id: '3', name: 'Venus', kind: 'Planet'},
    *          {id: '4', name: 'Earth', kind: 'Planet'},
    *          {id: '5', name: 'Mars', kind: 'Planet'},
    *          {id: '6', name: 'Jupiter', kind: 'Planet'},
    *          {id: '7', name: 'Saturn', kind: 'Planet'},
    *          {id: '8', name: 'Uranus', kind: 'Planet'},
    *          {id: '9', name: 'Neptune', kind: 'Planet'},
    *          {id: '10', name: 'Pluto', kind: 'Dwarf planet'}
    *       ],
    *       idProperty: 'id'
    *    });
    * </pre>
    */
   LocalSession = Abstract.extend([ISource, OptionsMixin], /** @lends /Source/LocalSession.prototype */ {
      _moduleName: '/Source/LocalSession',
      _writable: ReadWriteMixin.writable,

      /**
       * @member {String|Function} Конструктор модуля, реализующего DataSet
       */
      _dataSetModule: 'source.dataset',

      /**
       * @cfg {String|WS.Data/Adapter/IAdapter} Адаптер для работы с форматом данных, выдаваемых источником. По умолчанию {@link WS.Data/Adapter/Json}.
       */
      _$adapter: 'adapter.json',

      /**
       * @cfg {String|Function} Конструктор рекордсетов, порождаемых источником данных. По умолчанию {@link WS.Data/Collection/RecordSet}.
       * @name WS.Data/Source/Base#listModule
       * @see getListModule
       * @see setListModule
       * @see WS.Data/Collection/RecordSet
       * @see WS.Data/Di
       * @example
       * Конструктор рекордсета, внедренный в виде названия зарегистрированной зависимости:
       * <pre>
       *    var Users = RecordSet.extend({
       *         getAdministrators: function() {
       *         }
       *      });
       *    Di.register('app.collections.users', Users);
       *    var dataSource = new LocalSession({
       *         listModule: 'app.collections.users'
       *      });
       * </pre>
       */
      _$listModule: 'collection.recordset',

      /**
       * @cfg {String|Function} Конструктор записей, порождаемых источником данных. По умолчанию {@link WS.Data/Entity/Model}.
       * @name /Source/LocalSession#model
       * @see getModel
       * @see setModel
       * @see WS.Data/Entity/Model
       * @see WS.Data/Di
       * @example
       * Конструктор пользовательской модели, внедренный в виде названия зарегистрированной зависимости:
       * <pre>
       *    var User = Model.extend({
       *         identify: function(login, password) {
       *         }
       *      });
       *    Di.register('app.model.user', User);
       *
       *    var dataSource = new LocalSession({
       *         model: 'app.model.user'
       *      });
       * </pre>
       */
      _$model: 'entity.model',

      /**
       * @cfg {String} Название свойства записи, содержащего первичный ключ.
       * @name /Source/LocalSession#idProperty
       * @see getIdProperty
       * @see setIdProperty
       * @example
       * Установим свойство 'primaryId' в качестве первичного ключа:
       * <pre>
       *    var dataSource = new LocalSession({
       *       idProperty: 'primaryId'
       *    });
       * </pre>
       */
      _$idProperty: '',

      /**
       * @member {String} Свойство данных, в котором лежит основная выборка
       */
      _dataSetItemsProperty: 'items',

      /**
       * @member {String} Свойство данных, в котором лежит общее кол-во строк, выбранных запросом
       */
      _dataSetTotalProperty: 'total',

      _options: {
         prefix: '',
         model: Model,
         data: []
      },

      constructor: function LocalSession (cfg) {
         if (!('prefix' in cfg)) {
            throw new Error('"prefix" not found in options.');
         }
         if (!('idProperty' in cfg)) {
            throw new Error('"idProperty" not found in options.');
         }

         OptionsMixin.constructor.call(this, cfg);

         this.rawManager = new RawManager(new LocalStorage(cfg.prefix));
         this.modelManager = new ModelManager(this._$adapter,this._$idProperty);
         this.converter = new Converter(this._$adapter,this._$idProperty, this.modelManager);

         this._initData(cfg.data);
      },

      ///region {WS.Data/Source/ISource}

      /**
       * Создает пустую модель через источник данных (при этом она не сохраняется в хранилище)
       * @param {Object|WS.Data/Entity/Record} [meta] Дополнительные мета данные, которые могут понадобиться для создания модели
       * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Entity/Model}.
       * @see WS.Data/Entity/Model
       * @example
       * Создадим новый объект:
       * <pre>
       *    solarSystem.create(
       *       {id: '11', name: 'Moon', 'kind': 'Satellite'}
       *    ).addCallback(function(satellite) {
       *       satellite.get('name');//'Moon'
       *    });
       * </pre>
       */
      create: function (meta) {
         var item = itemToObject(meta, this._$adapter);
         if (item[this.getIdProperty()] === undefined) {
            this.rawManager.reserveId();
         }
         return Deferred.success(this.modelManager.get(item));
      },

      /**
       * Читает модель из источника данных
       * @param {String|Number} key Первичный ключ модели
       * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет
       * @see WS.Data/Entity/Model
       * Прочитаем данные о Солнце:
       * <pre>
       *    solarSystem.read(1).addCallback(function(star) {
       *        star.get('name');//'Sun'
       *     });
       * </pre>
       */
      read: function (key) {
         var data = this.rawManager.get(key);
         if (data) {
            return Deferred.success(this.modelManager.get(data));
         }
         return Deferred.fail('Record with key "' + key + '" does not exist');
      },

      /**
       *
       * Обновляет модель в источнике данных
       * @param {WS.Data/Entity/Model|WS.Data/Collection/RecordSet} data Обновляемая запись или рекордсет
       * @return {Core/Deferred} Асинхронный результат выполнения
       * @example
       * Вернем Плутону статус планеты:
       * <pre>
       *    var pluto = new Model({
       *          idProperty: 'id'
       *       });
       *    pluto.set({
       *       id: '10',
       *       name: 'Pluto',
       *       kind: 'Planet'
       *    });
       *
       *    solarSystem.update(pluto).addCallback(function() {
       *       alert('Pluto is a planet again!');
       *    });
       * </pre>
       */
      update: function (data) {
         var updateRecord = function (record) {
            var key,
               idProperty = record.getIdProperty ? record.getIdProperty() : this.getIdProperty();

            try {
               key = record.get(idProperty)
            } catch (e) {
               return Deferred.fail('Record idProperty doesn\'t exist');
            }

            if (key === undefined) {
               key = this.rawManager.reserveId();
            }

            record.set(idProperty, key);
            var item = itemToObject(record, this._$adapter);
            this.rawManager.set(key, item);
            record.acceptChanges();

            return key;
         }.bind(this);

         var keys = [];
         if (data instanceof RecordSet) {
            data.each(function (record) {
               keys.push(updateRecord(record));
            });
         } else {
            keys.push(updateRecord(data));
         }

         return Deferred.success(keys);
      },

      /**
       *
       * Удаляет модель из источника данных
       * @param {String|Array} keys Первичный ключ, или массив первичных ключей модели
       * @return {Core/Deferred} Асинхронный результат выполнения
       * @example
       * Удалим Марс:
       * <pre>
       *    solarSystem.destroy('5').addCallback(function() {
       *       alert('Mars deleted!');
       *    });
       * </pre>
       */
      destroy: function (keys) {
         var isExistKeys = this.rawManager.existKeys(keys);
         if (!isExistKeys) {
            return Deferred.fail('Not all keys exist');
         }
         this.rawManager.remove(keys);
         return Deferred.success(true);
      },

      /**
       * Объединяет одну модель с другой
       * @param {String} from Первичный ключ модели-источника (при успешном объедининии модель будет удалена)
       * @param {String} to Первичный ключ модели-приёмника
       * @return {Core/Deferred} Асинхронный результат выполнения
       * @example
       * <pre>
       *  solarSystem.merge('5','6')
       *     .addCallbacks(function () {
       *         alert('Mars became Jupiter!');
       *     })
       * </pre>
       */
      merge: function (from, to) {
         var fromData = this.rawManager.get(from);
         var toData = this.rawManager.get(to);
         if (fromData === null || toData === null) {
            return Deferred.fail('Record with key ' + from + ' or ' + to + ' isn\'t exists');
         }
         var data = coreMerge(fromData, toData);
         this.rawManager.set(from, data);
         this.rawManager.remove(to);
         return Deferred.success(true);
      },

      /**
       * Создает копию модели
       * @param {String} key Первичный ключ модели
       * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Entity/Model копия модели}.
       * @example
       * <pre>
       *   solarSystem.copy('5').addCallbacks(function (copy) {
       *      console.log('New id: ' + copy.getId());
       *   });
       * </pre>
       */
      copy: function (key) {
         var myId = this.rawManager.reserveId();
         var from = this.rawManager.get(key);
         if (from === null) {
            return Deferred.fail('Record with key ' + from + ' isn\'t exists');
         }
         var to = coreMerge({}, from);
         this.rawManager.set(myId, to);
         return Deferred.success(this.modelManager.get(to));
      },

      /**
       * Выполняет запрос на выборку
       * @param {WS.Data/Query/Query} [query] Запрос
       * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Source/DataSet}.
       * @see WS.Data/Query/Query
       * @see WS.Data/Source/DataSet
       * @example
       * <pre>
       *   solarSystem.query().addCallbacks(function (ds) {
       *      console.log(ds.getAll().at(0));
       *   });
       * </pre>
       */
      query: function (query) {
         if (query === void 0) {
            query = new Query();
         }
         var data = [],
            keys = this.rawManager.getKeys();
         for (var i = 0; i < keys.length; i++) {
            data.push(this.rawManager.get(keys[i]));
         }

         var lq = new LocalQuery(query);
         data = lq.order(data);
         data = lq.where(data);
         data = lq.offset(data);
         data = lq.limit(data);
         data = lq.select(data);

         return Deferred.success(this._getDataSet({
            items: this.converter.get(data),
            total: data.length
         }));
      },

      /**
       * Производит перемещение записи.
       * @param {Array} from Перемещаемая модель.
       * @param {String} to Идентификатор целевой записи, относительно которой позиционируются перемещаемые.
       * @param {MoveMetaConfig} [meta] Дополнительные мета данные.
       * @return {Core/Deferred} Асинхронный результат выполнения.
       * @example
       * <pre>
       * var ls = new LocalStorage('mdl_solarsystem');
       * solarSystem.move('6','3',{position: 'after'})
       *    .addCallbacks(function () {
       *       console.log(ls.getItem('i')[3] === '6');
       *    })
       * </pre>
       */
      move: function (from, to, meta) {
         var keys = this.rawManager.getKeys(),
            sourceItems = [];
         if (!(from instanceof Array)) {
            from = [from];
         }
         from.forEach(function (id) {
            var index = keys.indexOf(id);
            if (index === -1) {
               return Deferred.fail('Record "from" with key ' + from + ' is not found.');
            }
            sourceItems.push(id);
         }, this);
         if (meta.position === 'on') {
            return Deferred.success(this._hierarchyMove(sourceItems, to, meta, keys));
         }
         return Deferred.success(this.rawManager.move(sourceItems, to, meta));
      },

      getIdProperty: function () {
         return this._$idProperty;
      },

      getAdapter: function () {
         return Di.create(this._$adapter);
      },

      getListModule: function () {
         return this._$listModule;
      },

      setListModule: function (listModule) {
         this._$listModule = listModule;
      },

      getModel: function () {
         return this._$model;
      },

      setModel: function (model) {
         this._$model = model;
      },

      ///endregion

      ///region protected

      /**
       * Инициализирует данные источника, переданные в конструктор
       * @param {Object} data данные
       * @protected
       */
      _initData: function(data) {
         if (!data) {
            return;
         }

         if (isJsonAdapter(this._$adapter)){
            initJsonData(this, data);
            return;
         }

         var adapter = this.getAdapter().forTable(data),
            handler = function (record) {
               this.update(record);
            }.bind(this);
         for (var i = 0; i < adapter.getCount(); i++) {
            var meta = adapter.at(i);
            this.create(meta).addCallback(handler);
         }
      },

      /**
       * Создает новый экземпляр dataSet
       * @param {Object} rawData данные
       * @return {WS.Data/Source/DataSet}
       * @protected
       */
      _getDataSet: function (rawData) {
         return new Di.create(this._dataSetModule, coreMerge({
               writable: this._writable,
               adapter: this.getAdapter(),
               model: this.getModel(),
               listModule: this.getListModule(),
               idProperty: this.getIdProperty()
            },
            {
               rawData: rawData,
               itemsProperty: this._dataSetItemsProperty,
               totalProperty: this._dataSetTotalProperty
            },
            {rec: false}
         ));
      },

      _hierarchyMove: function (sourceItems, to, meta, keys) {
         var _this = this,
            toIndex,
            parentValue;
         if (!meta.parentProperty) {
            return Deferred.fail('Parent property is not defined');
         }
         if (to) {
            toIndex = keys.indexOf(to);
            if (toIndex === -1) {
               return Deferred.fail('Record "to" with key ' + to + ' is not found.');
            }
            var item = this.rawManager.get(keys[toIndex]);
            parentValue = item[meta.parentProperty];
         } else {
            parentValue = null;
         }
         sourceItems.forEach(function (id) {
            var item = _this.rawManager.get(id);
            item[meta.parentProperty] = parentValue;
            _this.rawManager.set(id, item);
         });
      },

      _reorderMove: function (sourceItems, to, meta, keys) {
         var toIndex;
         sourceItems.forEach(function (id) {
            var index = keys.indexOf(id);
            keys.splice(index, 1);
         }, this);
         if (to !== null) {
            toIndex = keys.indexOf(to);
            if (toIndex === -1) {
               return Deferred.fail('Record "to" with key ' + to + ' is not found.');
            }
         }
         var shift = meta && (meta.before || meta.position === 'before') ? 0 : 1;
         sourceItems.forEach(function (id, index) {
            keys.splice(toIndex + shift + index, 0, id);
         }, this);
         this.rawManager.setKeys(keys);
      }

      ///endregion
   });

   return LocalSession;
});
