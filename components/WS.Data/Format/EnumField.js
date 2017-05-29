/* global define */
define('js!WS.Data/Format/EnumField', [
   'js!WS.Data/Format/DictionaryField'
], function (
   DictionaryField
) {
   'use strict';

   /**
    * Формат перечисляемого поля.
    *
    * Создадим поле c типом "Перечисляемое":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'enum',
    *       dictionary: ['one', 'two', 'three']
    *    };
    * </pre>
    * @class WS.Data/Format/EnumField
    * @extends WS.Data/Format/DictionaryField
    * @public
    * @author Мальцев Алексей
    */

   var EnumField = DictionaryField.extend(/** @lends WS.Data/Format/EnumField.prototype */{
      _moduleName: 'WS.Data/Format/EnumField'

      //region Public methods

      //endregion Public methods

   });

   return EnumField;
});
