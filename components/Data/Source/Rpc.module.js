/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Rpc', [
   'js!SBIS3.CONTROLS.Data.Source.Remote',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (Remote, Utils) {
   'use strict';

   /**
    * Источник данных, работающий по технологии RPC
    * @class SBIS3.CONTROLS.Data.Source.Rpc
    * @extends SBIS3.CONTROLS.Data.Source.Remote
    * @public
    * @author Мальцев Алексей
    */

   var Rpc = Remote.extend(/** @lends SBIS3.CONTROLS.Data.Source.Rpc.prototype */{
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
         cfg = cfg || {};
         //Deprecated
         if (!('binding' in cfg)) {
            if ('createMethodName' in cfg) {
               Utils.logger.stack(this._moduleName + '::$constructor(): option "createMethodName" is deprecated and will be removed in 3.7.4. Use "binding.create" instead.', 2);
               this._options.binding.create = cfg.createMethodName;
            }
            if ('readMethodName' in cfg) {
               Utils.logger.stack(this._moduleName + '::$constructor(): option "readMethodName" is deprecated and will be removed in 3.7.4. Use "binding.read" instead.', 2);
               this._options.binding.read = cfg.readMethodName;
            }
            if ('updateMethodName' in cfg) {
               Utils.logger.stack(this._moduleName + '::$constructor(): option "updateMethodName" is deprecated and will be removed in 3.7.4. Use "binding.update" instead.', 2);
               this._options.binding.update = cfg.updateMethodName;
            }
            if ('destroyMethodName' in cfg) {
               Utils.logger.stack(this._moduleName + '::$constructor(): option "destroyMethodName" is deprecated and will be removed in 3.7.4. Use "binding.destroy" instead.', 2);
               this._options.binding.destroy = cfg.destroyMethodName;
            }
            if ('queryMethodName' in cfg) {
               Utils.logger.stack(this._moduleName + '::$constructor(): option "queryMethodName" is deprecated and will be removed in 3.7.4. Use "binding.query" instead.', 2);
               this._options.binding.query = cfg.queryMethodName;
            }
            if ('copyMethodName' in cfg) {
               Utils.logger.stack(this._moduleName + '::$constructor(): option "copyMethodName" is deprecated and will be removed in 3.7.4. Use "binding.copy" instead.', 2);
               this._options.binding.copy = cfg.copyMethodName;
            }
            if ('mergeMethodName' in cfg) {
               Utils.logger.stack(this._moduleName + '::$constructor(): option "mergeMethodName" is deprecated and will be removed in 3.7.4. Use "binding.merge" instead.', 2);
               this._options.binding.merge = cfg.mergeMethodName;
            }
         }
      },

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
      }

      //endregion Public methods

      //region Protected methods

      //endregion Protected methods
   });

   return Rpc;
});
