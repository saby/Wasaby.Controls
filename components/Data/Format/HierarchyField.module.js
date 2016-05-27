/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.HierarchyField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат поля иерархии
    * @class SBIS3.CONTROLS.Data.Format.HierarchyField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var HierarchyField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.HierarchyField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.HierarchyField',

      /**
       * @cfg {String} Тип элементов
       * @name SBIS3.CONTROLS.Data.Format.HierarchyField#kind
       * @see getKind
       */
      _$kind: '',

      constructor: function(options) {
         if (options && options.kind === 'identity') {
            this._$defaultValue = [null];
         }
         HierarchyField.superclass.constructor.call(this, options);
      },

      //region Public methods

      /**
       * Возвращает тип элементов
       * @returns {String}
       * @see dictionary
       */
      getKind: function () {
         return this._$kind;
      }

      //endregion Public methods

   });

   return HierarchyField;
});
