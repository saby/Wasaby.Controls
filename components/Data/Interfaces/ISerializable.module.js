/* global define */
define('js!SBIS3.CONTROLS.Data.ISerializable', [], function () {
   'use strict';

   /**
    * Интерфейс сериализуемых объектов
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
      },

      /**
       * Создает экземпляр из сериализованного вида
       * @param {Object} data Сериализованный объект
       * @returns {Object}
       * @static
       */
      fromJSON: function (data) {
         throw new Error('Method must be implemented');
      }
   };
});
