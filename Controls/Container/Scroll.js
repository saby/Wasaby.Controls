define('Controls/Container/Scroll',
   [
      'Core/Control',
      'Core/detection',
      'Controls/Container/Scroll/ScrollWidthUtil',
      'Controls/Container/Scroll/ScrollOverflowUtil',
      'tmpl!Controls/Container/Scroll/Scroll',

      'Controls/Layout/Scroll',
      'Controls/Event/Emitter',
      'Controls/Container/Scroll/Scrollbar',
      'css!Controls/Container/Scroll/Scroll'
   ],
   function(Control, detection, ScrollWidthUtil, ScrollOverflowUtil, template) {

      'use strict';

      /**
       * Компонент - контейнер с узкой стилизованной полосой скролла.
       * @class Controls/Container/Scroll
       * @extends Core/Control
       * @control
       * @public
       * @category Container
       *
       * @name Controls/Container/Scroll#content
       * @cfg {Content} Содержимое контейнера
       *
       * @name Controls/Container/Scroll#shadowVisible
       * @cfg {Boolean} Наличие тени при прокрутке контента
       *
       * @name Controls/Container/Scroll#scrollbarVisible
       * @cfg {Boolean} Наличие полосы прокрутки
       *
       * @name Controls/Container/Scroll#style
       * @cfg {String} Цветовая схема контейнера. Влияет на цвет тени и полоски скролла. Используется для того чтобы контейнер корректно отображался как на светлом так и на темном фоне.
       * @variant normal стандартная схема
       * @variant opposite противоположная схема
       */
      var
         _private = {
            calcShadowPosition: function(scrollTop, containerHeight, scrollHeight) {
               var shadowPosition = '';

               if (scrollTop) {
                  shadowPosition += '_top';
               }
               if (scrollHeight - containerHeight - scrollTop) {
                  shadowPosition += '_bottom';
               }

               return shadowPosition;
            },

            getScrollHeight: function(container) {
               return container.scrollHeight;
            },

            getContainerHeight: function(container) {
               return container.offsetHeight;
            },

            getScrollTop: function(container) {
               return container.scrollTop;
            },

            setHasScroll: function(self) {
               var
                  scrollHeight = _private.getScrollHeight(self._children.content),
                  containerHeight = _private.getContainerHeight(self._children.content),
                  hasScroll = scrollHeight > containerHeight;

               if (self._hasScroll === hasScroll) {
                  return false;
               } else {
                  self._hasScroll = hasScroll;

                  return true;
               }
            }
         },
         Scroll = Control.extend({
            _template: template,
            /**
             * Смещение контента сверху относительно контейнера.
             * @type {number}
             */
            _scrollTop: 0,
            /**
             * Возможна ли прокрутка контента.
             * @type {boolean}
             */
            _hasScroll: null,
            /**
             * Наведен ли курсор на контейнер.
             * @type {boolean}
             */
            _hasHover: false,
            /**
             * Происходит ли в данный момент смещение контента через scrollbar.
             * @type {boolean}
             */
            _dragging: false,
            /**
             * Используется ли нативный скролл.
             * На мобильных устройствах используется нативный скролл, на других платформенный.
             * @type {boolean}
             */
            _useNativeScrollbar: detection.isMobileIOS || detection.isMobileAndroid || detection.isMac,
            /**
             * Нужно ли показывать скролл при наведении.
             * @type {boolean}
             */
            _showScrollbarOnHover: true,

            _afterMount: function() {
               this._styleHideScrollbar = ScrollWidthUtil.calcStyleHideScrollbar();
               this._overflow = ScrollOverflowUtil.calcOverflow(this._children.content);
               _private.setHasScroll(this);

               this._forceUpdate();
            },

            _afterUpdate: function() {
               if (_private.setHasScroll(this)) {
                  this._forceUpdate();
               }
            },

            _getScrollHeight: function() {
               return _private.getScrollHeight(this._children.content);
            },

            /**
             * Получить расположение тени внутри контейнера в зависимости от прокрутки контента.
             * @return {String}
             */
            _getShadowPosition: function() {
               var
                  scrollTop = _private.getScrollTop(this._children.content),
                  scrollHeight = _private.getScrollHeight(this._children.content),
                  containerHeight = _private.getContainerHeight(this._children.content);

               return _private.calcShadowPosition(scrollTop, containerHeight, scrollHeight);
            },

            _scrollbarTaken: function(notify) {
               if (this._showScrollbarOnHover && this._hasScroll) {
                  this._hasHover = true;

                  if (notify) {
                     this._notify('scrollbarTaken', [], {bubbling: true});
                  }
               }
            },

            _mouseenterHandler: function() {
               this._scrollbarTaken(true);
            },

            _mouseleaveHandler: function() {
               if (this._hasHover) {
                  this._hasHover = false;
                  this._notify('scrollbarReleased', [], {bubbling: true});
               }
            },

            _scrollbarTakenHandler: function() {
               this._hasHover = false;
               this._showScrollbarOnHover = false;
            },

            _scrollbarReleasedHandler: function(event) {
               if (!this._showScrollbarOnHover) {
                  this._showScrollbarOnHover = true;
                  event.preventDefault();

                  this._scrollbarTaken(false)
               }
            },

            _scrollbarDragHandler: function(event, drag) {
               this._dragging = drag;

               if (!drag) {
                  this._scrollTop = _private.getScrollTop(this._children.content);
               }
            },

            _scrollHandler: function() {
               if (!this._dragging) {
                  this._scrollTop = _private.getScrollTop(this._children.content);
               }
            },

            _resizeHandler: function() {
               _private.setHasScroll(this);
            },

            _positionChangedHandler: function(event, position) {
               this.scrollTo(position);
            },

            /**
             * Осуществить скролл на заданную величину в пикселях
             * @param {Number} offset
             */
            scrollTo: function(offset) {
               this._children.content.scrollTop = offset;
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
               this.scrollTo(_private.getScrollHeight(this._children.content));
            }
         });

      Scroll.getDefaultOptions = function() {
         return {
            style: 'normal',
            shadowVisible: true,
            scrollbarVisible: true
         }
      };

      Scroll._private = _private;

      return Scroll;
   }
);
