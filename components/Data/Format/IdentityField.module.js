/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.IdentityField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат поля для идентификатора
    * @class SBIS3.CONTROLS.Data.Format.IdentityField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var IdentityField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.IdentityField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.IdentityField',

      /**
       * @cfg {Number} Значение поля по умолчанию
       * @name SBIS3.CONTROLS.Data.Format.IdentityField#defaultValue
       * @see getDefaultValue
       * @see setDefaultValue
       */
      _$defaultValue: [null],

      //region Public methods

      /**
       * Возвращает разделитель
       * @returns {String}
       */
      getSeparator: function () {
         return ',';
      }

      //endregion Public methods

   });

   return IdentityField;
});
