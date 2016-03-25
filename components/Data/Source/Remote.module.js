/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Remote', [
   'js!SBIS3.CONTROLS.Data.Source.Base',
   'js!SBIS3.CONTROLS.Data.Di'
], function (Base, Di) {
   'use strict';

   /**
    * Источник данных, работающий удаленно
    * @class SBIS3.CONTROLS.Data.Source.Remote
    * @extends SBIS3.CONTROLS.Data.Source.Base
    * @public
    * @author Мальцев Алексей
    */

   var Remote = Base.extend(/** @lends SBIS3.CONTROLS.Data.Source.Remote.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Source.Remote',

      $protected: {
         _options: {
            /**
             * @cfg {String|Object} Объект, реализующий сетевой протокол для обмена в режиме клиент-сервер
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
         cfg = cfg || {};
         //Deprecated
         if ('service' in cfg && 'resource' in cfg && !('endpoint' in cfg)) {
            $ws.single.ioc.resolve('ILogger').info(this._moduleName + '::$constructor()', 'Option "service" is deprecated and will be removed in 3.7.4. Use "endpoint.address" instead.');
            this._options.endpoint.address = cfg.service;
         }
      },

      //region Public methods

      /**
       * Возвращает адрес удаленного сервиса, с которым работает источник (хост, путь, название)
       * @returns {String}
       * @deprecated Метод будет удален в 3.7.4, используйте getEndpoint().address
       */
      getService: function () {
         $ws.single.ioc.resolve('ILogger').info(this._moduleName + '::getService()', 'Method is deprecated and will be removed in 3.7.4. Use "getEndpoint().address" instead.');
         return this._options.endpoint.address || '';
      },

      /**
       * Возвращает объект, реализующий сетевой протокол для обмена в режиме клиент-сервер
       * @returns {Object}
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
      },

      /**
       * Подготавливает аргументы к передаче в удаленный сервис
       * @param {Object.<String, *>} [args] Аргументы вызова
       * @returns {Object.<String, *>|undefined}
       * @protected
       */
      _prepareMethodArguments: function(args) {
         return this.getAdapter().serialize(args);
      }

      //endregion Protected methods
   });

   return Remote;
});
