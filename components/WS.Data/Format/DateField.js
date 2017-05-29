/* global define */
define('js!WS.Data/Format/DateField', [
   'js!WS.Data/Format/DateTimeField'
], function (
   DateTimeField
) {
   'use strict';

   /**
    * Формат поля для даты.
    *
    * Создадим поле c типом "Дата":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'date'
    *    };
    * </pre>
    * @class WS.Data/Format/DateField
    * @extends WS.Data/Format/DateTimeField
    * @public
    * @author Мальцев Алексей
    */

   var DateField = DateTimeField.extend(/** @lends WS.Data/Format/DateField.prototype */{
      _moduleName: 'WS.Data/Format/DateField',

      //region Public methods

      getDefaultValue: function () {
         if (this._$defaultValue instanceof Date) {
            return this._$defaultValue.toSQL();
         }
         return this._$defaultValue;
      }

      //endregion Public methods

   });

   return DateField;
});
