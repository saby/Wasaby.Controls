define('js!SBIS3.CONTROLS.ILongOperationsHistoricalProducer',
   [],

   function () {
   'use strict';

   /**
    * Интерфейс продюсера истории длительной операции
    * @interface SBIS3.CONTROLS.ILongOperationsHistoricalProducer
    * @public
    */

   return /** @lends SBIS3.CONTROLS.ILongOperationsHistoricalProducer.prototype */{
      /**
       * Запросить историю указанной длительной операции
       * При имплементации в возвращаем Deferrred-е нужно использовать опцию cancelCallback, если это применимо с точки зрения природы данных
       * @public
       * @param {string|number} operationId Идентификатор длительной операции
       * @param {number} count Максимальное количество возвращаемых элементов
       * @param {object} [filter] Фильтр для получения не всех элементов истроии
       * @return {Core/Deferred<SBIS3.CONTROLS.LongOperationHistoryItem[]>}
       */
      history: function (operationId, count, filter) {
         throw new Error('Method must be implemented');
      }
   };
});
