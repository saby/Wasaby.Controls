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
      _moduleName: 'SBIS3.CONTROLS.Data.Format.TimeField'

      //region Public methods

      //endregion Public methods

   });

   return TimeField;
});
