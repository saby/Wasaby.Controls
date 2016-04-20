/* global define */
define('js!SBIS3.CONTROLS.Data.ICloneable', [], function () {
   'use strict';

   /**
    * Интерфейс клонирования объекта
    * @mixin SBIS3.CONTROLS.Data.ICloneable
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.ICloneable.prototype */{
      /**
       * Создает новый объект, который являтся копией текущего экземпляра
       * @returns {Object}
       */
      clone: function () {
         throw new Error('Method must be implemented');
      }
   };
});
