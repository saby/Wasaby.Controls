/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.UuidField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат поля UUID
    * @class SBIS3.CONTROLS.Data.Format.UuidField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var UuidField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.UuidField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.UuidField'

      //region Public methods

      //endregion Public methods

   });

   return UuidField;
});
