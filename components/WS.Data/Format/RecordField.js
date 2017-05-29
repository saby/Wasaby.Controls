/* global define */
define('js!WS.Data/Format/RecordField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат поля для записи.
    *
    * Создадим поле c типом "Запись":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'record'
    *    };
    * </pre>
    * @class WS.Data/Format/RecordField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var RecordField = Field.extend(/** @lends WS.Data/Format/RecordField.prototype */{
      _moduleName: 'WS.Data/Format/RecordField'

      //region Public methods

      //endregion Public methods

   });

   return RecordField;
});
