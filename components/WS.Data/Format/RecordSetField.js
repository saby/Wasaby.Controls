/* global define */
define('js!WS.Data/Format/RecordSetField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат поля для рекордсета.
    *
    * Создадим поле c типом "Рекордсет":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'recordset'
    *    };
    * </pre>
    * @class WS.Data/Format/RecordSetField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var RecordSetField = Field.extend(/** @lends WS.Data/Format/RecordSetField.prototype */{
      _moduleName: 'WS.Data/Format/RecordSetField'

      //region Public methods
      //endregion Public methods
   });

   return RecordSetField;
});
