/* global define */
define('js!WS.Data/Query/IQueryable', [], function () {
   'use strict';

   /**
    * Интерфейс для создания выборки
    * @interface WS.Data/Query/IQueryable
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Query/IQueryable.prototype */{
      /**
       * Возвращает запрос
       * @return {WS.Data/Query/Query}
       */
      getQuery: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает запрос
       * @param {WS.Data/Query/Query} query
       */
      setQuery: function (query) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает элементы выборки
       * @return {Core/Deferred} Асинхронный результат выполнения, первым аргументом придет WS.Data/Collection/IEnumerable
       * <pre>
       *    var orders = ...//IQueriable
       *
       *    orders.fetch().addCallback(function(items) {
       *       items.each(function(item) {
       *          ...
       *       });
       *    });
       * </pre>
       */
      fetch: function () {
         throw new Error('Method must be implemented');
      }
   };
});
