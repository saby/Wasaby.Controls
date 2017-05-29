/* global define */
define('js!WS.Data/Entity/ICloneable', [], function () {
   'use strict';

   /**
    * Интерфейс клонирования объекта.
    * @interface WS.Data/Entity/ICloneable
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Entity/ICloneable.prototype */{
      _wsDataEntityICloneable: true,

      /**
       * Создает новый объект, который являтся копией текущего экземпляра.
       * @param {Object} [shallow=false] Создать поверхностную копию (при агрегировании все включаемые объекты не клонируются). Использовать поверхностные копии можно только для чтения, т.к. изменения в них будут отражаться и на оригинале.
       * @return {Object}
       * @example
       * Создадим клон книги:
       * <pre>
       *    var book = new Record({
       *          rawData: {
       *             id: 1,
       *             title: 'Patterns of Enterprise Application Architecture'
       *          }
       *       }),
       *       clone = book.clone();
       *    book.get('title');//'Patterns of Enterprise Application Architecture'
       *    clone.get('title');//'Patterns of Enterprise Application Architecture'
       *    book.isEqual(clone);//true
       * </pre>
       */
      clone: function (shallow) {
         throw new Error('Method must be implemented');
      }
   };
});
