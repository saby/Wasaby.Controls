define('js!Controls/List/Controllers/ScrollWatcher',
   ['Core/core-simpleExtend', 'Core/Abstract', 'Core/helpers/Function/throttle'],
   function(simpleExtend, Abstract, throttle) {

      var _private = {
         onScrollWithoutIntersectionObserver: function(e, scrollTop) {
            //Проверка на триггеры начала/конца блока
            if (scrollTop <= 0) {
               this._notify('onListTop');
            }
            if (scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
               this._notify('onListBottom');
            }

            //Проверка на триггеры загрузки
            if (scrollTop <= this._options.loadOffset) {
               this._notify('onLoadTriggerTop');
            }
            if (scrollTop + e.target.clientHeight >= e.target.scrollHeight - this._options.loadOffset) {
               this._notify('onLoadTriggerBottom');
            }
         },

         onScrollHandler: function(additionalHandler, e) {
            var scrollTop = e.target.scrollTop;
            additionalHandler(e, scrollTop);

            this._notify('onListScroll', scrollTop);
         }
      };

      /**
       *
       * @author Девятов Илья
       * @public
       */
      var ScrollWatcher = Abstract.extend({
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

            cfg.scrollContainer[0].addEventListener('scroll', throttle(_private.onScrollHandler, 200, true).bind(this, additionalOnScrollHandler), {passive: true});
         },

         destroy: function() {
            if (this._observer) {
               this._observer.unobserve(this._options.triggers.topLoadTrigger);
               this._observer.unobserve(this._options.triggers.bottomLoadTrigger);
               this._observer.unobserve(this._options.triggers.topListTrigger);
               this._observer.unobserve(this._options.triggers.bottomListTrigger);
            }

            this._options = null;   //TODO это надо??
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
                           self._notify('onLoadTriggerTop');
                           break;
                        case elements.bottomLoadTrigger:
                           self._notify('onLoadTriggerBottom');
                           break;
                        case elements.topListTrigger:
                           self._notify('onListTop');
                           break;
                        case elements.bottomListTrigger:
                           self._notify('onListBottom');
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
