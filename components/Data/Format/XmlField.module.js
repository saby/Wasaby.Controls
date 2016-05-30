/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.XmlField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат поля для строки в формате XML
    * @class SBIS3.CONTROLS.Data.Format.XmlField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var XmlField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.XmlField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.XmlField',

      /**
       * @cfg {String} Значение поля по умолчанию
       * @name SBIS3.CONTROLS.Data.Format.XmlField#defaultValue
       * @see getDefaultValue
       * @see setDefaultValue
       */
      _$defaultValue: ''

      //region Public methods

      //endregion Public methods

   });

   return XmlField;
});
