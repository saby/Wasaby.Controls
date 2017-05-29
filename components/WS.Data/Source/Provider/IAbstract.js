/* global define */
define('js!WS.Data/Source/Provider/IAbstract', [], function () {
   'use strict';

   /**
    * Интерфейс абстрактного провайдера
    * @interface WS.Data/Source/Provider/IAbstract
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Source/Provider/IAbstract.prototype */{
      /**
       * Вызывает удаленный сервис
       * @param {String} name Имя сервиса
       * @param {Object.<String, *>|Array} [args] Аргументы вызова
       * @return {Core/Deferred} Асинхронный результат операции
       */
      call: function(name, args) {
         throw new Error('Method must be implemented');
      }
   };
});
