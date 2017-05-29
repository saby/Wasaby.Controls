/* global define */
define('js!WS.Data/Source/Local', [
   'js!WS.Data/Source/Base',
   'js!WS.Data/Utils'
], function (
   Base,
   Utils
) {
   'use strict';

   /**
    * Источник данных, работающий локально.
    * Это абстрактный класс, не предназначенный для создания самостоятельных экземпляров.
    * @class WS.Data/Source/Local
    * @extends WS.Data/Source/Base
    * @public
    * @author Мальцев Алексей
    */

   var Local = Base.extend(/** @lends WS.Data/Source/Local.prototype */{
      _moduleName: 'WS.Data/Source/Local',

      //region Public methods
      //endregion Public methods

      //region Protected methods

      _prepareCreateResult: function(data) {
         return Local.superclass._prepareCreateResult.call(
            this,
            Utils.clone(data)
         );
      },

      _prepareReadResult: function(data) {
         return Local.superclass._prepareReadResult.call(
            this,
            Utils.clone(data)
         );
      },

      _prepareCallResult: function(data) {
         return Local.superclass._prepareCallResult.call(
            this,
            Utils.clone(data)
         );
      }

      //endregion Protected methods
   });

   return Local;
});
