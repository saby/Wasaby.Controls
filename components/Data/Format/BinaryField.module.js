/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.BinaryField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат двоичного поля
    * @class SBIS3.CONTROLS.Data.Format.BinaryField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var BinaryField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.BinaryField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.BinaryField'

      //region Public methods

      //endregion Public methods

   });

   return BinaryField;
});
