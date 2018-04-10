define('Controls/Container/Scroll',
   [
      'Core/Control',
      'Core/Deferred',
      'Core/detection',
      'Core/helpers/Object/isEqual',
      'Controls/Container/Scroll/ScrollWidthUtil',
      'Controls/Container/Scroll/ScrollHeightFixUtil',
      'tmpl!Controls/Container/Scroll/Scroll',

      'Controls/Layout/Scroll',
      'Controls/Event/Emitter',
      'Controls/Container/Scroll/Scrollbar',
      'css!Controls/Container/Scroll/Scroll'
   ],
   function(Control, Deferred, detection, isEqual, ScrollWidthUtil, ScrollHeightFixUtil, template) {

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
       * @variant inverted противоположная схема
       */
      var
         _private = {

            /**
             * Получить расположение тени внутри контейнера в зависимости от прокрутки контента.
             * @return {String}
             */
            calcShadowPosition: function(scrollTop, containerHeight, scrollHeight) {
               var shadowPosition = '';

               if (scrollTop) {
                  shadowPosition += 'top';
               }
               if (scrollHeight - containerHeight - scrollTop) {
                  shadowPosition += 'bottom';
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

            calcHasScroll: function(self) {
               var
                  scrollHeight = _private.getScrollHeight(self._children.content),
                  containerHeight = _private.getContainerHeight(self._children.content);

               return scrollHeight > containerHeight;
            },

            getContentHeight: function(self) {
               return _private.getScrollHeight(self._children.content);
            },

            getShadowPosition: function(self) {
               var
                  scrollTop = _private.getScrollTop(self._children.content),
                  scrollHeight = _private.getScrollHeight(self._children.content),
                  containerHeight = _private.getContainerHeight(self._children.content);

               return _private.calcShadowPosition(scrollTop, containerHeight, scrollHeight);
            },

            calcHeightFix: function(self) {
               return ScrollHeightFixUtil.calcHeightFix(self._children.content);
            },

            calcDisplayState: function(self) {
               return {
                  heightFix: _private.calcHeightFix(self),
                  hasScroll: _private.calcHasScroll(self),
                  contentHeight: _private.getContentHeight(self),
                  shadowPosition: _private.getShadowPosition(self)
               };
            },

            updateDisplayState: function(self, displayState) {
               self._displayState.hasScroll = displayState.hasScroll;
               self._displayState.heightFix = displayState.haheightFixsScroll;
               self._displayState.contentHeight = displayState.contentHeight;
               self._displayState.shadowPosition = displayState.shadowPosition;
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
             * Нужно ли показывать скролл при наведении.
             * @type {boolean}
             */
            _showScrollbarOnHover: true,

            /**
             * Наведен ли курсор на контейнер.
             * @type {boolean}
             */
            _hasHover: false,

            /**
             * Используется ли нативный скролл.
             * @type {boolean}
             */
            _useNativeScrollbar: null,

            _displayState: null,

            _beforeMount: function(options, context, receivedState) {
               var
                  self = this,
                  def;

               this._displayState = {};

               if (receivedState) {
                  _private.updateDisplayState(this, receivedState.displayState);
                  this._styleHideScrollbar = receivedState.styleHideScrollbar;
                  this._useNativeScrollbar = receivedState.useNativeScrollbar;
               } else {
                  def = new Deferred();

                  def.addCallback(function() {
                     var
                        displayState = {
                           heightFix: ScrollHeightFixUtil.calcHeightFix()
                        },
                        styleHideScrollbar = ScrollWidthUtil.calcStyleHideScrollbar(),

                        // На мобильных устройствах используется нативный скролл, на других платформенный.
                        useNativeScrollbar = detection.isMobileIOS || detection.isMobileAndroid || detection.isMac;

                     _private.updateDisplayState(self, displayState);
                     self._styleHideScrollbar = styleHideScrollbar;
                     self._useNativeScrollbar = useNativeScrollbar;

                     return {
                        displayState: displayState,
                        styleHideScrollbar: styleHideScrollbar,
                        useNativeScrollbar: useNativeScrollbar
                     };
                  });

                  def.callback();

                  return def;
               }
            },

            _afterMount: function() {
               /**
                * Для определения heightFix и styleHideScrollbar может требоваться DOM, поэтому проверим
                * смогли ли мы в beforeMount их определить.
                */
               if (typeof this._displayState.heightFix === 'undefined') {
                  this._displayState.heightFix = ScrollHeightFixUtil.calcHeightFix(this._children.content);

                  this._forceUpdate();
               }
               if (typeof this._styleHideScrollbar === 'undefined') {
                  this._styleHideScrollbar = ScrollWidthUtil.calcStyleHideScrollbar();

                  this._forceUpdate();
               }
            },

            _afterUpdate: function() {
               var displayState = _private.calcDisplayState(this);

               this._children.content.scrollTop = this._scrollTop;

               if (!isEqual(this._displayState, displayState)) {
                  this._displayState = displayState;
                  this._forceUpdate();
               }
            },

            _resizeHandler: function() {
               this._displayState = _private.calcDisplayState(this);
            },

            _scrollHandler: function() {
               if (!this._dragging) {
                  this._scrollTop = _private.getScrollTop(this._children.content);
               }
            },

            _scrollbarTaken: function(notify) {
               if (this._showScrollbarOnHover && this._displayState.hasScroll) {
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

                  this._scrollbarTaken(false);
               }
            },

            /**
             * TODO: убрать после выполнения https://online.sbis.ru/opendoc.html?guid=93779c1a-8d18-42fe-8dc8-1bab779d0943.
             * Переделать на bind в шаблоне и избавится от прокидывания опций.
             */
            _positionChangedHandler: function(event, position) {
               this._scrollTop = position;
            },

            _draggingChangedHandler: function(event, dragging) {
               this._dragging = dragging;
            },

            getDataId: function() {
               return 'ControlsContainerScroll';
            },

            /**
             * Осуществить скролл на заданную величину в пикселях
             * @param {Number} offset
             */
            scrollTo: function(offset) {
               this._scrollTop = offset;
            },

            /**
             * Осуществить скролл к верху области
             */
            scrollToTop: function() {
               this._scrollTop = 0;
            },

            /**
             * Осуществить скролл к низу области
             */
            scrollToBottom: function() {
               this._scrollTop = _private.getScrollHeight(this._children.content);
            }
         });

      Scroll.getDefaultOptions = function() {
         return {
            style: 'normal',
            shadowVisible: true,
            scrollbarVisible: true
         };
      };

      Scroll._private = _private;

      return Scroll;
   }
);
