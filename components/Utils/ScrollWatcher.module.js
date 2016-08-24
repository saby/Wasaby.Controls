/**
 * Created by ad.chistyakova on 12.11.2015.
 */
define('js!SBIS3.CONTROLS.ScrollWatcher', [], function() {
   'use strict';
   var ScrollWatcher = $ws.proto.Abstract.extend(/** @lends SBIS3.CONTROLS.ScrollWatcher.prototype */{
      /**
       * @event onScroll Событие проиходит, когда срабатывает проверка на скроллею Например, когда достигли низа страницы
       * @remark
       *
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} type - какое именно событие произошло. Достигли дна окна, контейнера, всплывающей панели.
       * Или это наоборот доскроллили вверх
       * @param {jQuery} event - то самое соыбтие scroll, на которое подписан ScrollWatcher
       * @example
       * <pre>
       *     ScrollWatcher.subscribe('onScroll', function(event, type) {
       *        if (type === 'bottom') {
       *          $ws.core.alert('Вы достигли дна');
       *        }
       *     });
       * </pre>
       */
      $protected: {
         _options: {
            /**
             * @cfg {jQuery} У какого элемента отслеживат скролл.
             * @remark
             * Если не передать, то подписка на скролл будет у window
             */
            element : undefined,
            /**
             * @cfg {Control} Контрол, от которого отслеживается скролл.
             * @remark
             * По нему будем искать находимся ли мы на floatArea.
             *
             */
            opener: undefined,
            /**
             * @cfg {Number} Определитель нижней границы. Если передать число > 0 то событие с типом "Достигли дна(до скроллили до низа\верха страницы)"
             * будет срабатывать на totalScrollOffset px раньше
             */
            totalScrollOffset : 0
         }
      },

      $constructor: function() {
         var topParent;
         this._publish('onTotalScroll', 'onScroll');
         // Ищем в порядке - пользовательский контейнер -> FloatArea -> Window
         if (!this._options.element || !this._options.element.length) {
            var topParent = this._options.opener.getTopParent();
            if ($ws.helpers.instanceOfModule(topParent, 'SBIS3.CORE.FloatArea')) {
               this._options.element = topParent.getContainer().closest('.ws-scrolling-content');
            } else {
               var scrollingContent = $('.ws-body-scrolling-content');
               if (scrollingContent && scrollingContent.length){
                  this._options.element = scrollingContent;
               }
            }
         }

         var element = this._options.element || $('body');
         this._customScroll = element.hasClass('controls-Scroll__container');

         // Подписываемся либо на событие скролла у CustomScroll, либо на скролл у контейнера
         if (this._customScroll) {
            element[0].wsControl.subscribe('onScroll', this._processCustomScrollEvent.bind(this));
         } else {
            element.bind('scroll.wsScrollWatcher', this._onContainerScroll.bind(this));
            // Нужно чтобы вызвать скролл у контейнеров без видимого скролла. 
            // TODO: Не работает на touch устройствах - нужно выпилить
            $ws.helpers.wheel(element, function (event) {
               $(element).scrollTop($(element).scrollTop() - event.wheelDelta / 2);
            });
         }
      },

      /**
       * Точка соприкосновения всех подписанных скроллов
       * Здесь проиходяит проверки - куда поскроллили, вызываются пользовательские функции проверки
       * @param {number} curScrollTop - текущее положение скролла
       * @private
       */
      _processScrollEvent: function (curScrollTop) {
         this._notify('onScroll', curScrollTop);
         if (this.isScrollOnTop()) {
            this._notify('onTotalScroll', 'top', curScrollTop);
         } else if (this.isScrollOnBottom()) {
            this._notify('onTotalScroll', 'bottom', curScrollTop);
         }
      },

      _processCustomScrollEvent: function(event, direction, scrollTop){
         this._notify('onTotalScroll', direction, scrollTop);
      },

      _onContainerScroll: function (event) {
         var elem = event.target;
         this._processScrollEvent(elem.scrollTop);
      },

      getScrollContainer: function(){
         return this._options.element[0];
      },

      isScrollOnBottom: function(){
         var element = this._options.element[0];
         //customScroll
         if (this._customScroll)
            return element.wsControl.isScrollOnBottom();
         else {
            return element.scrollTop + element.offsetHeight > element.scrollHeight - this._options.totalScrollOffset;
         }
      },

      isScrollOnTop: function(){
         var element = this._options.element[0];
         if (this._customScroll){
            return element.wsControl.isScrollOnTop();
         }
         else {
            return element.scrollTop == 0;
         }
      },

      /**
       * Проскроллить в контейнере
       * @param {String|Number} offset куда или насколько скроллить.
       * @variant top - доскроллить до верха контейнера
       * @variant bottom - доскроллить до низа контейнера
       * @variant {Number} - поскроллить на указанную величину
       */
      scrollTo:function(offset){
         var element = this._options.element;
         if (this._customScroll){
            element[0].wsControl.scrollTo(typeof offset === 'string' ? (offset === 'top' ? 0 : 'bottom') : $ws.helpers.format({offset: offset}, '-=$offset$s$'));
            this._lastScrollTop = element[0].wsControl.getScrollTop();
            return;
         }
         element.scrollTop(typeof offset === 'string' ? (offset === 'top' ? 0 : element[0].scrollHeight) : offset);
      },

      /**
       * Получить текущую высоту скролла отслеживаемого элемента
       * @returns {*}
       */
      getScrollHeight: function(){
         var element = this._options.element;
         return this._customScroll ? $('.mCSB_container').height() : this.getScrollContainer().scrollHeight;
      },

      /**
       * Получить текущую высоту скроллируемого контейнера
       * @returns {Number}
       */
      getContainerHeight: function(){
         return this._options.element.height();
      },

      /**
       * Есть ли у скроллируемого элемента скролл (т.е. данные, вылезшие за пределы контейнера по высоте)
       * @returns {boolean}
       */
      hasScroll: function(offset){
         offset = offset || 0;
         var element = this._options.element;
         if (this._customScroll) {
            return element[0].wsControl.hasScroll();
         }
         var scrollHeight = this.getScrollHeight();
         return scrollHeight > this.getContainerHeight() + offset || scrollHeight > $(window).height() + offset;
      },

      destroy: function(){
         this._options.element.unbind('scroll.wsScrollWatcher');
         ScrollWatcher.superclass.destroy.call(this);
      }

   });

   return ScrollWatcher;
});