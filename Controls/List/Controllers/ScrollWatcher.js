define('js!Controls/List/Controllers/ScrollWatcher', [
   'Core/core-simpleExtend',
   'Core/helpers/Function/throttle'
], function(simpleExtend,
            throttle
   ) {
   'use strict';

   var _private = {
      onScrollWithoutIntersectionObserver: function(e, scrollTop) {
         //Проверка на триггеры начала/конца блока
         if (scrollTop <= 0) {
            this._options.eventHandlers.onListTop && this._options.eventHandlers.onListTop();
         }
         if (scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
            this._options.eventHandlers.onListBottom && this._options.eventHandlers.onListBottom();
         }

         //Проверка на триггеры загрузки
         if (scrollTop <= this._options.loadOffset) {
            this._options.eventHandlers.onLoadTriggerTop && this._options.eventHandlers.onLoadTriggerTop();
         }
         if (scrollTop + e.target.clientHeight >= e.target.scrollHeight - this._options.loadOffset) {
            this._options.eventHandlers.onLoadTriggerBottom && this._options.eventHandlers.onLoadTriggerBottom();
         }
      },

      onScrollHandler: function(additionalHandler, e) {
         var scrollTop = e.target.scrollTop;
         additionalHandler(e, scrollTop);

         this._options.eventHandlers.onListScroll && this._options.eventHandlers.onListScroll(scrollTop);
      }
   };

   /**
    *
    * @author Девятов Илья
    * @public
    */
   var ScrollWatcher = simpleExtend.extend({
      _options: null,
      _observer: null,

      constructor: function(cfg) {
         ScrollWatcher.superclass.constructor.apply(this, arguments);
         this._options = cfg;

         //Есть нет IntersectionObserver, то в обработчике onScroll нужно дополнительно обсчитывать все триггеры
         var additionalOnScrollHandler = function() { };
         if (!window || !window.IntersectionObserver) {
            additionalOnScrollHandler = _private.onScrollWithoutIntersectionObserver.bind(this);
         } else {
            this._initIntersectionObserver(cfg.triggers);
         }

         cfg.scrollContainer.addEventListener(
            'scroll',
            throttle(_private.onScrollHandler.bind(this, additionalOnScrollHandler), 200, true),
            {passive: true});
      },

      destroy: function() {
         if (this._observer) {
            this._observer.unobserve(this._options.triggers.topLoadTrigger);
            this._observer.unobserve(this._options.triggers.bottomLoadTrigger);
            this._observer.unobserve(this._options.triggers.topListTrigger);
            this._observer.unobserve(this._options.triggers.bottomListTrigger);
            this._observer = null;
         }

      },

      /**
       * Подписка на появление элементов в видимой области (через IntersectionObserver)
       * @param elements
       * @private
       */
      _initIntersectionObserver: function(elements) {
         var
            self = this;

         this._observer = new IntersectionObserver(function(changes) {
            for (var i = 0; i < changes.length; i++) {
               if (changes[i].isIntersecting) {
                  switch (changes[i].target) {
                     case elements.topLoadTrigger:
                        self._options.eventHandlers.onLoadTriggerTop && self._options.eventHandlers.onLoadTriggerTop();
                        break;
                     case elements.bottomLoadTrigger:
                        self._options.eventHandlers.onLoadTriggerBottom && self._options.eventHandlers.onLoadTriggerBottom();
                        break;
                     case elements.topListTrigger:
                        self._options.eventHandlers.onListTop && self._options.eventHandlers.onListTop();
                        break;
                     case elements.bottomListTrigger:
                        self._options.eventHandlers.onListBottom && self._options.eventHandlers.onListBottom();
                        break;
                  }
               }
            }
         }, {});
         this._observer.observe(elements.topLoadTrigger);
         this._observer.observe(elements.bottomLoadTrigger);

         this._observer.observe(elements.topListTrigger);
         this._observer.observe(elements.bottomListTrigger);
      }
   });

   return ScrollWatcher;
});
