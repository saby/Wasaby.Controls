/* global define */
define('js!WS.Data/Collection/IEnumerator', [], function () {
   'use strict';

   /**
    * Интерфейс объекта, служащего для последовательного перебора коллекции.
    * @interface WS.Data/Collection/IEnumerator
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Collection/IEnumerator.prototype */{
      /**
       * Возвращает текущий элемент
       * @return {*}
       * @example
       * Проверим текущий элемент:
       * <pre>
       *    var list = new List({
       *          items: [1, 2, 3]
       *       }),
       *       enumerator = list.getEnumerator();
       *
       *    enumerator.getCurrent();//undefined
       *    enumerator.moveNext();//true
       *    enumerator.getCurrent();//1
       * </pre>
       */
      getCurrent: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает индекс текущего элемента
       * @return {*}
       * @example
       * Проверим текущий элемент:
       * <pre>
       *    var list = new List({
       *          items: [1, 2, 3]
       *       }),
       *       enumerator = list.getEnumerator();
       *
       *    enumerator.getCurrentIndex();//undefined
       *
       *    enumerator.moveNext();//true
       *    enumerator.getCurrentIndex();//0
       * </pre>
       */
      getCurrentIndex: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Перемещает указатель на следующий элемент
       * @return {Boolean} true, если есть следующий элемент; false, если достигнут конец коллекции
       * @example
       * Получим элементы коллекции:
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
      moveNext: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает следующий элемент
       * @return {*|undefined}
       * @deprecated метод будет удален в 3.7.6 используйте moveNext() + getCurrent()
       * @see moveNext
       * @example
       * Получим элементы коллекции:
       * <pre>
       *    var list = new List({
       *          items: [1, 2, 3]
       *       }),
       *       enumerator = list.getEnumerator(),
       *       item;
       *
       *    while ((item = enumerator.getNext()) !== undefined) {
       *       console.log(item);
       *    }
       *    //1, 2, 3
       * </pre>
       */
      getNext: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Сбрасывает текущий элемент
       * @example
       * Сбросим текущий элемент:
       * <pre>
       *    var list = new List({
       *          items: [1, 2, 3]
       *       }),
       *       enumerator = list.getEnumerator();
       *
       *    enumerator.moveNext();//true
       *    enumerator.getCurrent();//1
       *    enumerator.reset();
       *    enumerator.getCurrent();//undefined
       * </pre>
       */
      reset: function () {
         throw new Error('Method must be implemented');
      }
   };
});
