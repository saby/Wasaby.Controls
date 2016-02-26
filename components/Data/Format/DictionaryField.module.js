/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.DictionaryField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат поля со словарём (абстрактный класс)
    * @class SBIS3.CONTROLS.Data.Format.DictionaryField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var DictionaryField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.DictionaryField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.DictionaryField',
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.IDictionary.<Integer, String>} Словарь возможных значений
             * @see getDictionary
             */
            dictionary: null
         }
      },

      //region Public methods

      /**
       * Возвращает словарь возможных значений
       * @returns {*}
       * @see dictionary
       */
      getDictionary: function () {
         return this._options.dictionary;
      }

      //endregion Public methods

   });

   return DictionaryField;
});
