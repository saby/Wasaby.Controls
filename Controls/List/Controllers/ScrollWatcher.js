define('js!Controls/List/Controllers/ScrollWatcher',
   ['Core/Abstract'],
   function(Abstract) {
      /**
       *
       * @author Девятов Илья
       * @public
       */
      var ScrollWatcher = Abstract.extend([], {
         constructor: function(cfg) {
            ScrollWatcher.superclass.constructor.apply(this, arguments);

            this._hasIntersectionObserver = !!(window && window.IntersectionObserver);
            this._initHandlers(cfg.elements);
         },

         _initHandlers: function (elements) {
            //Есть IntersectionObserver - работаем через него. Иначе - через onScroll
            if (this._hasIntersectionObserver) {
               this._initIntersectionObserver(elements);
            }

            this._initOnScroll(elements.scrollContainer);

         },

         /**
          * Подписка на появление элементов в видимой области (через IntersectionObserver)
          * @param elements
          * @private
          */
         _initIntersectionObserver: function(elements) {
            var self = this,
               observer = new IntersectionObserver(function(changes) {
                  for (var i = 0; i < changes.length; i++) {
                     if (changes[i].isIntersecting) {
                        switch (changes[i].target) {
                           case elements.topLoadTrigger:
                              self._notify('onLoadTriggerTop');
                              break;
                           case elements.bottomLoadTrigger:
                              self._notify('onLoadTriggertBottom');
                              break;
                           case elements.topListTrigger:
                              self._notify('onListTop');
                              break;
                           case elements.bottomListTrigger:
                              self._notify('onListtBottom');
                              break;
                        }
                     }
                  }
               }, {});
            observer.observe(elements.topLoadTrigger);
            observer.observe(elements.bottomLoadTrigger);

            observer.observe(elements.topListTrigger);
            observer.observe(elements.bottomListTrigger);
         },

         /**
          * Установка обработчика на onScroll
          * TODO когда будет механизм подписок Зуева - перейти на него
          * @param scrollContainer
          * @private
          */
         _initOnScroll: function(scrollContainer) {
            scrollContainer[0].addEventListener('scroll', this._onScroll.bind(this));
         },

         /**
          * Обработчик onScroll. Вычисление, какие триггеры попали в область видимости
          * @param e
          * @private
          */
         _onScroll: function(e) {
            clearTimeout(this._scrollTimeout);
            this._scrollTimeout = setTimeout(function () {
               var scrollTop = e.target.scrollTop;

               if (!this._hasIntersectionObserver) {
                  //TODO нужно более грамотное вычисление достижения низа. Это скорее всего где-то не заработает
                  if (scrollTop <= 0) {
                     this._notify('onLoadTriggerTop');
                  } else if (scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
                     this._notify('onLoadTriggertBottom');
                  }
               }

               this._notify('onListScroll', scrollTop);
            }.bind(this), 25);
         }
      });

      return ScrollWatcher;
   });
