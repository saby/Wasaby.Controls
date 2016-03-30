/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.StringField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат поля для строк
    * @class SBIS3.CONTROLS.Data.Format.StringField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var StringField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.StringField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.StringField'

      //region Public methods

      //endregion Public methods

   });

   return StringField;
});
