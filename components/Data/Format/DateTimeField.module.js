/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.DateTimeField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат поля для даты и времени
    * @class SBIS3.CONTROLS.Data.Format.DateTimeField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var DateTimeField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.DateTimeField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.DateTimeField',

      //region Public methods

      getDefaultValue: function () {
         if (this._$defaultValue instanceof Date) {
            return this._$defaultValue.toSQL(true);
         }
         return this._$defaultValue;
      }

      //endregion Public methods

   });

   return DateTimeField;
});
