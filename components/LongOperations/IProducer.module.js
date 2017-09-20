/**
 * Интерфейс продюсера длительных операций
 * @interface SBIS3.CONTROLS.LongOperations.IProducer
 * @public
 * @author Спирин Виктор Алексеевич
 */

define('js!SBIS3.CONTROLS.LongOperations.IProducer',
   [],

   function () {
      'use strict';

      /**
       * "Константа" - Сообщение об ошибке при вызове непереопределённого метода
       * @protected
       * @type {Error}
       */
      var NOT_IMPLEMENTED = 'Method must be implemented';

      return /** @lends SBIS3.CONTROLS.LongOperations.IProducer.prototype */{
         /**
          * @event onlongoperationstarted Происходит при начале исполнения новой длительной операции
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} data Данные события
          * @param {string} data.producer Имя продюсера
          * @param {string} data.operationId Идентификатор операции
          * @param {number} [data.progress.total] Общее количество подзадач, по умолчанию 1
          * @param {number} [data.progress.value] Количество выполненых подзадач (Здесь всегда 0)
          * @example
          * <pre>
          *    producer.subscribe('onlongoperationstarted', function (evtName, data) {
          *       ...
          *    });
          * </pre>
          *
          * @event onlongoperationchanged Происходит при изменении свойств длительной операции в процесе исполнения
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
          *    producer.subscribe('onlongoperationchanged', function (evtName, data) {
          *       ...
          *    });
          * </pre>
          *
          * @event onlongoperationended Происходит при завершении длительной операции по любой причине. При завершении вследствие ошибки предоставляется информация
          * об ошибке в свойстве data.error
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} data Данные события
          * @param {string} data.producer Имя продюсера
          * @param {string} data.operationId Идентификатор операции (Возможен список идентификаторов в свойстве data.operationIds)
          * @param {number} [data.progress.total] Общее количество подзадач, по умолчанию 1
          * @param {number} [data.progress.value] Количество выполненых подзадач (Здесь всегда равно data.progress.total)
          * @param {string} [data.error] Сообщение об ошибке, если завершено с ошибкой
          * @example
          * <pre>
          *    producer.subscribe('onlongoperationended', function (evtName, data) {
          *       ...
          *    });
          * </pre>
          *
          * @event onlongoperationdeleted При удалении длительной операции
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} data Данные события
          * @param {string} data.producer Имя продюсера
          * @param {string} data.operationId Идентификатор операции (Возможен список идентификаторов в свойстве data.operationIds)
          * @example
          * <pre>
          *    producer.subscribe('onlongoperationdeleted', function (evtName, data) {
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
            throw new Error(NOT_IMPLEMENTED);
         },
   
         /**
          * Показывает, что события продюсера не нужно распространять по всем вкладкам
          * @public
          * @return {boolean}
          */
         hasCrossTabEvents: function () {
            throw new Error(NOT_IMPLEMENTED);
         },
   
         /**
          * Показывает, что данные продюсера не зависят от вкладки (всегда будут одинаковы во всех вкладках)
          * @public
          * @return {boolean}
          */
         hasCrossTabData: function () {
            throw new Error(NOT_IMPLEMENTED);
         },
   
         /**
          * Запросить набор последних длительных операций
          * При имплементации в возвращаем Deferrred-е нужно использовать опцию cancelCallback, если это применимо с точки зрения природы данных
          * @public
          * @param {object} options Параметры запроса (опционально)
          * @param {object} options.where Параметры фильтрации
          * @param {object} options.orderBy Параметры сортировки
          * @param {number} options.offset Количество пропущенных элементов в начале
          * @param {number} options.limit Максимальное количество возвращаемых элементов
          * @param {object} [options.extra] Дополнительные параметры, если есть (опционально)
          * @return {Core/Deferred<SBIS3.CONTROLS.LongOperations.Entry[]>}
          */
         fetch: function (options) {
            throw new Error(NOT_IMPLEMENTED);
         },
   
         /**
          * Запросить выполнение указанного действия с указанным элементом
          * @public
          * @param {string} action Название действия
          * @param {string|number} operationId Идентификатор элемента
          * @return {Core/Deferred}
          */
         callAction: function (action, operationId) {
            throw new Error(NOT_IMPLEMENTED);
         },
   
         /**
          * Подписаться на получение события
          * @public
          * @param {string} eventType Тип события
          * @param {function} listener Обработчик события
          */
         subscribe: function (eventType, listener) {
            throw new Error(NOT_IMPLEMENTED);
         },
   
         /**
          * Отписаться от получения события
          * @public
          * @param {string} eventType Тип события
          * @param {function} listener Обработчик события
          */
         unsubscribe: function (eventType, listener) {
            throw new Error(NOT_IMPLEMENTED);
         },
   
         /**
          * Проверить, можно ли в данный момент ликвидировать экземпляр класса без необратимой потери данных
          * @public
          * @return {boolean}
          */
         canDestroySafely: function () {
            throw new Error(NOT_IMPLEMENTED);
         },
   
         /**
          * Ликвидировать экземпляр класса
          * @public
          */
         destroy: function () {
            throw new Error(NOT_IMPLEMENTED);
         }
      };
   }
);
