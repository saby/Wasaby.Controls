/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.TimeIntervalField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат поля временной интервал
    * @class SBIS3.CONTROLS.Data.Format.TimeIntervalField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var TimeIntervalField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.TimeIntervalField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.TimeIntervalField',
      $protected: {
         _options: {
            /**
             * @cfg {Number} Значение поля по умолчанию
             * @see getDefaultValue
             * @see setDefaultValue
             */
            defaultValue: 0
         }
      }

      //region Public methods

      //endregion Public methods

   });

   return TimeIntervalField;
});
