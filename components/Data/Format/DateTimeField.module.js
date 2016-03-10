/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.DateTimeField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат поля для даты и времени
    * @class SBIS3.CONTROLS.Data.Format.DateTimeField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var DateTimeField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.DateTimeField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.DateTimeField',
      $protected: {
         _options: {
            /**
             * @cfg {Date} Значение поля по умолчанию
             * @see getDefaultValue
             * @see setDefaultValue
             */
            defaultValue: null
         }
      }

      //region Public methods

      //endregion Public methods

   });

   return DateTimeField;
});
