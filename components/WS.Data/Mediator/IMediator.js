/* global define */
define('js!WS.Data/Mediator/IMediator', [], function () {
   'use strict';

   /**
    * Интерфейс абстрактного посредника
    * @interface WS.Data/Mediator/IMediator
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Mediator/IMediator.prototype */{
      /**
       * Возвращает singleton экземпляр посредника
       * @return {WS.Data/Collection/IEnumerator}
       * @static
       */
      getInstance: function () {
         throw new Error('Method must be implemented');
      }
   };
});
