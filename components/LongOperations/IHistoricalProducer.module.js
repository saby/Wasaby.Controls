/**
 * Интерфейс продюсера истории длительной операции
 * @interface SBIS3.CONTROLS.LongOperations.IHistoricalProducer
 * @public
 */

define('js!SBIS3.CONTROLS.LongOperations.IHistoricalProducer',
   [],

   function () {
      'use strict';

      return /** @lends SBIS3.CONTROLS.LongOperations.IHistoricalProducer.prototype */{
         /**
          * Запросить историю указанной длительной операции
          * При имплементации в возвращаем Deferrred-е нужно использовать опцию cancelCallback, если это применимо с точки зрения природы данных
          * @public
          * @param {string|number} operationId Идентификатор длительной операции
          * @param {number} count Максимальное количество возвращаемых элементов
          * @param {object} [filter] Фильтр для получения не всех элементов истроии
          * @return {Core/Deferred<SBIS3.CONTROLS.LongOperations.HistoryItem[]>}
          */
         history: function (operationId, count, filter) {
            throw new Error('Method must be implemented');
         }
      };
   }
);
