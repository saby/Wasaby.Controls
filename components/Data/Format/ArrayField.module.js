/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.ArrayField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат поля для массива значений
    * @class SBIS3.CONTROLS.Data.Format.ArrayField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var ArrayField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.ArrayField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.ArrayField',

      /**
       * @cfg {String} Тип элементов
       * @name SBIS3.CONTROLS.Data.Format.ArrayField#kind
       * @see getKind
       */
      _$kind: '',

      /**
       * Возвращает тип элементов
       * @returns {String}
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
