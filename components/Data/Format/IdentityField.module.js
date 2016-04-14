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
      $protected: {
         _options: {
            /**
             * @cfg {Number} Значение поля по умолчанию
             * @see getDefaultValue
             * @see setDefaultValue
             */
            defaultValue: [null]
         }
      },

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
