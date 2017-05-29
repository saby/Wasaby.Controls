/* global define */
define('js!WS.Data/Format/MoneyField', [
   'js!WS.Data/Format/RealField'
], function (
   RealField
) {
   'use strict';

   /**
    * Формат денежного поля.
    *
    * Создадим поле c типом "Деньги":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'money'
    *    };
    * </pre>
    * @class WS.Data/Format/MoneyField
    * @extends WS.Data/Format/RealField
    * @public
    * @author Мальцев Алексей
    */

   var MoneyField = RealField.extend(/** @lends WS.Data/Format/MoneyField.prototype */{
      _moduleName: 'WS.Data/Format/MoneyField',

      _$precision: 2

      //region Public methods

      //endregion Public methods

   });

   return MoneyField;
});
