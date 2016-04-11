/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ObservableMixin', function () {
   'use strict';

   /**
    * Дает модулю возможность использовать события
    * @class SBIS3.CONTROLS.Data.ObservableMixin
    * @public
    * @author Мальцев Алексей
    */

   var ObservableMixin = /**@lends SBIS3.CONTROLS.Data.ObservableMixin.prototype */{
      /**
       * @member {$ws.proto.EventBusChannel} Канал событий
       */
      _eventBusChannel: null,

      /**
       * @member {Array.<String>} Декларированные события
       */
      _publishedEvents: null,

      constructor: function $ObservableMixin() {
         this._publishedEvents = [];
      },

      /**
       * Разрушает экземпляр
       */
      destroy: function() {
         if (this._eventBusChannel) {
            this._eventBusChannel.unsubscribeAll();
            this._eventBusChannel.destroy();
         }
      },

      /**
       * Добавляет подписку на событие
       * @param {String} event Имя события, на которое подписается обработчик
       * @param {Function} handler Обработчик события.
       * @param {Object} [ctx] Контекст выполнения
       */
      subscribe: function (event, handler, ctx) {
         if (!this._eventBusChannel) {
            this._eventBusChannel = new $ws.proto.EventBusChannel();

            for (var i = 0; i < this._publishedEvents.length; i++) {
               this._eventBusChannel.publish(this._publishedEvents[i]);
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
       * Деклариует наличие события
       * @param {String} event Имя события
       * @protected
       */
      _publish: function(event) {
         this._publishedEvents.push(event);

         if (this._eventBusChannel) {
            this._eventBusChannel.publish(event);
         }
      },

      /**
       * Проверяет наличие подписки на событие
       * @param {String} event Имя события
       * @return {Boolean}
       * @protected
       */
      _hasEventHandlers: function(event) {
         this._eventBusChannel && this._eventBusChannel.hasEventHandlers(event);
      },

      /**
       * Извещает подписчиков о наступлении события
       * @param {String} event Имя события
       * @param [arg1, [...]] Аргументы события
       * @protected
       */
      _notify: function () {
         if (this._eventBusChannel) {
            this._eventBusChannel.notify.apply(this._eventBusChannel, arguments);
         }
      }
   };

   return ObservableMixin;
});
