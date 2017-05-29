/* global define */
define('js!WS.Data/Entity/ObservableMixin', [
   'Core/EventBus'
], function (
   CoreEventBus
) {
   'use strict';

   /**
    * Примесь, позволяющая сущности возможность узнавать об изменении состояния объекта через события.
    * @class WS.Data/Entity/ObservableMixin
    * @public
    * @author Мальцев Алексей
    */

   var ObservableMixin = /**@lends WS.Data/Entity/ObservableMixin.prototype */{
      /**
       * @cfg {Object.<String, Function>} handlers Обработчики событий
       */

      /**
       * @member {$ws.proto.EventBusChannel} Канал событий
       */
      _eventBusChannel: null,

      /**
       * @member {Array.<Array>} Очередь событий
       */
      _eventsQueue: null,

      /**
       * @member {Array.<String>} Декларированные события
       */
      _publishedEvents: null,

      constructor: function $ObservableMixin(options) {
         var handlers = options && options.handlers,
            event;
         if (handlers instanceof Object) {
            for (event in handlers) {
               if (handlers.hasOwnProperty(event)) {
                  this.subscribe(event, handlers[event]);
               }
            }
         }
      },

      destroy: function() {
         if (this._eventBusChannel) {
            this._eventBusChannel.unsubscribeAll();
            this._eventBusChannel.destroy();
            this._eventBusChannel = null;
         }
      },

      /**
       * Добавляет подписку на событие
       * @param {String} event Имя события, на которое подписается обработчик
       * @param {Function} handler Обработчик события.
       * @param {Object} [ctx] Контекст выполнения
       * @example
       * Подпишемся на событие OnSomethingChanged:
       * <pre>
       *    var instance = new Entity();
       *    instance.subscribe('OnSomethingChanged', function(event, eventArg1) {
       *       //do something
       *    });
       * </pre>
       */
      subscribe: function (event, handler, ctx) {
         if (this._destroyed) {
            return;
         }

         if (!this._eventBusChannel) {
            this._eventBusChannel = CoreEventBus.channel();

            if (this._publishedEvents) {
               for (var i = 0; i < this._publishedEvents.length; i++) {
                  this._eventBusChannel.publish(this._publishedEvents[i]);
               }
            }
         }

         if (ctx === undefined) {
            ctx = this;
         }
         this._eventBusChannel.subscribe(event, handler, ctx);
      },

      /**
       * Отменяет подписку на событие
       * @param {String} event Имя события, на которое подписается обработчик
       * @param {Function} handler Обработчик события.
       * @param {Object} [ctx] Контекст выполнения
       * @example
       * Подпишемся на событие OnSomethingChanged и обработаем его только один раз:
       * <pre>
       *    var instance = new Entity(),
       *       handler = function(event, eventArg1) {
       *          instance.unsubscribe(handler);
       *          //do something
       *       };
       *    instance.subscribe('OnSomethingChanged', handler);
       * </pre>
       */
      unsubscribe: function (event, handler, ctx) {
         if (this._eventBusChannel) {
            if (ctx === undefined) {
               ctx = this;
            }
            this._eventBusChannel.unsubscribe(event, handler, ctx);
         }
      },

      /**
       * Возвращет массив подписчиков на событие
       * @param {String} event Имя события
       * @return {Array.<$ws.proto.EventObject>}
       * @example
       * Посмотрим, сколько подписчиков у события OnSomethingChanged
       * <pre>
       *    var handlersCount = instance.getEventHandlers().length;
       * </pre>
       */
      getEventHandlers: function(event) {
         return this._eventBusChannel ? this._eventBusChannel.getEventHandlers(event) : [];
      },

      /**
       * Проверяет наличие подписки на событие
       * @param {String} event Имя события
       * @return {Boolean}
       * @example
       * Посмотрим, есть ли подписчики у события OnSomethingChanged
       * <pre>
       *    var hasHandlers = instance.hasEventHandlers();
       * </pre>
       */
      hasEventHandlers: function(event) {
         return this._eventBusChannel ? this._eventBusChannel.hasEventHandlers(event) : false;
      },

      /**
       * Деклариует наличие события
       * @param {String} event Имя события
       * @protected
       */
      _publish: function() {
         var event;

         this._publishedEvents = this._publishedEvents || [];
         for (var i = 0; i < arguments.length; i++) {
            event = arguments[i];
            this._publishedEvents.push(event);
            if (this._eventBusChannel) {
               this._eventBusChannel.publish(event);
            }
         }
      },

      /**
       * Извещает подписчиков о наступлении события.
       * Если в процессе извещения приходит очередное событие, то извещение о нем будет отправлено после выполнения обработчиков предыдущего.
       * @param {String} event Имя события
       * @param [arg1, [...]] Аргументы события
       * @return {*} Результат обработки события (возвращается только в случае отсутствия очереди)
       * @protected
       */
      _notify: function () {
         if (this._eventBusChannel) {
            var args = new Array(arguments.length);
            for(var i = 0; i < arguments.length; i++) {
               args[i] = arguments[i];
            }

            this._eventsQueue = this._eventsQueue || [];
            this._eventsQueue.push(args);
            return this._notifyQueue(this._eventsQueue)[0];
         }
      },

      /**
       * Инициирует выполнение обработчиков из очереди событий
       * @param {Array.<Array>} eventsQueue Очередь событий
       * @return {Array} Результаты обработки событиий
       * @protected
       */
      _notifyQueue: function(eventsQueue) {
         var results = [];

         if (eventsQueue.length === 1) {
            var item;
            while ((item = eventsQueue[0])) {
               results.push(this._eventBusChannel._notifyWithTarget(
                  item[0],
                  this,
                  item.slice(1)
               ));
               eventsQueue.shift();
            }
         }

         return results;
      },
      
      /**
       * Удаляет из очереди все обработчики указанного события
       * @param {String} eventName Имя события
       * @protected
       */
      _removeFromQueue: function(eventName) {
         if (!this._eventsQueue) {
            return;
         }
         
         for (var i = 1; i < this._eventsQueue.length; i++) {
            if (this._eventsQueue[i][0] === eventName) {
               this._eventsQueue.splice(i, 1);
               i--;
            }
         }
      }
   };

   return ObservableMixin;
});
