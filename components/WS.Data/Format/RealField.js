/* global define */
define('js!WS.Data/Format/RealField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат вещественного поля.
    *
    * Создадим поле вещественного типа:
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'real',
    *       precision: 4
    *    };
    * </pre>
    * @class WS.Data/Format/RealField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var RealField = Field.extend(/** @lends WS.Data/Format/RealField.prototype */{
      _moduleName: 'WS.Data/Format/RealField',

      /**
       * @cfg {Number} Значение поля по умолчанию
       * @name WS.Data/Format/RealField#defaultValue
       * @see getDefaultValue
       * @see setDefaultValue
       */
      _$defaultValue: 0,

      /**
       * @cfg {Number} Максимальное количество знаков в дробной части
       * @name WS.Data/Format/RealField#precision
       * @see getPrecision
       * @see setPrecision
       */
      _$precision: 16,

      //region Public methods

      /**
       * Возвращает максимальное количество знаков в дробной части
       * @return {*}
       * @see precision
       * @see setPrecision
       */
      getPrecision: function () {
         return this._$precision;
      },

      /**
       * Устанавливает максимальное количество знаков в дробной части
       * @param {*} value
       * @see precision
       * @see getPrecision
       */
      setPrecision: function (value) {
         this._$precision = value;
      }

      //endregion Public methods

   });

   return RealField;
});
