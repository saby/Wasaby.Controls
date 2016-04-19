/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.ObjectField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат поля для JSON-объекта
    * @class SBIS3.CONTROLS.Data.Format.ObjectField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var ObjectField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.ObjectField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.ObjectField'

      //region Public methods

      //endregion Public methods

   });

   return ObjectField;
});
