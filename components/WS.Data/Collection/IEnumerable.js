/* global define */
define('js!WS.Data/Collection/IEnumerable', [], function () {
   'use strict';

   /**
    * Интерфейс коллекции c последовательным доступом
    * @interface WS.Data/Collection/IEnumerable
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Collection/IEnumerable.prototype */{
      _wsDataCollectionIEnumerable: true,

      /**
       * Возвращает энумератор для перебора элементов коллекции
       * @return {WS.Data/Collection/IEnumerator}
       * @example
       * Получим элементы коллекции через энумератор:
       * <pre>
       *    var list = new List({
       *          items: [1, 2, 3]
       *       }),
       *       enumerator = list.getEnumerator();
       *
       *    while (enumerator.moveNext()) {
       *       console.log(enumerator.getCurrent());
       *    }
       *    //1, 2, 3
       * </pre>
       */
      getEnumerator: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Перебирает все элементы коллекции, начиная с первого.
       * Цикл проходит полное количество итераций, его невозможно прервать досрочно.
       * @param {Function(*, Number)} callback Ф-я обратного вызова для каждого элемента коллекции (аргументами придут элемент коллекции и его порядковый номер)
       * @param {Object} [context] Контекст вызова callback
       * @example
       * Получим элементы коллекции:
       * <pre>
       *    var list = new List({
       *          items: [1, 2, 3]
       *       }),
       *
       *    list.each(function(item) {
       *       console.log(item);
       *    });
       *    //1, 2, 3
       * </pre>
       */
      each: function (callback, context) {
         throw new Error('Method must be implemented');
      }
   };
});
