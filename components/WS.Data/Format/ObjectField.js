/* global define */
define('js!WS.Data/Format/ObjectField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат поля для JSON-объекта.
    *
    * Создадим поле c типом "JSON-объект":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'object'
    *    };
    * </pre>
    * @class WS.Data/Format/ObjectField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var ObjectField = Field.extend(/** @lends WS.Data/Format/ObjectField.prototype */{
      _moduleName: 'WS.Data/Format/ObjectField'

      //region Public methods

      //endregion Public methods

   });

   return ObjectField;
});
