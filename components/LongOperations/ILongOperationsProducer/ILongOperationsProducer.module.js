define('js!SBIS3.CONTROLS.ILongOperationsProducer',
   [],

   function () {
   'use strict';

   /**
    * Интерфейс продюсера длительных операций
    * @interface SBIS3.CONTROLS.ILongOperationsProducer
    * @public
    */

   return /** @lends SBIS3.CONTROLS.ILongOperationsProducer.prototype */{
      /**
       * @event onStarted Происходит при начале исполнения новой длительной операции
       * @param {Core/EventObject} evtName Дескриптор события
       * @param {object} data Данные события
       * @param {string} data.producer Имя продюсера
       * @param {string} data.operationId Идентификатор операции
       * @param {number} [data.progress.total] Общее количество подзадач, по умолчанию 1
       * @param {number} [data.progress.value] Количество выполненых подзадач (Здесь всегда 0)
       * @example
       * <pre>
       *    producer.subscribe('onstarted', function (evtName, data) {
       *       ...
       *    });
       * </pre>
       *
       * @event onChanged Происходит при изменении свойств длительной операции в процесе исполнения
       * @param {Core/EventObject} evtName Дескриптор события
       * @param {object} data Данные события
       * @param {string} data.producer Имя продюсера
       * @param {string} data.operationId Идентификатор операции
       * @param {string} data.changed Имя изменённого свойства
       * @param {number} [data.status] Новое значение статуса, если изменился статус
       * @param {number} [data.progress.total] Новая информация о прогресе выполнения, если изменился прогресс
       * @param {number} [data.progress.value] Новая информация о прогресе выполнения, если изменился прогресс
       * @param {string} [data.notification] Сообщение о ходе выполнения, если получено сообщение
       * @example
       * <pre>
       *    producer.subscribe('onchanged', function (evtName, data) {
       *       ...
       *    });
       * </pre>
       *
       * @event onEnded Происходит при завершении длительной операции по любой причине. При завершении вследствие ошибки предоставляется информация
       * об ошибке в свойстве data.error
       * @param {Core/EventObject} evtName Дескриптор события
       * @param {object} data Данные события
       * @param {string} data.producer Имя продюсера
       * @param {string} data.operationId Идентификатор операции (Возможен список идентификаторов в свойстве data.operationIds)
       * @param {number} data.status Статус операции, может быть только LongOperationEntry.STATUSES.success или LongOperationEntry.STATUSES.error
       * @param {number} [data.progress.total] Общее количество подзадач, по умолчанию 1
       * @param {number} [data.progress.value] Количество выполненых подзадач (Здесь всегда равно data.progress.total)
       * @example
       * <pre>
       *    producer.subscribe('onended', function (evtName, data) {
       *       ...
       *    });
       * </pre>
       *
       * @event onDeleted При удалении длительной операции
       * @param {Core/EventObject} evtName Дескриптор события
       * @param {object} data Данные события
       * @param {string} data.producer Имя продюсера
       * @param {string} data.operationId Идентификатор операции (Возможен список идентификаторов в свойстве data.operationIds)
       * @example
       * <pre>
       *    producer.subscribe('ondeleted', function (evtName, data) {
       *       ...
       *    });
       * </pre>
       */

      /**
       * Получить имя экземпляра продюсера
       * @public
       * @return {string}
       */
      getName: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Показывает, что события продюсера не нужно распространять по всем вкладкам
       * @public
       * @return {boolean}
       */
      hasCrossTabEvents: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Показывает, что данные продюсера не зависят от вкладки (всегда будут одинаковы во всех вкладках)
       * @public
       * @return {boolean}
       */
      hasCrossTabData: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Запросить набор последних длительных операций (отсортированных в обратном хронологическом порядке)
       * При имплементации в возвращаем Deferrred-е нужно использовать опцию cancelCallback, если это применимо с точки зрения природы данных
       * @public
       * @param {number} count Максимальное количество возвращаемых элементов
       * @return {Core/Deferred<SBIS3.CONTROLS.LongOperationEntry[]>}
       */
      fetch: function (count) {
         throw new Error('Method must be implemented');
      },

      /**
       * Запросить выполнение указанного действия с указанным элементом
       * @public
       * @param {string} action Название действия
       * @param {string|number} operationId Идентификатор элемента
       * @return {Core/Deferred}
       */
      callAction: function (action, operationId) {
         throw new Error('Method must be implemented');
      },

      /**
       * Подписаться на получение события
       * @public
       * @param {string} eventType Тип события
       * @param {function} listener Обработчик события
       */
      subscribe: function (eventType, listener) {
         throw new Error('Method must be implemented');
      },

      /**
       * Отписаться от получения события
       * @public
       * @param {string} eventType Тип события
       * @param {function} listener Обработчик события
       */
      unsubscribe: function (eventType, listener) {
         throw new Error('Method must be implemented');
      },

      /**
       * Ликвидировать экземпляр класса
       * @public
       */
      destroy: function () {
         throw new Error('Method must be implemented');
      }
   };
});
