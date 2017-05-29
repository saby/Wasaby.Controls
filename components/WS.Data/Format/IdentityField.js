/* global define */
define('js!WS.Data/Format/IdentityField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат поля для идентификатора.
    *
    * Создадим поле c типом "Идентификатор":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'identity'
    *    };
    * </pre>
    * @class WS.Data/Format/IdentityField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var IdentityField = Field.extend(/** @lends WS.Data/Format/IdentityField.prototype */{
      _moduleName: 'WS.Data/Format/IdentityField',

      /**
       * @cfg {Number} Значение поля по умолчанию
       * @name WS.Data/Format/IdentityField#defaultValue
       * @see getDefaultValue
       * @see setDefaultValue
       */
      _$defaultValue: [null],

      //region Public methods

      /**
       * Возвращает разделитель
       * @return {String}
       */
      getSeparator: function () {
         return ',';
      }

      //endregion Public methods

   });

   return IdentityField;
});
