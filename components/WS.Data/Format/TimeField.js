/* global define */
define('js!WS.Data/Format/TimeField', [
   'js!WS.Data/Format/DateTimeField'
], function (
   DateTimeField
) {
   'use strict';

   /**
    * Формат поля для времени.
    *
    * Создадим поле c типом "Время":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'time'
    *    };
    * </pre>
    * @class WS.Data/Format/TimeField
    * @extends WS.Data/Format/DateTimeField
    * @public
    * @author Мальцев Алексей
    */

   var TimeField = DateTimeField.extend(/** @lends WS.Data/Format/TimeField.prototype */{
      _moduleName: 'WS.Data/Format/TimeField',

      //region Public methods

      getDefaultValue: function () {
         if (this._$defaultValue instanceof Date) {
            return this._$defaultValue.toSQL(false);
         }
         return this._$defaultValue;
      }

      //endregion Public methods

   });

   return TimeField;
});
