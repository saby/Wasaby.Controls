/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.IAbstract', [
], function () {
   'use strict';

   /**
    * Интерфейс абстрактного провайдера
    * @mixin SBIS3.CONTROLS.Data.Source.Provider.IAbstract
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Source.Provider.IAbstract.prototype */{
      /**
       * Вызывает удаленный сервис
       * @param {String} name Имя сервиса
       * @param {Object.<String, *>|Array} [args] Аргументы вызова
       * @returns {$ws.proto.Deferred} Асинхронный результат операции
       */
      call: function(name, args) {
         throw new Error('Method must be implemented');
      }
   };
});
