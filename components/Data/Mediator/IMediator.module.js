/* global define */
define('js!SBIS3.CONTROLS.Data.Mediator.IMediator', [], function () {
   'use strict';

   /**
    * Интерфейс абстрактного посредника
    * @mixin SBIS3.CONTROLS.Data.Mediator.IMediator
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Mediator.IMediator.prototype */{
      /**
       * Возвращает singleton экземпляр посредника
       * @returns {SBIS3.CONTROLS.Data.Collection.IEnumerator}
       * @static
       */
      getInstance: function () {
         throw new Error('Method must be implemented');
      }
   };
});
