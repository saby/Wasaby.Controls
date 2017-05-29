/* global define */
define('js!WS.Data/Entity/IProducible', [], function () {
   'use strict';

   /**
    * Интерфейс получения экземпляра класса через фабричный метод
    * @interface WS.Data/Entity/IProducible
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Entity/IProducible.prototype */{
      _wsDataEntityIProducible: true,

      /**
       * Создает экземпляр класса.
       * @param {*} [data] Исходные данные.
       * @param {Object} [options] Дополнительные данные.
       * @return {Object}
       * @static
       */
      produceInstance: function (data, options) {
         throw new Error('Method must be implemented');
      }
   };
});
