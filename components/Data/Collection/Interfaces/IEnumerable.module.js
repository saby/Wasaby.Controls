/* global define */
define('js!SBIS3.CONTROLS.Data.Collection.IEnumerable', [], function () {
   'use strict';

   /**
    * Интерфейс коллеции c последовательным доступом
    * @mixin SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Collection.IEnumerable.prototype */{
      /**
       * Возвращает энумератор для перебора элементов коллеции
       * @returns {SBIS3.CONTROLS.Data.Collection.IEnumerator}
       */
      getEnumerator: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Перебирает все элементы коллекции, начиная с первого
       * @param {Function(*, Number)} callback Ф-я обратного вызова для каждого элемента коллекции
       * @param {Object} [context] Конекст
       */
      each: function (callback, context) {
         throw new Error('Method must be implemented');
      }
   };
});
