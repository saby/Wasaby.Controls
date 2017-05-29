/* global define */
define('js!WS.Data/Format/BooleanField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат логического поля.
    *
    * Создадим поле логического типа:
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'boolean'
    *    };
    * </pre>
    * @class WS.Data/Format/BooleanField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var BooleanField = Field.extend(/** @lends WS.Data/Format/BooleanField.prototype */{
      _moduleName: 'WS.Data/Format/BooleanField'

      //region Public methods

      //endregion Public methods

   });

   return BooleanField;
});
