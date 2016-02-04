/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Query.IQueryable', [], function () {
   'use strict';

   /**
    * Интерфейс для создания выборки
    * @mixin SBIS3.CONTROLS.Data.Query.IQueryable
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Query.IQueryable.prototype */{
      $protected: {
         /**
          * @var {SBIS3.CONTROLS.Data.Query.Query} Запрос
          */
         _query: undefined
      },

      /**
       * Возвращает запрос
       * @returns {SBIS3.CONTROLS.Data.Query.Query}
       */
      getQuery: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает запрос
       * @param {SBIS3.CONTROLS.Data.Query.Query} query
       */
      setQuery: function (query) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает элементы выборки
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения, первым аргументом придет SBIS3.CONTROLS.Data.Collection.IEnumerable
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
