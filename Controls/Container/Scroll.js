define('Controls/Container/Scroll',
   [
      'Core/Control',
      'tmpl!Controls/Container/Scroll/Scroll',
      'Core/detection',
      'Controls/Container/Scrollbar/Scrollbar',
      'css!Controls/Container/Scroll/Scroll'
   ],
   function(Control, template, detection) {

      'use strict';

      var _private = {
         doInitScrollbar: function(self){
            self.showScrollbar = !(detection.isMobileIOS || detection.isMobileAndroid) && (self._getContainerHeight() !== self._getScrollHeight());
            self.contentHeight = self._getScrollHeight();
            self.scrollBarPosition = self._getScrollTop();
         }
      };

      /**
       * Компонент - контейнер с узкой стилизованной полосой скролла.
       * @class Controls/Container/Scroll
       * @extends Controls/Control
       * @control
       * @public
       * @category Container
       */

      /**
       * @name Controls/Container/Scroll#content
       * @cfg {Content} Содержимое контейнера
       */
      /**
       * @name Controls/Container/Scroll#shadowVisibility
       * @cfg {Boolean} Наличие тени при прокрутке контента
       */
      /**
       * @name Controls/Container/Scroll#scrollbarVisibility
       * @cfg {Boolean} Наличие полосы прокрутки
       */
      /**
       * @name Controls/Container/Scroll#style
       * @cfg {String} Цветовая схема контейнера. Влияет на цвет тени и полоски скролла. Используется для того чтобы контейнер корректно отображался как на светлом так и на темном фоне.
       * @variant normal стандартная схема
       * @variant opposite противоположная схема
       */

      var ScrollContainer = Control.extend({
         _template: template,
         contentHeight: 1,
         scrollBarPosition: 0,
         showScrollbar: false,
         goodIntervalForSilentSizeChanged: null,
         _getScrollHeight: function(){
            return this._children.content.scrollHeight;
         },
         _getContainerHeight: function() {
            return this._children.content.offsetHeight;
         },
         _toggleGradient: function() {
            // maxScrollTop > 1 - погрешность округления на различных браузерах.
            var maxScrollTop = this._getScrollHeight() - this._getContainerHeight();
            this.topGradient = this._getScrollTop() > 0;
            this.bottomGradient = maxScrollTop > 1 && this._getScrollTop() < maxScrollTop;
         },
         _getScrollTop: function(){
            return this._children.content.scrollTop;
         },
         _initScrollbar: function initScrollbar() {
            _private.doInitScrollbar(this);
         },
         _hideScrollbar: function hideScrollbar() {
            this.showScrollbar = false;
         },
         _onScroll: function onScroll() {
            var scrollTop = this._getScrollTop();
            if (this.showScrollbar) {
               this.scrollBarPosition = scrollTop;
            }
            this._toggleGradient();
         },
         _afterMount: function afterMountScrollContainer() {
            if (this.showScrollbar) {
               this._toggleGradient();
            }
         },

         /**
          * Осуществить скролл на заданную величину в пикселях
          * @param {Number} offset
          */
         scrollTo: function(offset) {
            return this._children.content.scrollTop = offset;
         },

         /**
          * Осуществить скролл к верху области
          */
         scrollToTop: function() {
            this.scrollTo(0);
         },

         /**
          * Осуществить скролл к низу области
          */
         scrollToBottom: function() {
            var containerHeight = this._getScrollHeight();
            this.scrollTo(containerHeight);
         }

      });

      ScrollContainer.prototype.browserScrollSize = (function() {
         if(typeof window === 'undefined') {
            return;
         }
         var scrollbarWidth = null,
            outer;
         /**
          * В браузерах с поддержкой ::-webkit-scrollbar установлена ширина 0.
          * Определяем не с помощью Core/detection, потому что в нем считается, что chrome не на WebKit.
          */
         if (/AppleWebKit/.test(navigator.userAgent)) {
            scrollbarWidth = 0;
         } else if (detection.isMac) {
            scrollbarWidth = 15;
         } else if (detection.isIE12) {
            scrollbarWidth = 16;
         } else if (detection.isIE10 || detection.isIE11) {
            scrollbarWidth = 17;
         } else {
            outer = document.createElement('div');
            outer.className = 'forScrollBarMeasurement';
            document.body.appendChild(outer);
            scrollbarWidth = outer.offsetWidth - outer.clientWidth;
            document.body.removeChild(outer);
         }

         return scrollbarWidth;
      })();

      return ScrollContainer;
   }
);
