/* global define */
define('js!WS.Data/Format/DictionaryField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат поля со словарём (абстрактный класс)
    * @class WS.Data/Format/DictionaryField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var DictionaryField = Field.extend(/** @lends WS.Data/Format/DictionaryField.prototype */{
      _moduleName: 'WS.Data/Format/DictionaryField',

      /**
       * @cfg {Array.<String>} Словарь возможных значений
       * @name WS.Data/Format/DictionaryField#dictionary
       * @see getDictionary
       */
      _$dictionary: null,

      //region Public methods

      /**
       * Возвращает словарь возможных значений
       * @return {Array.<String>}
       * @see dictionary
       */
      getDictionary: function () {
         return this._$dictionary;
      }

      //endregion Public methods

   });

   return DictionaryField;
});
