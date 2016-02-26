/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.EnumField', [
   'js!SBIS3.CONTROLS.Data.Format.DictionaryField'
], function (DictionaryField) {
   'use strict';

   /**
    * Формат перечисляемого поля
    * @class SBIS3.CONTROLS.Data.Format.EnumField
    * @extends SBIS3.CONTROLS.Data.Format.DictionaryField
    * @public
    * @author Мальцев Алексей
    */

   var EnumField = DictionaryField.extend(/** @lends SBIS3.CONTROLS.Data.Format.EnumField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.EnumField'

      //region Public methods

      //endregion Public methods

   });

   return EnumField;
});
