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
      _moduleName: 'SBIS3.CONTROLS.Data.Source.Rpc',
      $protected: {
         _options: {
            /**
             * @cfg {String|SBIS3.CONTROLS.Data.Source.Provider.IRpc} Объект, реализующий сетевой протокол для обмена в режиме клиент-сервер
             * @name {SBIS3.CONTROLS.Data.Source.Rpc#provider}
             * @see getProvider
             * @see SBIS3.CONTROLS.Data.Di
             * @example
             * <pre>
             *    var dataSource = new RpcSource({
             *       resource: '/users/'
             *       provider: 'source.provider.rpc-json'
             *    });
             * </pre>
             */

            /**
             * @cfg {String} Имя метода, который используется для получения выборки.
             * @see getQueryMethodName
             * @see setQueryMethodName
             * @see query
             * @example
             * <pre>
             *    var usersSource = new RpcSource({
             *       resource: '/api/'
             *       queryMethodName: 'getUsers'
             *    });
             * </pre>
             */
            queryMethodName: 'query',

            /**
             * @cfg {String} Имя метода, который используется для создания записи.
             * @see getCreateMethodName
             * @see setCreateMethodName
             * @see create
             * @example
             * <pre>
             *    var usersSource = new RpcSource({
             *       resource: '/api/'
             *       createMethodName: 'createUser'
             *    });
             * </pre>
             */
            createMethodName: 'create',

            /**
             * @cfg {String} Имя метода, который используется для чтения записи.
             * @see getReadMethodName
             * @see setReadMethodName
             * @see read
             * @example
             * <pre>
             *    var usersSource = new RpcSource({
             *       resource: '/api/'
             *       createMethodName: 'readUser'
             *    });
             * </pre>
             */
            readMethodName: 'read',

            /**
             * @cfg {String} Имя метода, который используется для обновления записи.
             * @see getUpdateMethodName
             * @see setUpdateMethodName
             * @see update
             * @example
             * <pre>
             *    var usersSource = new RpcSource({
             *       resource: '/api/'
             *       createMethodName: 'updateUser'
             *    });
             * </pre>
             */
            updateMethodName: 'update',

            /**
             * @cfg {String} Имя метода, который используется для удаления записи.
             * @see getDestroyMethodName
             * @see setDestroyMethodName
             * @see destroy
             * @example
             * <pre>
             *    var usersSource = new RpcSource({
             *       resource: '/api/'
             *       createMethodName: 'deleteUser'
             *    });
             * </pre>
             */
            destroyMethodName: 'delete',

            /**
             * @cfg {String} Имя метода, который будет вызываться для копирования записей.
             * @see getCopyMethodName
             * @see setCopyMethodName
             * @see copy
             * @example
             * <pre>
             *    var usersSource = new RpcSource({
             *       resource: '/api/'
             *       createMethodName: 'copyUser'
             *    });
             * </pre>
             */
            copyMethodName: 'copy',

            /**
             * @cfg {String} Имя метода, который будет вызываться для объединения записей.
             * @see getMergeMethodName
             * @see setMergeMethodName
             * @see merge
             * @example
             * <pre>
             *    var usersSource = new RpcSource({
             *       resource: '/api/'
             *       createMethodName: 'mergeUsers'
             *    });
             * </pre>
             */
            mergeMethodName: 'merge'
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
       * @see setQueryMethodName
       * @see queryMethodName
       */
      getQueryMethodName: function () {
         return this._options.queryMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для получения выборки
       * @param {String} method
       * @see getQueryMethodName
       * @see queryMethodName
       */
      setQueryMethodName: function (method) {
         this._options.queryMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для создания записи
       * @returns {String}
       * @see setCreateMethodName
       * @see createMethodName
       */
      getCreateMethodName: function () {
         return this._options.createMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для создания записи
       * @param {String} method
       * @see getCreateMethodName
       * @see createMethodName
       */
      setCreateMethodName: function (method) {
         this._options.createMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для получения записи
       * @returns {String}
       * @see setReadMethodName
       * @see readMethodName
       */
      getReadMethodName: function () {
         return this._options.readMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для получения записи
       * @param {String} method
       * @see getReadMethodName
       * @see readMethodName
       */
      setReadMethodName: function (method) {
         this._options.readMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для обновления записи
       * @returns {String}
       * @see setUpdateMethodName
       * @see updateMethodName
       */
      getUpdateMethodName: function () {
         return this._options.updateMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для обновления записи
       * @param {String} method
       * @see getUpdateMethodName
       * @see updateMethodName
       */
      setUpdateMethodName: function (method) {
         this._options.updateMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для удаления записи
       * @returns {String}
       * @see setDestroyMethodName
       * @see destroyMethodName
       */
      getDestroyMethodName: function () {
         return this._options.destroyMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для удаления записи
       * @param {String} method
       * @see getDestroyMethodName
       * @see destroyMethodName
       */
      setDestroyMethodName: function (method) {
         this._options.destroyMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для копирования записи
       * @returns {String}
       * @see setCopyMethodName
       * @see copyMethodName
       */
      getCopyMethodName: function () {
         return this._options.copyMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для копирования записи
       * @param {String} method
       * @see getCopyMethodName
       * @see copyMethodName
       */
      setCopyMethodName: function (method) {
         this._options.copyMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для объединения записей
       * @returns {String}
       * @see setMergeMethodName
       * @see mergeMethodName
       */
      getMergeMethodName: function () {
         return this._options.mergeMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для объединения записей
       * @param {String} method
       * @see getMergeMethodName
       * @see mergeMethodName
       */
      setMergeMethodName: function (method) {
         this._options.mergeMethodName = method;
      }

      //endregion Public methods

      //region Protected methods
      //endregion Protected methods
   });

   return Rpc;
});
