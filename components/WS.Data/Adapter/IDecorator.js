/* global define */
define('js!WS.Data/Adapter/IDecorator', [], function () {
   'use strict';

   /**
    * Интерфейс адаптера, являющегося декоратором другого адаптера
    * @interface WS.Data/Adapter/IDecorator
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Adapter/IDecorator.prototype */{
      _wsDataAdapterIDecorator: true,

      /**
       * Возвращает оригинальный адаптер
       * @return {WS.Data/Adapter/IAdapter|WS.Data/Adapter/IRecord|WS.Data/Adapter/ITable}
       */
      getOriginal: function () {
         throw new Error('Method must be implemented');
      }
   };
});
