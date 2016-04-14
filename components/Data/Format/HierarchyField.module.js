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
      $protected: {
         _options: {
            /**
             * @cfg {String} Тип элементов
             * @see getKind
             */
            kind: ''
         }
      },
      //region Public methods
      $constructor: function(cfg) {
         cfg = cfg ||{};
         if (cfg.kind === 'identity') {
            this._options.defaultValue = [null];
         }
      },
      /**
       * Возвращает тип элементов
       * @returns {String}
       * @see dictionary
       */
      getKind: function () {
         return this._options.kind;
      }

      //endregion Public methods

   });

   return HierarchyField;
});
