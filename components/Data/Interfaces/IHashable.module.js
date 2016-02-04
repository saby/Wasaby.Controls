/* global define */
define('js!SBIS3.CONTROLS.Data.IHashable', [], function () {
   'use strict';

   /**
    * Интерфейс получения уникального хэша
    * @mixin SBIS3.CONTROLS.Data.IHashable
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.IHashable.prototype */{
      /**
       * Возвращает уникальный хэш
       * @returns {String}
       */
      getHash: function () {
         throw new Error('Method must be implemented');
      }
   };
});
