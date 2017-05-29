/* global define */
define('js!WS.Data/Format/ArrayField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат поля для массива значений.
    *
    * Создадим поле с типом "Массив значений":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'array',
    *       kind: 'integer'
    *    };
    * </pre>
    * @class WS.Data/Format/ArrayField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var ArrayField = Field.extend(/** @lends WS.Data/Format/ArrayField.prototype */{
      _moduleName: 'WS.Data/Format/ArrayField',

      /**
       * @cfg {String} Тип элементов
       * @name WS.Data/Format/ArrayField#kind
       * @see getKind
       */
      _$kind: '',

      /**
       * Возвращает тип элементов
       * @return {String}
       * @see dictionary
       */
      getKind: function () {
         return this._$kind;
      }

      //region Public methods

      //endregion Public methods

   });

   return ArrayField;
});
