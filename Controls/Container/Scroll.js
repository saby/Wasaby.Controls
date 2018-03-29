define('Controls/Container/Scroll',
   [
      'Core/Control',
      'Core/detection',
      'Core/compatibility',
      'Controls/Container/Scroll/StateCalculationFunctions',
      'tmpl!Controls/Container/Scroll/Scroll',

      'Controls/Layout/Scroll',
      'Controls/Event/Emitter',
      'Controls/Container/resources/Scrollbar',
      'css!Controls/Container/Scroll/Scroll'
   ],
   function(Control, detection, compatibility, StateCalculationFunctions, template) {

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

            setScroll: function(self) {
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
             * Видимость полосы прокрутки.
             * @type {boolean}
             * @protected
             */
            _scrollbarVisible: false,
            /**
             * Смещение контента сверху относительно контейнера.
             * @type {number}
             * @protected
             */
            _scrollTop: 0,
            /**
             * Возможна ли прокрутка контента.
             * @type {boolean}
             * @protected
             */
            _hasScroll: null,
            /**
             * Наведен ли курсор на контейнер.
             * @type {boolean}
             * @protected
             */
            _hasHover: false,
            /**
             * Происходит ли в данный момент смещение контента через scrollbar.
             * @type {boolean}
             * @protected
             */
            _currentlyDragging: false,
            /**
             * Используется ли нативный скролл.
             * На мобильных устройствах используется нативный скролл, на других платформенный.
             * @type {boolean}
             * @protected
             */
            _useNativeScrollbar: detection.isMobileIOS || detection.isMobileAndroid,
            /**
             * Нужно ли показывать скролл при наведении.
             * @type {boolean}
             * @protected
             */
            _showScrollbarAtHover: true,

            _getScrollHeight: function() {
               return _private.getScrollHeight(this._children.content);
            },

            _calcShadowPosition: function() {
               var
                  scrollTop = _private.getScrollTop(this._children.content),
                  scrollHeight = _private.getScrollHeight(this._children.content),
                  containerHeight = _private.getContainerHeight(this._children.content);

               return _private.calcShadowPosition(scrollTop, containerHeight, scrollHeight);
            },

            _afterMount: function() {
               this._styleHideScrollbar = StateCalculationFunctions.calcStyleHideScrollbar();
               this._overflow = StateCalculationFunctions.calcOverflow(this._children.content);
               _private.setScroll(this);

               this._forceUpdate();
            },

            _afterUpdate: function() {
               if (_private.setScroll(this)) {
                  this._forceUpdate();
               }
            },

            _takeScrollbar: function(notify) {
               if (this._showScrollbarAtHover && this._hasScroll) {
                  this._hasHover = true;

                  if (notify) {
                     this._notify('takeScrollbar', [], {bubbling: true});
                  }
               }
            },

            _mouseenterHandler: function() {
               this._takeScrollbar(true);
            },

            _mouseleaveHandler: function() {
               if (this._hasHover) {
                  this._hasHover = false;
                  this._notify('returnScrollbar', [], {bubbling: true});
               }
            },

            _takeScrollbarHandler: function() {
               this._hasHover = false;
               this._showScrollbarAtHover = false;
            },

            _returnScrollbarHandler: function(event) {
               if (!this._showScrollbarAtHover) {
                  this._showScrollbarAtHover = true;
                  event.preventDefault();

                  this._takeScrollbar(false);
               }
            },

            _scrollbarDragHandler: function(event, drag) {
               this._currentlyDragging = drag;

               if (!drag) {
                  this._scrollTop = _private.getScrollTop(this._children.content);
               }
            },

            _scrollHandler: function() {
               if (!this._currentlyDragging) {
                  this._scrollTop = _private.getScrollTop(this._children.content);
               }
            },

            _resizeHandler: function(event, parentResize) {
               _private.setScroll(this);
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
