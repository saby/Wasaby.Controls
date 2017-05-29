/* global define */
define('js!WS.Data/Format/UuidField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат поля UUID.
    *
    * Создадим поле c типом "UUID":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'uuid'
    *    };
    * </pre>
    * @class WS.Data/Format/UuidField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var UuidField = Field.extend(/** @lends WS.Data/Format/UuidField.prototype */{
      _moduleName: 'WS.Data/Format/UuidField'

      //region Public methods

      //endregion Public methods

   });

   return UuidField;
});
