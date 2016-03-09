/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.RecordSetField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат поля для выборки
    * @class SBIS3.CONTROLS.Data.Format.RecordSetField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var RecordSetField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.RecordSetField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.RecordSetField'

      //region Public methods

      //endregion Public methods

   });

   return RecordSetField;
});
