/* global define */
define('js!WS.Data/Format/IntegerField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат целочисленного поля.
    *
    * Создадим поле челочисленного типа:
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'integer'
    *    };
    * </pre>
    * @class WS.Data/Format/IntegerField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var IntegerField = Field.extend(/** @lends WS.Data/Format/IntegerField.prototype */{
      _moduleName: 'WS.Data/Format/IntegerField',

      /**
       * @cfg {Number} Значение поля по умолчанию
       * @name WS.Data/Format/IntegerField#defaultValue
       * @see getDefaultValue
       * @see setDefaultValue
       */
      _$defaultValue: 0

      //region Public methods

      //endregion Public methods

   });

   return IntegerField;
});
