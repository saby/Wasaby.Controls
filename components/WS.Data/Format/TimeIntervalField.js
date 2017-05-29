/* global define */
define('js!WS.Data/Format/TimeIntervalField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат поля временной интервал.
    *
    * Создадим поле c типом "Временной интервал":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'timeinterval'
    *    };
    * </pre>
    * @class WS.Data/Format/TimeIntervalField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var TimeIntervalField = Field.extend(/** @lends WS.Data/Format/TimeIntervalField.prototype */{
      _moduleName: 'WS.Data/Format/TimeIntervalField',

      /**
       * @cfg {Number} Значение поля по умолчанию
       * @name WS.Data/Format/TimeIntervalField#defaultValue
       * @see getDefaultValue
       * @see setDefaultValue
       */
      _$defaultValue: 0

      //region Public methods

      //endregion Public methods

   });

   return TimeIntervalField;
});
