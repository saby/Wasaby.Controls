/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.IRpc', [
], function () {
   'use strict';

   /**
    * Интерфейс RPC провайдера
    * @mixin SBIS3.CONTROLS.Data.Source.Provider.IRpc
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Source.Provider.IRpc.prototype */{
      /**
       * Вызывает удаленный метод
       * @param {String} method Имя метода
       * @param {Object} [args] Аргументы метода
       * @returns {$ws.proto.Deferred} Асинхронный результат операции
       */
      call: function(method, args) {
         throw new Error('Method must be implemented');
      }
   };
});
