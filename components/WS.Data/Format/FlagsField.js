/* global define */
define('js!WS.Data/Format/FlagsField', [
   'js!WS.Data/Format/DictionaryField'
], function (
   DictionaryField
) {
   'use strict';

   /**
    * Формат поля флагов.
    *
    * Создадим поле c типом "Флаги":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'flags',
    *       dictionary: ['one', 'two', 'three']
    *    };
    * </pre>
    * @class WS.Data/Format/FlagsField
    * @extends WS.Data/Format/DictionaryField
    * @public
    * @author Мальцев Алексей
    */

   var FlagsField = DictionaryField.extend(/** @lends WS.Data/Format/FlagsField.prototype */{
      _moduleName: 'WS.Data/Format/FlagsField'

      //region Public methods

      //endregion Public methods

   });

   return FlagsField;
});
