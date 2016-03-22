/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.BooleanField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат логического поля
    * @class SBIS3.CONTROLS.Data.Format.BooleanField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var BooleanField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.BooleanField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.BooleanField',
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Значение поля по умолчанию
             * @see getDefaultValue
             * @see setDefaultValue
             */
            defaultValue: false
         }
      }

      //region Public methods

      //endregion Public methods

   });

   return BooleanField;
});
