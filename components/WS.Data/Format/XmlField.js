/* global define */
define('js!WS.Data/Format/XmlField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат поля для строки в формате XML.
    *
    * Создадим поле c типом "XML":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'xml'
    *    };
    * </pre>
    * @class WS.Data/Format/XmlField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var XmlField = Field.extend(/** @lends WS.Data/Format/XmlField.prototype */{
      _moduleName: 'WS.Data/Format/XmlField',

      /**
       * @cfg {String} Значение поля по умолчанию
       * @name WS.Data/Format/XmlField#defaultValue
       * @see getDefaultValue
       * @see setDefaultValue
       */
      _$defaultValue: ''

      //region Public methods

      //endregion Public methods

   });

   return XmlField;
});
