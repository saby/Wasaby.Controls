/* global define */
define('js!WS.Data/Format/DateTimeField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат поля для даты и времени.
    *
    * Создадим поле c типом "Дата и время":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'dateTime'
    *    };
    * </pre>
    * @class WS.Data/Format/DateTimeField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var DateTimeField = Field.extend(/** @lends WS.Data/Format/DateTimeField.prototype */{
      _moduleName: 'WS.Data/Format/DateTimeField',

      //region Public methods

      getDefaultValue: function () {
         if (this._$defaultValue instanceof Date) {
            return this._$defaultValue.toSQL(true);
         }
         return this._$defaultValue;
      }

      //endregion Public methods

   });

   return DateTimeField;
});
