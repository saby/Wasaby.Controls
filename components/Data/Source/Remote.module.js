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
             *       resource: '/users/'
             *       provider: 'source.provider.ajax'
             *    });
             * </pre>
             * @example
             * <pre>
             *    var dataSource = new RemoteSource({
             *       resource: '/users/'
             *       provider: new AjaxProvider()
             *    });
             * </pre>
             */
            provider: null
         }
      },

      //region Public methods

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
            this._options.provider = Di.resolve(this._options.provider, this._options.resource);
         }
         return this._options.provider;
      }

      //endregion Public methods

      //region Protected methods
      //endregion Protected methods
   });

   return Remote;
});
