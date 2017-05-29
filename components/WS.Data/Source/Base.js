/* global define */
define('js!WS.Data/Source/Base', [
   'js!WS.Data/Source/ISource',
   'js!WS.Data/Source/DataSet',
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Entity/OptionsMixin',
   'js!WS.Data/Entity/ObservableMixin',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'js!WS.Data/Entity/Model',
   'js!WS.Data/Collection/RecordSet',
   'js!WS.Data/Adapter/Json',
   'Core/core-instance',
   'Core/core-merge'
], function (
   ISource,
   DataSet,
   Abstract,
   OptionsMixin,
   ObservableMixin,
   Di,
   Utils,
   EntityModel,
   CollectionRecordSet,
   AdapterJson,
   CoreInstance,
   coreMerge
) {
   'use strict';

   /**
    * Базовый источник данных.
    * Это абстрактный класс, не предназначенный для создания самостоятельных экземпляров.
    * @class WS.Data/Source/Base
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Source/ISource
    * @mixes WS.Data/Entity/OptionsMixin
    * @mixes WS.Data/Entity/ObservableMixin
    * @public
    * @author Мальцев Алексей
    */

   var Base = Abstract.extend([ISource, OptionsMixin, ObservableMixin], /** @lends WS.Data/Source/Base.prototype */{
      _moduleName: 'WS.Data/Source/Base',

      /**
       * @cfg {Endpoint|String} Конечная точка, обеспечивающая доступ клиента к функциональным возможностям источника данных.
       * @name WS.Data/Source/Base#endpoint
       * @remark
       * Можно успользовать сокращенную запись, передав значение в виде строки - в этом случае оно будет интерпретироваться как контракт (endpoint.contract).
       * @see getEndPoint
       * @example
       * Подключаем пользователей через HTTP API:
       * <pre>
       *    var dataSource = new HttpSource({
       *       endpoint: {
       *          address: '/api/',
       *          contract: 'users/'
       *       }
       *    });
       * </pre>
       * Подключаем пользователей через HTTP API с использованием сокращенной нотации:
       * <pre>
       *    var dataSource = new HttpSource({
       *       endpoint: '/users/'
       *    });
       * </pre>
       * Подключаем пользователей через HTTP API с указанием адреса подключения:
       * <pre>
       *    var dataSource = new RpcSource({
       *       endpoint: {
       *          address: '//server.name/api/rpc/',
       *          contract: 'Users'
       *       }
       *    });
       * </pre>
       */
      _$endpoint: null,

      /**
       * @cfg {Object} Соответствие методов CRUD+ контракту. Определяет, как именно источник реализует каждый метод CRUD+.
       * @name WS.Data/Source/Base#binding
       * @see getBinding
       * @see setBinding
       * @see create
       * @see read
       * @see destroy
       * @see query
       * @see copy
       * @see merge
       * @example
       * Подключаем пользователей через HTTP API, для каждого метода CRUD+ укажем путь в URL:
       * <pre>
       *    var dataSource = new HttpSource({
       *       endpoint: {
       *          address: '//some.server/',
       *          contract: 'users/'
       *       },
       *       binding: {
       *          create: 'add/',//dataSource.create() calls //some.server/users/add/ via HTTP
       *          read: 'load/',//dataSource.read() calls //some.server/users/load/ via HTTP
       *          update: 'save/',//dataSource.update() calls //some.server/users/save/ via HTTP
       *          destroy: 'delete/',//dataSource.destroy() calls //some.server/users/delete/ via HTTP
       *          query: 'list/'//dataSource.query() calls //some.server/users/list/ via HTTP
       *       }
       *    });
       * </pre>
       * Подключаем пользователей через RPC, для каждого метода CRUD+ укажем суффикс в имени удаленного метода:
       * <pre>
       *    var dataSource = new RpcSource({
       *       endpoint: {
       *          address: '//some.server/rpc-gate/',
       *          contract: 'Users'
       *       },
       *       binding: {
       *          create: 'Add',//dataSource.create() calls UsersAdd() via RPC
       *          read: 'Load',//dataSource.read() calls UsersLoad() via RPC
       *          update: 'Save',//dataSource.update() calls UsersSave() via RPC
       *          destroy: 'Delete',//dataSource.destroy() calls UsersDelete() via RPC
       *          query: 'List'//dataSource.query() calls UsersList() via RPC
       *       }
       *    });
       * </pre>
       */
      _$binding: {
         /**
          * @cfg {String} Операция создания записи через метод {@link create}.
          * @name WS.Data/Source/Base#binding.create
          */
         create: 'create',

         /**
          * @cfg {String} Операция чтения записи через метод {@link read}.
          * @name WS.Data/Source/Base#binding./**
          */
         read: 'read',

         /**
          * @cfg {String} Операция обновления записи через метод {@link update}.
          * @name WS.Data/Source/Base#binding.update
          */
         update: 'update',

         /**
          * @cfg {String} Операция удаления записи через метод {@link destroy}.
          * @name WS.Data/Source/Base#binding.destroy
          */
         destroy: 'delete',

         /**
          * @cfg {String} Операция получения списка записей через метод {@link query}.
          * @name WS.Data/Source/Base#binding.query
          */
         query: 'query',

         /**
          * @cfg {String} Операция копирования записей через метод {@link copy}.
          * @name WS.Data/Source/Base#binding.copy
          */
         copy: 'copy',

         /**
          * @cfg {String} Операция объединения записей через метод {@link merge}.
          * @name WS.Data/Source/Base#binding.merge
          */
         merge: 'merge',

         /**
          * @cfg {String} Операция перемещения записи через метод {@link move}.
          * @name WS.Data/Source/Base#binding.move
          */
         move: 'move'
      },

      /**
       * @cfg {String|WS.Data/Adapter/IAdapter} Адаптер для работы с форматом данных, выдаваемых источником. По умолчанию {@link WS.Data/Adapter/Json}.
       * @name WS.Data/Source/Base#adapter
       * @see getAdapter
       * @see setAdapter
       * @see WS.Data/Adapter/IAdapter
       * @see WS.Data/Di
       * @example
       * Адаптер для данных в формате БЛ СБИС, внедренный в виде названия зарегистрированной зависимости:
       * <pre>
       *    define(['js!WS.Data/Adapter/Sbis'], function () {
       *       var dataSource = new MemorySource({
       *          adapter: 'adapter.sbis',
       *          data: {
       *             _type: 'recordset',
       *             d: [],
       *             s: []
       *          }
       *       });
       *    });
       * </pre>
       * Адаптер для данных в формате БЛ СБИС, внедренный в виде готового экземпляра:
       * <pre>
       *    define(['js!WS.Data/Adapter/Sbis'], function (SbisAdapter) {
       *       var dataSource = new MemorySource({
       *          adapter: new SbisAdapter(),
       *          data: {
       *             _type: 'recordset',
       *             d: [],
       *             s: []
       *          }
       *       });
       *    });
       * </pre>
       */
      _$adapter: 'adapter.json',

      /**
       * @cfg {String|Function} Конструктор записей, порождаемых источником данных. По умолчанию {@link WS.Data/Entity/Model}.
       * @name WS.Data/Source/Base#model
       * @see getModel
       * @see setModel
       * @see WS.Data/Entity/Model
       * @see WS.Data/Di
       * @example
       * Конструктор пользовательской модели, внедренный в виде названия зарегистрированной зависимости:
       * <pre>
       *    var User = Model.extend({
       *       identify: function(login, password) {
       *       }
       *    });
       *    Di.register('app.model.user', User);
       *    //...
       *    var dataSource = new MemorySource({
       *       model: 'app.model.user'
       *    });
       * </pre>
       * Конструктор пользовательской модели, внедренный в виде класса:
       * <pre>
       *    var User = Model.extend({
       *       identify: function(login, password) {
       *       }
       *    });
       *    //...
       *    var dataSource = new MemorySource({
       *       model: User
       *    });
       * </pre>
       */
      _$model: 'entity.model',

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
       *       getAdministrators: function() {
       *       }
       *    });
       *    Di.register('app.collections.users', Users);
       *    //...
       *    var dataSource = new MemorySource({
       *       listModule: 'app.collections.users'
       *    });
       * </pre>
       * Конструктор рекордсета, внедренный в виде класса:
       * <pre>
       *    var Users = RecordSet.extend({
       *       getAdministrators: function() {
       *       }
       *    });
       *    //...
       *    var dataSource = new MemorySource({
       *       listModule: Users
       *    });
       * </pre>
       */
      _$listModule: 'collection.recordset',

      /**
       * @cfg {String} Название свойства записи, содержащего первичный ключ.
       * @name WS.Data/Source/Base#idProperty
       * @see getIdProperty
       * @see setIdProperty
       * @see WS.Data/Entity/Model#idProperty
       * @example
       * Установим свойство 'primaryId' в качестве первичного ключа:
       * <pre>
       *    var dataSource = new MemorySource({
       *       idProperty: 'primaryId'
       *    });
       * </pre>
       */
      _$idProperty: '',

      /**
       * @cfg {String} Имя поля, по которому по умолчанию сортируются записи выборки.
       * @name WS.Data/Source/Base#orderProperty
       * @see getOrderProperty
       * @see setOrderProperty
       * @see move
       */
      _$orderProperty: '',

      /**
       * @cfg {Object} Дополнительные настройки источника данных.
       * @name WS.Data/Source/Base#options
       */
      _$options: {
         /**
          * @cfg {Boolean} Режим отладки.
          * @name WS.Data/Source/Base#options.debug
          */
         debug: false
      },

      /**
       * @member {String|Function} Конструктор модуля, реализующего DataSet
       */
      _dataSetModule: 'source.dataset',

      /**
       * @member {String} Свойство данных, в котором лежит основная выборка
       */
      _dataSetItemsProperty: '',

      /**
       * @member {String} Свойство данных, в котором лежит общее кол-во строк, выбранных запросом
       */
      _dataSetTotalProperty: '',

      constructor: function $Base(options) {
         options = options || {};

         this._$endpoint = this._$endpoint || {};
         //Shortcut support
         if (typeof options.endpoint === 'string') {
            options.endpoint = {
               contract: options.endpoint
            };
         }
         if (options.endpoint instanceof Object) {
            this._$endpoint = coreMerge(options.endpoint, this._$endpoint, {preferSource: true, clone: true});
         }

         if (options.binding instanceof Object) {
            this._$binding = coreMerge(options.binding, this._$binding || {}, {preferSource: true, clone: true});
         }

         if (options.options instanceof Object) {
            this._$options = coreMerge(options.options, this._$options || {}, {preferSource: true, clone: true});
         }

         Base.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
         ObservableMixin.constructor.call(this, options);
      },

      //region WS.Data/Source/ISource

      getEndpoint: function () {
         return this._$endpoint;
      },

      getBinding: function () {
         return coreMerge({}, this._$binding, {clone: true});
      },

      setBinding: function (binding) {
         this._$binding = binding;
      },

      getAdapter: function () {
         if (typeof this._$adapter === 'string') {
            this._$adapter = Di.create(this._$adapter);
         }
         return this._$adapter;
      },

      setAdapter: function (adapter) {
         this._$adapter = adapter;
      },

      getModel: function () {
         return this._$model;
      },

      setModel: function (model) {
         this._$model = model;
      },

      getListModule: function () {
         return this._$listModule;
      },

      setListModule: function (listModule) {
         this._$listModule = listModule;
      },

      getIdProperty: function () {
         return this._$idProperty;
      },

      setIdProperty: function (name) {
         this._$idProperty = name;
      },

      getOrderProperty: function () {
         return this._$orderProperty;
      },

      setOrderProperty: function (name) {
         this._$orderProperty = name;
      },

      getOptions: function () {
         return coreMerge({}, this._$options, {clone: true});
      },

      setOptions: function (options) {
         options = coreMerge({}, options, {clone: true});
         this._$options = coreMerge(options, this._$options, {clone: true, preferSource: true});
      },

      //endregion WS.Data/Source/ISource

      //region Protected methods

      _prepareCreateResult: function(data) {
         return this._getModelInstance(data);
      },

      _prepareReadResult: function(data) {
         var model = this._getModelInstance(data);
         return model;
      },

      _prepareUpdateResult: function(data, keys) {
         var idProperty = this.getIdProperty(),
            _callback = function(record, key){
               if (key &&
                  idProperty &&
                  !record.get(idProperty)
               ) {
                  record.set(idProperty, key);
               }
               record.acceptChanges();
            };
         if (CoreInstance.instanceOfModule(data, 'WS.Data/Collection/RecordSet')) {
            data.each(function(record, i){
               _callback(record, keys ? keys[i] : undefined);
            });
         } else {
            _callback(data, keys);
         }
         return keys;
      },

      _prepareQueryResult: function(data) {
         return this._prepareCallResult(data);
      },

      _prepareCallResult: function(data) {
         return this._getDataSetInstance({
            rawData: data,
            itemsProperty: this._dataSetItemsProperty,
            totalProperty: this._dataSetTotalProperty
         });
      },

      /**
       * Определяет название свойства с первичным ключом по данным
       * @param {*} data Сырые данные
       * @return {String}
       * @protected
       */
      _getIdPropertyByData: function(data) {
         return this.getAdapter().getKeyField(data) || '';
      },

      /**
       * Создает новый экземпляр модели
       * @param {*} data Данные модели
       * @return {WS.Data/Entity/Model}
       * @protected
       */
      _getModelInstance: function (data) {
         return Di.create(this._$model, {
            rawData: data,
            adapter: this.getAdapter(),
            idProperty: this.getIdProperty()
         });
      },

      /**
       * Создает новый экземпляр списка
       * @param {*} data Данные списка
       * @return {WS.Data/Collection/List}
       * @protected
       */
      _getListInstance: function (data) {
         return Di.create(this._$listModule, {
            rawData: data,
            adapter: this.getAdapter(),
            idProperty: this.getIdProperty()
         });
      },

      /**
       * Создает новый экземпляр dataSet
       * @param {Object} cfg Опции конструктора
       * @return {WS.Data/Source/DataSet}
       * @protected
       */
      _getDataSetInstance: function (cfg) {
         return new Di.create(
            this._dataSetModule,
            coreMerge({
               source: this,
               adapter: this.getAdapter(),
               model: this.getModel(),
               listModule: this.getListModule(),
               idProperty: this.getIdProperty() || this._getIdPropertyByData(cfg.rawData || null)
            }, cfg, {
               rec: false
            })
         );
      },

      /**
       * Перебирает все записи выборки
       * @param {*} data Выборка
       * @param {Function} callback Ф-я обратного вызова для каждой записи
       * @param {Object} context Конекст
       * @protected
       */
      _each: function (data, callback, context) {
         var tableAdapter = this.getAdapter().forTable(data),
            index,
            count;

         for (index = 0, count = tableAdapter.getCount(); index < count; index++) {
            callback.call(context || this, tableAdapter.at(index), index);
         }
      }

      //endregion Protected methods
   });

   return Base;
});
