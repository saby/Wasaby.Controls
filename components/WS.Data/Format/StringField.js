/* global define */
define('js!WS.Data/Format/StringField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат поля для строк.
    *
    * Создадим поле c типом "Строка":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'string'
    *    };
    * </pre>
    * @class WS.Data/Format/StringField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var StringField = Field.extend(/** @lends WS.Data/Format/StringField.prototype */{
      _moduleName: 'WS.Data/Format/StringField'

      //region Public methods

      //endregion Public methods

   });

   return StringField;
});
