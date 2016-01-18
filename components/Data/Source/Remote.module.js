/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Remote', [
   'js!SBIS3.CONTROLS.Data.Source.Base'
], function (Base) {
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
             * @cfg {Object} Объект, реализующий сетевой протокол для обмена в режиме клиент-сервер
             * @see getProvider
             */
            provider: null
         }
      },

      //region Public methods

      init: function() {
         Remote.superclass.init.call(this);
         if (!this._options.provider) {
            throw new Error('Remote access provider is not defined');
         }
      },

      /**
       * Возвращает объект, реализующий сетевой протокол для обмена в режиме клиент-сервер
       * @returns {Object}
       * @see provider
       */
      getProvider: function () {
         return this._options.provider;
      }

      //endregion Public methods

      //region Protected methods
      //endregion Protected methods
   });

   return Remote;
});
