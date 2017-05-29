/* global define, DeferredCanceledError */
define('js!WS.Data/Source/Remote', [
   'js!WS.Data/Source/Base',
   'js!WS.Data/Entity/Record',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'Core/core-instance',
   'Core/core-merge'
], function (
   Base,
   Record,
   Di,
   Utils,
   CoreInstance,
   coreMerge
) {
   'use strict';

   var NAVIGATION_TYPE = {
         PAGE: 'Page',
         OFFSET: 'Offset'
      },
      Remote;

   /**
    * Источник данных, работающий удаленно.
    * Это абстрактный класс, не предназначенный для создания самостоятельных экземпляров.
    * @class WS.Data/Source/Remote
    * @extends WS.Data/Source/Base
    * @public
    * @author Мальцев Алексей
    */

   Remote = Base.extend(/** @lends WS.Data/Source/Remote.prototype */{
      /**
       * @typedef {String} NavigationType
       * @variant Page По номеру страницы: передается номер страницы выборки и количество записей на странице.
       * @variant Offset По смещению: передается смещение от начала выборки и количество записей на странице.
       */

      /**
       * @event onBeforeProviderCall Перед вызовом удаленного сервиса через провайдер
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} name Имя сервиса
       * @param {Object.<String, *>} [args] Аргументы сервиса (передаются по ссылке, можно модифицировать, но при этом следует учитывать, что изменяется оригинальный объект)
       * @example
       * Добавляем в фильтр выборки поле enabled со значением true:
       * <pre>
       *    dataSource.subscribe('onBeforeProviderCall', function(eventObject, name, args){
       *       switch (name){
       *          case 'query':
       *             //Select only records with enabled == true
       *             args.filter = args.filter || {};
       *             args.filter.enabled = true;
       *             break;
       *       }
       *    });
       * </pre>
       * Передаем в вызов удаленного сервиса клон аргументов, чтобы не "портить" оригинал:
       * <pre>
       *    define(['Core/core-functions'], function(CoreFunctions) {
       *       dataSource.subscribe('onBeforeProviderCall', function(eventObject, name, args){
       *          args = CoreFunctions.clone(args);
       *          switch (name){
       *             case 'getUsersList':
       *                //Select only actice users
       *                args.filter = args.filter || {};
       *                args.filter.active = true;
       *                break;
       *          }
       *          eventObject.setResult(args);
       *       });
       *    });
       * </pre>
       */

      _moduleName: 'WS.Data/Source/Remote',

      /**
       * @cfg {String|Function|WS.Data/Source/Provider/IAbstract} Объект, реализующий сетевой протокол для обмена в режиме клиент-сервер
       * @name WS.Data/Source/Remote#provider
       * @see getProvider
       * @see WS.Data/Di
       * @example
       * <pre>
       *    var dataSource = new RemoteSource({
       *       endpoint: '/users/'
       *       provider: 'source.provider.ajax'
       *    });
       * </pre>
       * @example
       * <pre>
       *    var dataSource = new RemoteSource({
       *       endpoint: '/users/'
       *       provider: new AjaxProvider()
       *    });
       * </pre>
       */
      _$provider: null,

      _$options: coreMerge({
         /**
          * @cfg {Boolean} При сохранении отправлять только измененные записи (если обновляется набор записей) или только измененые поля записи (если обновляется одна запись).
          * @name WS.Data/Source/Remote#options.updateOnlyChanged
          * @remark Задавать опцию имеет смысл только если указано значение опции {@link idProperty}, позволяющая отличить новые записи от уже существующих.
          */
         updateOnlyChanged: false,

         /**
          * @cfg {NavigationType} Тип навигации, используемой в методе {@link query}.
          * @name WS.Data/Source/Remote#options.navigationType
          * @example
          * Получим заказы магазина за сегодня с двадцать первого по тридцатый c использованием навигации через смещение:
          * <pre>
          *    var dataSource = new RemoteSource({
          *          endpoint: 'Orders'
          *          options: {
          *             navigationType: RemoteSource.prototype.NAVIGATION_TYPE.OFFSET
          *          }
          *       }),
          *       query = new Query();
          *
          *    query.select([
          *          'id',
          *          'date',
          *          'amount'
          *       ])
          *       .where({
          *          'date': new Date()
          *       })
          *       .orderBy('id')
          *       .offset(20)
          *       .limit(10);
          *
          *    dataSource.query(query).addCallback(function(dataSet) {
          *       var orders = dataSet.getAll();
          *    });
          * </pre>
          */
         navigationType: NAVIGATION_TYPE.PAGE
      }, Base.prototype._$options, {preferSource: true}),

      constructor: function $Remote(options) {
         Remote.superclass.constructor.call(this, options);
         this._publish('onBeforeProviderCall');
      },

      //region WS.Data/Source/ISource

      create: function(meta) {
         return this._makeCall(
            this._$binding.create,
            this._prepareCreateArguments(meta)
         ).addCallback((function (data) {
            return this._prepareCreateResult(data);
         }).bind(this));
      },

      read: function(key, meta) {
         return this._makeCall(
            this._$binding.read,
            this._prepareReadArguments(key, meta)
         ).addCallback((function (data) {
            return this._prepareReadResult(data);
         }).bind(this));
      },

      update: function(data, meta) {
         return this._makeCall(
            this._$binding.update,
            this._prepareUpdateArguments(data, meta)
         ).addCallback((function (key) {
            return this._prepareUpdateResult(data, key);
         }).bind(this));
      },

      destroy: function(keys, meta) {
         return this._makeCall(
            this._$binding.destroy,
            this._prepareDestroyArguments(keys, meta)
         );
      },

      merge: function(from, to) {
         return this._makeCall(
            this._$binding.merge,
            this._prepareMergeArguments(from, to)
         );
      },

      copy: function(key, meta) {
         return this._makeCall(
            this._$binding.copy,
            this._prepareCopyArguments(key, meta)
         ).addCallback((function (data) {
            return this._prepareReadResult(data);
         }).bind(this));
      },

      query: function(query) {
         return this._makeCall(
            this._$binding.query,
            this._prepareQueryArguments(query)
         ).addCallback((function (data) {
            return this._prepareQueryResult(data);
         }).bind(this));
      },

      call: function (command, data) {
         return this._makeCall(
            command,
            data
         ).addCallback((function (data) {
            return this._prepareCallResult(data);
         }).bind(this));
      },

      move: function (from, to, meta) {
         return this._makeCall(
            this._$binding.move,
            this._prepareMoveArguments(from, to, meta)
         );
      },

      //endregion WS.Data/Source/ISource

      //region Public methods

      /**
       * Возвращает объект, реализующий сетевой протокол для обмена в режиме клиент-сервер
       * @return {WS.Data/Source/Provider/IAbstract}
       * @see provider
       */
      getProvider: function () {
         return (this._$provider = this._getProvider(this._$provider, {
            endpoint: this._$endpoint,
            options: this._$options,
            //TODO: remove pass 'service' and 'resource'
            service: this._$endpoint.address,
            resource: this._$endpoint.contract
         }));
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Вызывает удаленный сервис через провайдер
       * @param {String} name Имя сервиса
       * @param {Object.<String, *>|Array} [args] Аргументы сервиса
       * @param {WS.Data/Source/Provider/IRpc} [provider] Провайдер, через который вызвать
       * @return {Core/Deferred} Асинхронный результат операции
       * @protected
       */
      _makeCall: function(name, args, provider) {
         provider = provider || this.getProvider();

         var eventResult = this._notify('onBeforeProviderCall', name, args),
            result;
         if (eventResult !== undefined) {
            args = eventResult;
         }

         result = provider.call(
            name,
            this._prepareArgumentsForCall(args)
         );

         if (this._$options.debug) {
            result.addErrback((function (error) {
               if (error instanceof DeferredCanceledError) {
                  Utils.logger.info(this._moduleName, 'calling of remote service "' + name + '" has been cancelled.');
               } else {
                  Utils.logger.error(this._moduleName, 'remote service "' + name + '" throws an error "' + error.message + '".');
               }
               return error;
            }).bind(this));
         }

         return result;
      },

      /**
       * Подготавливает аргументы к передаче в удаленный сервис
       * @param {Object.<String, *>} [args] Аргументы вызова
       * @return {Object.<String, *>|undefined}
       * @protected
       */
      _prepareArgumentsForCall: function(args) {
         return this.getAdapter().serialize(args);
      },

      _prepareCreateArguments: function(meta) {
         return [meta];
      },

      _prepareReadArguments: function(key, meta) {
         return [key, meta];
      },

      _prepareUpdateArguments: function(model, meta) {
         if (this._$options.updateOnlyChanged) {
            var idProperty = this.getIdProperty(),
               isNull = function(value) {
                  return value === null || value === undefined;
               };
            if (idProperty) {
               if (CoreInstance.instanceOfModule(model, 'WS.Data/Entity/Record')) {
                  if (!isNull(model.get(idProperty))) {
                     var changed = model.getChanged();
                     changed.unshift(idProperty);
                     model = Record.filterFields(model, changed);
                  }
               } else if (CoreInstance.instanceOfModule(model, 'WS.Data/Collection/RecordSet')) {
                  model = model.filter(function(record) {
                     return isNull(record.get(idProperty)) || record.isChanged();
                  });
               }
            }
         }

         return [model, meta];
      },

      _prepareDestroyArguments: function(keys, meta) {
         return [keys, meta];
      },

      _prepareMergeArguments: function(from, to) {
         return [from, to];
      },

      _prepareCopyArguments: function(key, meta) {
         return [key, meta];
      },

      _prepareQueryArguments: function(query) {
         return [query];
      },

      _prepareMoveArguments: function(from, to, meta) {
         return [from, to, meta];
      },

      _getProvider: function(provider, options) {
         if (!provider) {
            throw new Error('Remote access provider is not defined');
         }
         if (typeof provider === 'string') {
            provider = Di.create(provider, options);
         }

         return provider;
      }

      //endregion Protected methods
   });

   Remote.prototype.NAVIGATION_TYPE = Remote.NAVIGATION_TYPE = NAVIGATION_TYPE;

   return Remote;
});
