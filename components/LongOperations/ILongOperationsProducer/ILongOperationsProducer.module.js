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
      //_sbis3EngineILongOperationsProducer: true,

      /**
       * @event onStarted Происходит при принятии на исполнение новой длительной операции
       * @param {Core/EventObject} evtName Дескриптор события
       * @param {object} data Данные события
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
       * Ликвидировать экземпляр класса
       * @public
       */
      destroy: function () {
         throw new Error('Method must be implemented');
      }
   };
});
