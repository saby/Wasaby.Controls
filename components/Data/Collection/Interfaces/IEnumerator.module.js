/* global define */
define('js!SBIS3.CONTROLS.Data.Collection.IEnumerator', [], function () {
   'use strict';

   /**
    * Интерфейс последовательного перебора коллекции
    * @mixin SBIS3.CONTROLS.Data.Collection.IEnumerator
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Collection.IEnumerator.prototype */{
      /**
       * Возвращает текущий элемент
       * @returns {*}
       */
      getCurrent: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает следующий элемент
       * @returns {*}
       */
      getNext: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Сбрасывает текущий элемент
       */
      reset: function () {
         throw new Error('Method must be implemented');
      }
   };
});
