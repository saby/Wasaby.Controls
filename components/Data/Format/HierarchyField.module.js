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
      _moduleName: 'SBIS3.CONTROLS.Data.Format.HierarchyField'

      //region Public methods

      //endregion Public methods

   });

   return HierarchyField;
});
