/* global define */
define('js!WS.Data/Entity/IInstantiable', [], function () {
   'use strict';

   /**
    * Интерфейс получения уникального идентификатора для экземпляра класса
    * @interface WS.Data/Entity/IInstantiable
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Entity/IInstantiable.prototype */{
      _wsDataEntityIInstantiable: true,

      /**
       * Возвращает уникальный идентификатор экземпляра класса.
       * @return {String}
       */
      getInstanceId: function () {
         throw new Error('Method must be implemented');
      }
   };
});
