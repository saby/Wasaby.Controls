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
            Utils.logger.stack(this._moduleName + '::$constructor(): option "service" is deprecated and will be removed in 3.7.4. Use "endpoint.address" instead.', 1);
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
         Utils.logger.stack(this._moduleName + '::getService(): method is deprecated and will be removed in 3.7.4. Use "getEndpoint().address" instead.');
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
      }

      //endregion Public methods

      //region Protected methods
      //endregion Protected methods
   });

   return Remote;
});
