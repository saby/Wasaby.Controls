/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.DateField', [
   'js!SBIS3.CONTROLS.Data.Format.DateTimeField'
], function (DateTimeField) {
   'use strict';

   /**
    * Формат поля для даты
    * @class SBIS3.CONTROLS.Data.Format.DateField
    * @extends SBIS3.CONTROLS.Data.Format.DateTimeField
    * @public
    * @author Мальцев Алексей
    */

   var DateField = DateTimeField.extend(/** @lends SBIS3.CONTROLS.Data.Format.DateField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.DateField'

      //region Public methods

      //endregion Public methods

   });

   return DateField;
});
