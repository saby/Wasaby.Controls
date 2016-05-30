/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.MoneyField', [
   'js!SBIS3.CONTROLS.Data.Format.RealField'
], function (RealField) {
   'use strict';

   /**
    * Формат вещественного поля
    * @class SBIS3.CONTROLS.Data.Format.MoneyField
    * @extends SBIS3.CONTROLS.Data.Format.RealField
    * @public
    * @author Мальцев Алексей
    */

   var MoneyField = RealField.extend(/** @lends SBIS3.CONTROLS.Data.Format.MoneyField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.MoneyField',

      _$precision: 2

      //region Public methods

      //endregion Public methods

   });

   return MoneyField;
});
