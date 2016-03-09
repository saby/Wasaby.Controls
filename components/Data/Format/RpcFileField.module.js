/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.RpcFileField', [
   'js!SBIS3.CONTROLS.Data.Format.Field'
], function (Field) {
   'use strict';

   /**
    * Формат поля файл-RPC
    * @class SBIS3.CONTROLS.Data.Format.RpcFileField
    * @extends SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var RpcFileField = Field.extend(/** @lends SBIS3.CONTROLS.Data.Format.RpcFileField.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.RpcFileField'

      //region Public methods

      //endregion Public methods

   });

   return RpcFileField;
});
