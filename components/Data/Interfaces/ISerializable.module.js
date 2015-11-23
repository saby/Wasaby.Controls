/* global define */
define('js!SBIS3.CONTROLS.Data.ISerializable', [], function () {
   'use strict';

   /**
    * Интерфейс сериализуемых экземпляров классов
    * @mixin SBIS3.CONTROLS.Data.ISerializable
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.ISerializable.prototype */{
      /**
       * Возвращает экземпляр в сериализованном виде
       * @returns {Object}
       */
      toJSON: function () {
         throw new Error('Method must be implemented');
      }
   };
});
