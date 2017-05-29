/* global define */
define('js!WS.Data/Format/BinaryField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат двоичного поля.
    *
    * Создадим поле двоичного типа:
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'binary'
    *    };
    * </pre>
    * @class WS.Data/Format/BinaryField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var BinaryField = Field.extend(/** @lends WS.Data/Format/BinaryField.prototype */{
      _moduleName: 'WS.Data/Format/BinaryField'

      //region Public methods

      //endregion Public methods

   });

   return BinaryField;
});
