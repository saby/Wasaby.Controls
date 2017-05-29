/* global define */
define('js!WS.Data/Source/Provider/IRpc', [], function () {
   'use strict';

   /**
    * Интерфейс RPC провайдера
    * @interface WS.Data/Source/Provider/IRpc
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Source/Provider/IRpc.prototype */{
      /**
       * Вызывает удаленный метод
       * @param {String} method Имя метода
       * @param {Object.<String, *>|Array} [args] Аргументы метода
       * @return {Core/Deferred} Асинхронный результат операции
       */
      call: function(method, args) {
         throw new Error('Method must be implemented');
      }
   };
});
