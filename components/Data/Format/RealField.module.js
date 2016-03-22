/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.RealField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат вещественного поля
    * @class SBIS3.CONTROLS.Data.Format.RealField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var RealField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.RealField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.RealField',
      $protected: {
         _options: {
            /**
             * @cfg {Number} Значение поля по умолчанию
             * @see getDefaultValue
             * @see setDefaultValue
             */
            defaultValue: 0,

            /**
             * @cfg {Number} Максимальное количество знаков в дробной части
             * @see getPrecision
             * @see setPrecision
             */
            precision: 16
         }
      },

      //region Public methods

      /**
       * Возвращает максимальное количество знаков в дробной части
       * @returns {*}
       * @see precision
       * @see setPrecision
       */
      getPrecision: function () {
         return this._options.precision;
      },

      /**
       * Устанавливает максимальное количество знаков в дробной части
       * @param {*} value
       * @see precision
       * @see getPrecision
       */
      setPrecision: function (value) {
         this._options.precision = value;
      }

      //endregion Public methods

   });

   return RealField;
});
