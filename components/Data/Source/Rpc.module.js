/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Rpc', [
   'js!SBIS3.CONTROLS.Data.Source.Remote'
], function (Remote) {
   'use strict';

   /**
    * Источник данных, работающий по технологии RPC
    * @class SBIS3.CONTROLS.Data.Source.Rpc
    * @extends SBIS3.CONTROLS.Data.Source.Remote
    * @public
    * @author Мальцев Алексей
    */

   var Rpc = Remote.extend(/** @lends SBIS3.CONTROLS.Data.Source.Rpc.prototype */{
      /**
       * @event onBeforeProviderCall Перед вызовом метода через провайдер
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} method Имя метода
       * @param {Object.<String, *>} [args] Аргументы метода (передаются по ссылке, можно модифицировать)
       * @example
       * <pre>
       *    dataSource.subscribe('onBeforeProviderCall', function(eventObject, method, args){
       *       switch (method){
       *          case 'query':
       *             //Select only records with enabled == true
       *             args.filter = args.filter || {};
       *             args.filter.enabled = true;
       *             break;
       *       }
       *    });
       * </pre>
       */

      _moduleName: 'SBIS3.CONTROLS.Data.Source.Rpc',
      $protected: {
         _options: {
            binding: {
               create: 'create',
               read: 'read',
               update: 'update',
               destroy: 'delete',
               query: 'query',
               copy: 'copy',
               merge: 'merge'
            },

            /**
             * @cfg {String|SBIS3.CONTROLS.Data.Source.Provider.IRpc} Объект, реализующий сетевой протокол для обмена в режиме клиент-сервер
             * @see getProvider
             * @see SBIS3.CONTROLS.Data.Di
             * @example
             * <pre>
             *    var dataSource = new RpcSource({
             *       endpoint: 'Users',
             *       provider: 'source.provider.json-rpc'
             *    });
             * </pre>
             * @example
             * <pre>
             *    var dataSource = new RpcSource({
             *       endpoint: 'Users'
             *       provider: new JsonRpcProvider()
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
         if (!('binding' in cfg)) {
            if ('createMethodName' in cfg) {
               $ws.single.ioc.resolve('ILogger').info(this._moduleName + '::$constructor()', 'Option "createMethodName" is deprecated and will be removed in 3.7.4. Use "binding.create" instead.');
               this._options.binding.create = cfg.createMethodName;
            }
            if ('readMethodName' in cfg) {
               $ws.single.ioc.resolve('ILogger').info(this._moduleName + '::$constructor()', 'Option "readMethodName" is deprecated and will be removed in 3.7.4. Use "binding.read" instead.');
               this._options.binding.read = cfg.readMethodName;
            }
            if ('updateMethodName' in cfg) {
               $ws.single.ioc.resolve('ILogger').info(this._moduleName + '::$constructor()', 'Option "updateMethodName" is deprecated and will be removed in 3.7.4. Use "binding.update" instead.');
               this._options.binding.update = cfg.updateMethodName;
            }
            if ('destroyMethodName' in cfg) {
               $ws.single.ioc.resolve('ILogger').info(this._moduleName + '::$constructor()', 'Option "destroyMethodName" is deprecated and will be removed in 3.7.4. Use "binding.destroy" instead.');
               this._options.binding.destroy = cfg.destroyMethodName;
            }
            if ('queryMethodName' in cfg) {
               $ws.single.ioc.resolve('ILogger').info(this._moduleName + '::$constructor()', 'Option "queryMethodName" is deprecated and will be removed in 3.7.4. Use "binding.query" instead.');
               this._options.binding.query = cfg.queryMethodName;
            }
            if ('copyMethodName' in cfg) {
               $ws.single.ioc.resolve('ILogger').info(this._moduleName + '::$constructor()', 'Option "copyMethodName" is deprecated and will be removed in 3.7.4. Use "binding.copy" instead.');
               this._options.binding.copy = cfg.copyMethodName;
            }
            if ('mergeMethodName' in cfg) {
               $ws.single.ioc.resolve('ILogger').info(this._moduleName + '::$constructor()', 'Option "mergeMethodName" is deprecated and will be removed in 3.7.4. Use "binding.merge" instead.');
               this._options.binding.merge = cfg.mergeMethodName;
            }
         }
      },

      //region SBIS3.CONTROLS.Data.Source.ISource

      create: function(meta) {
         return this._callMethod(
            this._options.binding.create,
            this._prepareCreateArguments(meta)
         ).addCallback((function (data) {
            return this._prepareCreateResult(data);
         }).bind(this));
      },

      read: function(key, meta) {
         return this._callMethod(
            this._options.binding.read,
            this._prepareReadArguments(key, meta)
         ).addCallback((function (data) {
            return this._prepareReadResult(data);
         }).bind(this));
      },

      update: function(model, meta) {
         return this._callMethod(
            this._options.binding.update,
            this._prepareUpdateArguments(model, meta)
         ).addCallback((function (key) {
            return this._prepareUpdateResult(model, key);
         }).bind(this));
      },

      destroy: function(keys, meta) {
         return this._callMethod(
            this._options.binding.destroy,
            this._prepareDestroyArguments(keys, meta)
         );
      },

      merge: function(from, to) {
         return this._callMethod(
            this._options.binding.merge,
            this._prepareMergeArguments(from, to)
         );
      },

      copy: function(key, meta) {
         return this._callMethod(
            this._options.binding.copy,
            this._prepareCopyArguments(key, meta)
         );
      },

      query: function(query) {
         return this._callMethod(
            this._options.binding.query,
            this._prepareQueryArguments(query)
         ).addCallback((function (data) {
            return this._prepareQueryResult(data, 'total');
         }).bind(this));
      },

      call: function (command, data) {
         return this._callMethod(
            command,
            data
         ).addCallback((function (data) {
            return this._prepareCallResult(data, 'n');
         }).bind(this));
      },

      //endregion SBIS3.CONTROLS.Data.Source.ISource

      //region SBIS3.CONTROLS.Data.Source.Remote

      /**
       * Возвращает объект, реализующий сетевой протокол для обмена в режиме клиент-сервер
       * @returns {SBIS3.CONTROLS.Data.Source.Provider.IRpc}
       * @see provider
       */
      getProvider: function () {
         var provider = Rpc.superclass.getProvider.call(this);

         if (!provider || !$ws.helpers.instanceOfMixin(provider, 'SBIS3.CONTROLS.Data.Source.Provider.IRpc')) {
            throw new Error('Provider should implement SBIS3.CONTROLS.Data.Source.Provider.IRpc');
         }

         return provider;
      },

      //endregion SBIS3.CONTROLS.Data.Source.Remote

      //region Public methods

      /**
       * Возвращает имя метода, который используется для получения выборки
       * @returns {String}
       * @deprecated Метод будет удален в 3.7.4, используйте getBinding().query
       */
      getQueryMethodName: function () {
         return this._options.binding.query;
      },

      /**
       * Устанавливает имя метода, который используется для получения выборки
       * @param {String} method
       * @deprecated Метод будет удален в 3.7.4, используйте getBinding()/setBinding()
       */
      setQueryMethodName: function (method) {
         this._options.binding.query = method;
      },

      /**
       * Возвращает имя метода, который используется для создания записи
       * @returns {String}
       * @deprecated Метод будет удален в 3.7.4, используйте getBinding().create
       */
      getCreateMethodName: function () {
         return this._options.binding.create;
      },

      /**
       * Устанавливает имя метода, который используется для создания записи
       * @param {String} method
       * @deprecated Метод будет удален в 3.7.4, используйте getBinding()/setBinding()
       */
      setCreateMethodName: function (method) {
         this._options.binding.create = method;
      },

      /**
       * Возвращает имя метода, который используется для получения записи
       * @returns {String}
       * @deprecated Метод будет удален в 3.7.4, используйте getBinding().read
       */
      getReadMethodName: function () {
         return this._options.binding.read;
      },

      /**
       * Устанавливает имя метода, который используется для получения записи
       * @param {String} method
       * @deprecated Метод будет удален в 3.7.4, используйте getBinding()/setBinding()
       */
      setReadMethodName: function (method) {
         this._options.binding.read = method;
      },

      /**
       * Возвращает имя метода, который используется для обновления записи
       * @returns {String}
       * @deprecated Метод будет удален в 3.7.4, используйте getBinding().update
       */
      getUpdateMethodName: function () {
         return this._options.binding.update;
      },

      /**
       * Устанавливает имя метода, который используется для обновления записи
       * @param {String} method
       * @deprecated Метод будет удален в 3.7.4, используйте getBinding()/setBinding()
       */
      setUpdateMethodName: function (method) {
         this._options.binding.update = method;
      },

      /**
       * Возвращает имя метода, который используется для удаления записи
       * @returns {String}
       * @deprecated Метод будет удален в 3.7.4, используйте getBinding().destroy
       */
      getDestroyMethodName: function () {
         return this._options.binding.destroy;
      },

      /**
       * Устанавливает имя метода, который используется для удаления записи
       * @param {String} method
       * @deprecated Метод будет удален в 3.7.4, используйте getBinding()/setBinding()
       */
      setDestroyMethodName: function (method) {
         this._options.binding.destroy = method;
      },

      /**
       * Возвращает имя метода, который используется для копирования записи
       * @returns {String}
       * @deprecated Метод будет удален в 3.7.4, используйте getBinding().copy
       */
      getCopyMethodName: function () {
         return this._options.binding.copy;
      },

      /**
       * Устанавливает имя метода, который используется для копирования записи
       * @param {String} method
       * @deprecated Метод будет удален в 3.7.4, используйте getBinding()/setBinding()
       */
      setCopyMethodName: function (method) {
         this._options.binding.copy = method;
      },

      /**
       * Возвращает имя метода, который используется для объединения записей
       * @returns {String}
       * @deprecated Метод будет удален в 3.7.4, используйте getBinding().merge
       */
      getMergeMethodName: function () {
         return this._options.binding.merge;
      },

      /**
       * Устанавливает имя метода, который используется для объединения записей
       * @param {String} method
       * @deprecated Метод будет удален в 3.7.4, используйте getBinding()/setBinding()
       */
      setMergeMethodName: function (method) {
         this._options.binding.merge = method;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Вызывает удаленный метод через провайдер
       * @param {String} method Имя метода
       * @param {Object.<String, *>} [args] Аргументы метода
       * @param {SBIS3.CONTROLS.Data.Source.Provider.IRpc} [provider] Провайдер, через который вызвать
       * @returns {$ws.proto.Deferred} Асинхронный результат операции
       * @protected
       */
      _callMethod: function(method, args, provider) {
         provider = provider || this.getProvider();

         this._notify('onBeforeProviderCall', method, args);

         return provider.call(
            method,
            this._prepareMethodArguments(args)
         ).addErrback((function (error) {
            $ws.single.ioc.resolve('ILogger').log(this._moduleName, 'remote method "' + method + '" throws an error "' + error.message + '"');
            return error;
         }).bind(this));
      }

      //endregion Protected methods
   });

   return Rpc;
});
