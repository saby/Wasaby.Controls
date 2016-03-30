/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.TextField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат поля для строк
    * @class SBIS3.CONTROLS.Data.Format.TextField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var TextField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.TextField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.TextField'

      //region Public methods

      //endregion Public methods

   });

   return TextField;
});
