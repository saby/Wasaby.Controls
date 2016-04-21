/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Local', [
   'js!SBIS3.CONTROLS.Data.Source.Base'
], function (Base) {
   'use strict';

   /**
    * Источник данных, работающий локально
    * @class SBIS3.CONTROLS.Data.Source.Local
    * @extends SBIS3.CONTROLS.Data.Source.Base
    * @public
    * @author Мальцев Алексей
    */

   var Local = Base.extend(/** @lends SBIS3.CONTROLS.Data.Source.Local.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Source.Local',

      //region Public methods
      //endregion Public methods

      //region Protected methods

      _prepareCreateResult: function(data) {
         return Local.superclass._prepareCreateResult.call(
            this,
            this._cloneData(data)
         );
      },

      _prepareReadResult: function(data) {
         return Local.superclass._prepareReadResult.call(
            this,
            this._cloneData(data)
         );
      },

      _prepareCallResult: function(data, totalProperty) {
         return Local.superclass._prepareCallResult.call(
            this,
            this._cloneData(data),
            totalProperty
         );
      },

      /**
       * Клонирует сырые данные (чтобы изменения вне источника данных не отображались на самом источнике)
       * @param {Object} data Данные
       * @returns {Object}
       * @protected
       */
      _cloneData: function (data) {
         if (data instanceof Object) {
            if ($ws.helpers.instanceOfMixin(data, 'SBIS3.CONTROLS.Data.ICloneable')) {
               return data.clone();
            } else {
               return JSON.parse(JSON.stringify(data));
            }
         } else {
            return data;
         }
      }

      //endregion Protected methods
   });

   return Local;
});
