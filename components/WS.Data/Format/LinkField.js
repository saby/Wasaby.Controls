/* global define */
define('js!WS.Data/Format/LinkField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат поля "Связь".
    *
    * Создадим поле c типом "Связь":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'link'
    *    };
    * </pre>
    * @class WS.Data/Format/LinkField
    * @extends WS.Data/Format/Field
    * @deprecated Модуль будет удален в 3.7.5
    * @author Мальцев Алексей
    */

   var LinkField = Field.extend(/** @lends WS.Data/Format/LinkField.prototype */{
      _moduleName: 'WS.Data/Format/LinkField',

      /**
       * @cfg {Number} Значение поля по умолчанию
       * @name WS.Data/Format/LinkField#defaultValue
       * @see getDefaultValue
       * @see setDefaultValue
       */
      _$defaultValue: 0

      //region Public methods

      //endregion Public methods

   });

   return LinkField;
});
