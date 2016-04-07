/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Remote', [
   'js!SBIS3.CONTROLS.Data.Source.Base',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (Base, Di, Utils) {
   'use strict';

   /**
    * Источник данных, работающий удаленно
    * @class SBIS3.CONTROLS.Data.Source.Remote
    * @extends SBIS3.CONTROLS.Data.Source.Base
    * @public
    * @author Мальцев Алексей
    */

   var Remote = Base.extend(/** @lends SBIS3.CONTROLS.Data.Source.Remote.prototype */{
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
       *    dataSource.subscribe('onBeforeProviderCall', function(eventObject, name, args){
       *       args = $ws.core.clone(args);
       *       switch (name){
       *          case 'getUsersList':
       *             //Select only actice users
       *             args.filter = args.filter || {};
       *             args.filter.active = true;
       *             break;
       *       }
       *       eventObject.setResult(args);
       *    });
       * </pre>
       */

      _moduleName: 'SBIS3.CONTROLS.Data.Source.Remote',

      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Source.Provider.IAbstract|String} Объект, реализующий сетевой протокол для обмена в режиме клиент-сервер
             * @see getProvider
             * @see SBIS3.CONTROLS.Data.Di
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
            provider: null
         }
      },

      $constructor: function (cfg) {
         this._publish('onBeforeProviderCall');

         cfg = cfg || {};
         //Deprecated
         if ('service' in cfg && 'resource' in cfg && !('endpoint' in cfg)) {
            Utils.logger.stack(this._moduleName + '::$constructor(): option "service" is deprecated and will be removed in 3.7.4. Use "endpoint.address" instead.', 1);
            this._options.endpoint.address = cfg.service;
         }
      },

      //region SBIS3.CONTROLS.Data.Source.ISource

      create: function(meta) {
         return this._makeCall(
            this._options.binding.create,
            this._prepareCreateArguments(meta)
         ).addCallback((function (data) {
            return this._prepareCreateResult(data);
         }).bind(this));
      },

      read: function(key, meta) {
         return this._makeCall(
            this._options.binding.read,
            this._prepareReadArguments(key, meta)
         ).addCallback((function (data) {
            return this._prepareReadResult(data);
         }).bind(this));
      },

      update: function(model, meta) {
         return this._makeCall(
            this._options.binding.update,
            this._prepareUpdateArguments(model, meta)
         ).addCallback((function (key) {
            return this._prepareUpdateResult(model, key);
         }).bind(this));
      },

      destroy: function(keys, meta) {
         return this._makeCall(
            this._options.binding.destroy,
            this._prepareDestroyArguments(keys, meta)
         );
      },

      merge: function(from, to) {
         return this._makeCall(
            this._options.binding.merge,
            this._prepareMergeArguments(from, to)
         );
      },

      copy: function(key, meta) {
         return this._makeCall(
            this._options.binding.copy,
            this._prepareCopyArguments(key, meta)
         );
      },

      query: function(query) {
         return this._makeCall(
            this._options.binding.query,
            this._prepareQueryArguments(query)
         ).addCallback((function (data) {
            return this._prepareQueryResult(data, 'total');
         }).bind(this));
      },

      call: function (command, data) {
         return this._makeCall(
            command,
            data
         ).addCallback((function (data) {
            return this._prepareCallResult(data, 'n');
         }).bind(this));
      },

      //endregion SBIS3.CONTROLS.Data.Source.ISource

      //region Public methods

      /**
       * Возвращает адрес удаленного сервиса, с которым работает источник (хост, путь, название)
       * @returns {String}
       * @deprecated Метод будет удален в 3.7.4, используйте getEndpoint().address
       */
      getService: function () {
         Utils.logger.stack(this._moduleName + '::getService(): method is deprecated and will be removed in 3.7.4. Use "getEndpoint().address" instead.');
         return this._options.endpoint.address || '';
      },

      /**
       * Возвращает объект, реализующий сетевой протокол для обмена в режиме клиент-сервер
       * @returns {SBIS3.CONTROLS.Data.Source.Provider.IAbstract}
       * @see provider
       */
      getProvider: function () {
         if (!this._options.provider) {
            throw new Error('Remote access provider is not defined');
         }
         if (typeof this._options.provider === 'string') {
            this._options.provider = Di.resolve(this._options.provider, {
               endpoint: this._options.endpoint,
               //TODO: remove pass 'service' and 'resource'
               service: this._options.endpoint.address,
               resource: this._options.endpoint.contract
            });
         }

         return this._options.provider;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Вызывает удаленный сервис через провайдер
       * @param {String} name Имя сервиса
       * @param {Object.<String, *>|Array} [args] Аргументы сервиса
       * @param {SBIS3.CONTROLS.Data.Source.Provider.IRpc} [provider] Провайдер, через который вызвать
       * @returns {$ws.proto.Deferred} Асинхронный результат операции
       * @protected
       */
      _makeCall: function(name, args, provider) {
         provider = provider || this.getProvider();

         var eventResult = this._notify('onBeforeProviderCall', name, args);
         if (eventResult !== undefined) {
            args = eventResult;
         }

         return provider.call(
            name,
            this._prepareArgumentsForCall(args)
         ).addErrback((function (error) {
            $ws.single.ioc.resolve('ILogger').log(this._moduleName, 'remote service "' + name + '" throws an error "' + error.message + '"');
            return error;
         }).bind(this));
      },

      /**
       * Подготавливает аргументы к передаче в удаленный сервис
       * @param {Object.<String, *>} [args] Аргументы вызова
       * @returns {Object.<String, *>|undefined}
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
      }

      //endregion Protected methods
   });

   return Remote;
});
