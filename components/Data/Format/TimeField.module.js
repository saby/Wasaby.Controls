/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.TimeField', [
   'js!SBIS3.CONTROLS.Data.Format.DateTimeField'
], function (DateTimeField) {
   'use strict';

   /**
    * Формат поля для времени
    * @class SBIS3.CONTROLS.Data.Format.TimeField
    * @extends SBIS3.CONTROLS.Data.Format.DateTimeField
    * @public
    * @author Мальцев Алексей
    */

   var TimeField = DateTimeField.extend(/** @lends SBIS3.CONTROLS.Data.Format.TimeField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.TimeField',

      //region Public methods

      getDefaultValue: function () {
         if (this._$defaultValue instanceof Date) {
            return this._$defaultValue.toSQL(false);
         }
         return this._$defaultValue;
      }

      //endregion Public methods

   });

   return TimeField;
});
