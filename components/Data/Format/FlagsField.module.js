/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.FlagsField', [
   'js!SBIS3.CONTROLS.Data.Format.DictionaryField'
], function (DictionaryField) {
   'use strict';

   /**
    * Формат поля флагов
    * @class SBIS3.CONTROLS.Data.Format.FlagsField
    * @extends SBIS3.CONTROLS.Data.Format.DictionaryField
    * @public
    * @author Мальцев Алексей
    */

   var FlagsField = DictionaryField.extend(/** @lends SBIS3.CONTROLS.Data.Format.FlagsField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.FlagsField'

      //region Public methods

      //endregion Public methods

   });

   return FlagsField;
});
