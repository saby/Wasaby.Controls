/* global define */
define('js!WS.Data/Format/RpcFileField', [
   'js!WS.Data/Format/Field'
], function (
   Field
) {
   'use strict';

   /**
    * Формат поля файл-RPC.
    *
    * Создадим поле c типом "Файл-RPC":
    * <pre>
    *    var field = {
    *       name: 'foo',
    *       type: 'rpcfile'
    *    };
    * </pre>
    * @class WS.Data/Format/RpcFileField
    * @extends WS.Data/Format/Field
    * @public
    * @author Мальцев Алексей
    */

   var RpcFileField = Field.extend(/** @lends WS.Data/Format/RpcFileField.prototype */{
      _moduleName: 'WS.Data/Format/RpcFileField'

      //region Public methods

      //endregion Public methods

   });

   return RpcFileField;
});
