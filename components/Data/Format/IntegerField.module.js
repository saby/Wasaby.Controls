/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.IntegerField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат целочисленного поля
    * @class SBIS3.CONTROLS.Data.Format.IntegerField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var IntegerField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.IntegerField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.IntegerField',

      /**
       * @cfg {Number} Значение поля по умолчанию
       * @name SBIS3.CONTROLS.Data.Format.IntegerField#defaultValue
       * @see getDefaultValue
       * @see setDefaultValue
       */
      _$defaultValue: 0

      //region Public methods

      //endregion Public methods

   });

   return IntegerField;
});
