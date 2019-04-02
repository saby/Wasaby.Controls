define('Controls/Container/Scroll',
   [
      'Core/Control',
      'Core/Deferred',
      'Env/Env',
      'Core/core-clone',
      'Core/helpers/Object/isEqual',
      'Controls/Container/Scroll/Context',
      'Controls/StickyHeader/Context',
      'Controls/StickyHeader/Utils',
      'Controls/Container/Scroll/ScrollWidthUtil',
      'Controls/Container/Scroll/ScrollHeightFixUtil',
      'wml!Controls/Container/Scroll/Scroll',
      'Controls/Utils/tmplNotify',
      'Controls/Container/Scroll/Watcher',
      'Controls/Event/Listener',
      'Controls/Container/Scroll/Scrollbar',
      'css!theme?Controls/Container/Scroll/Scroll'
   ],
   function(Control, Deferred, Env, cClone, isEqual, ScrollData, StickyHeaderContext, stickyHeaderUtils, ScrollWidthUtil, ScrollHeightFixUtil, template, tmplNotify) {

      'use strict';

      /**
       * Container with thin scrollbar.
       * For the component, a {@link Controls/Container/Scroll/Context context} is required.
       *
       * @class Controls/Container/Scroll
       * @extends Core/Control
       * @control
       * @public
       * @author Журавлев М.С.
       * @category Container
       * @demo Controls-demo/Container/Scroll
       *
       */

      /**
       * @event scroll Scrolling content.
       * @param {SyntheticEvent} eventObject.
       * @param {Number} scrollTop Top position of content relative to container.
       */

      /**
       * @name Controls/Container/Scroll#content
       * @cfg {Content} Container contents.
       */

      /**
       * @name Controls/Container/Scroll#shadowVisible
       * @cfg {Boolean} Whether shadow should be shown (when content doesn't fit).
       */

      /**
       * @name Controls/Container/Scroll#scrollbarVisible
       * @cfg {Boolean} Whether scrollbar should be shown.
       */

      /**
       * @name Controls/Container/Scroll#style
       * @cfg {String} Color scheme (colors of the shadow and scrollbar).
       * @variant normal Default theme (for bright backgrounds).
       * @variant inverted Inverted theme (for dark backgrounds).
       */
      var
         _private = {

            /**
             * Получить расположение тени внутри контейнера в зависимости от прокрутки контента.
             * @return {String}
             */
            calcShadowPosition: function(scrollTop, containerHeight, scrollHeight) {
               var shadowPosition = '';

               if (scrollTop > 0) {
                  shadowPosition += 'top';
               }

               // Compare with 1 to prevent rounding errors in the scale do not equal 100%
               if (scrollHeight - containerHeight - scrollTop >= 1) {
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

            setScrollTop: function(self, scrollTop) {
               self._children.content.scrollTop = scrollTop;
               self._scrollTop = scrollTop;
               self._notify('scroll', [scrollTop]);
            },

            calcHasScroll: function(self) {
               var
                  scrollHeight = _private.getScrollHeight(self._children.content),
                  containerHeight = _private.getContainerHeight(self._children.content);

               /**
                * In IE, if the content has a rational height, the height is rounded to the smaller side,
                * and the scrollable height to the larger side. Reduce the scrollable height to the real.
                */
               if (Env.detection.isIE) {
                  scrollHeight--;
               }

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
               self._displayState.heightFix = displayState.heightFix;
               self._displayState.contentHeight = displayState.contentHeight;
               self._displayState.shadowPosition = displayState.shadowPosition;
            },

            /**
             * Update information about the fixation state.
             * @param {Controls/StickyHeader/Types/InformationFixationEvent.typedef} data Data about the header that changed the fixation state.
             */
            updateFixationState: function(self, data) {
               if (!!data.fixedPosition) {
                  self._stickyHeadersIds[data.fixedPosition].push(data.id);
                  if (data.mode === 'stackable') {
                     self._stickyHeadersHeight[data.fixedPosition] += data.offsetHeight;
                  }
               } else if (!!data.prevPosition && self._stickyHeadersIds[data.prevPosition].indexOf(data.id) !== -1) {
                  self._stickyHeadersIds[data.prevPosition].splice(self._stickyHeadersIds[data.prevPosition].indexOf(data.id), 1);
                  if (data.mode === 'stackable') {
                     self._stickyHeadersHeight[data.prevPosition] -= data.offsetHeight;
                  }
               }
            }
         },
         Scroll = Control.extend({
            _template: template,

            //Т.к. в VDOM'e сейчас нет возможности сделать компонент прозрачным для событий
            //Или же просто проксирующий события выше по иерархии, то необходимые событие с контента просто пока
            //прокидываем руками
            //EVENTSPROXY
            _tmplNotify: tmplNotify,

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

            _pagingState: null,

            _registeredHeadersIds: null,

            /**
             * @type {Object|null}
             * @private
             */
            _stickyHeadersIds: null,
            _stickyHeadersHeight: null,

            /**
             * @type {Controls/StickyHeader/Context|null}
             * @private
             */
            _stickyHeaderContext: null,

            _isStickyInEdge: null,

            constructor: function(cfg) {
               Scroll.superclass.constructor.call(this, cfg);
               this._isStickyInEdge = stickyHeaderUtils.isStickySupport() && Env.detection.isIE;
            },

            _beforeMount: function(options, context, receivedState) {
               var
                  self = this,
                  def;

               this._registeredHeadersIds = [];
               this._stickyHeadersIds = {
                  top: [],
                  bottom: []
               };
               this._stickyHeadersHeight = {
                  top: 0,
                  bottom: 0
               };
               this._displayState = {};
               this._stickyHeaderContext = new StickyHeaderContext({
                  shadowPosition: options.shadowVisible ? 'bottom' : ''
               });

               if (context.ScrollData && context.ScrollData.pagingVisible) {
                  this._pagingState = {
                     visible: true,
                     stateUp: 'disabled',
                     stateDown: 'normal'
                  };
               } else {
                  this._pagingState = {};
               }

               if (receivedState) {
                  _private.updateDisplayState(this, receivedState.displayState);
                  this._styleHideScrollbar = receivedState.styleHideScrollbar || ScrollWidthUtil.calcStyleHideScrollbar();
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
                        useNativeScrollbar = Env.detection.isMobileIOS || Env.detection.isMobileAndroid;

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

                  // При построении на клиенте не возвращаем def, т.к. используется в старых компонентах
                  // и там ассинхронного построения
                  if (typeof window === 'undefined') {
                     return def;
                  }
               }
            },

            _afterMount: function() {
               /**
                * Для определения heightFix и styleHideScrollbar может требоваться DOM, поэтому проверим
                * смогли ли мы в beforeMount их определить.
                */
               var needUpdate = false, calculatedOptionValue;

               if (typeof this._displayState.heightFix === 'undefined') {
                  this._displayState.heightFix = ScrollHeightFixUtil.calcHeightFix(this._children.content);
                  needUpdate = true;
               }

               /**
                * The following states cannot be defined in _beforeMount because the DOM is needed.
                */

               calculatedOptionValue = _private.calcHasScroll(this);
               if (calculatedOptionValue) {
                  this._displayState.hasScroll = calculatedOptionValue;
                  needUpdate = true;
               }

               this._displayState.contentHeight = _private.getContentHeight(this);

               calculatedOptionValue = _private.getShadowPosition(this);
               if (calculatedOptionValue) {
                  this._displayState.shadowPosition = calculatedOptionValue;
                  needUpdate = true;
               }

               this._updateStickyHeaderContext();
               this._adjustContentMarginsForBlockRender();

               // Create a scroll container with a "overflow-scrolling: auto" style and then set
               // "overflow-scrolling: touch" style. Otherwise, after switching on the overflow-scrolling: auto,
               // the page will scroll entirely. This solution fixes the problem, but in the old controls the container
               // was created with "overflow-scrolling: touch" style style.
               // A task has been created to investigate the problem more.
               // https://online.sbis.ru/opendoc.html?guid=1c9b807c-41ab-4fbf-9f22-bf8b9fcbdc8d
               if (Env.detection.isMobileIOS) {
                  this._overflowScrolling = true;
                  needUpdate = true;
               }

               if (needUpdate) {
                  this._forceUpdate();
               }
            },

            _beforeUpdate: function(options, context) {
               this._pagingState.visible = context.ScrollData && context.ScrollData.pagingVisible && this._displayState.hasScroll;
               this._updateStickyHeaderContext(options.shadowVisible);
            },

            _afterUpdate: function() {
               var displayState = _private.calcDisplayState(this);

               if (!isEqual(this._displayState, displayState)) {
                  this._displayState = displayState;
                  this._updateStickyHeaderContext();

                  this._forceUpdate();
               }
            },

            _shadowVisible: function(position) {
               return this._displayState.shadowPosition.indexOf(position) !== -1 && this._stickyHeadersIds[position].length === 0;
            },

            /**
             * Если используем верстку блоков, то на content появится margin-right.
             * Его нужно добавить к margin-right для скрытия нативного скролла.
             * TODO: метод нужно порефакторить. Делаем для сдачи в план, в 600 будет переработано.
             * https://online.sbis.ru/opendoc.html?guid=0cb8e81e-ba7f-4f98-8384-aa52d200f8c8
             */
            _adjustContentMarginsForBlockRender: function() {
               var computedStyle = getComputedStyle(this._children.content);
               var marginTop = parseInt(computedStyle.marginTop, 10);
               var marginRight = parseInt(computedStyle.marginRight, 10);

               this._contentStyles = this._styleHideScrollbar.replace(/-?\d+/g, function(found) {
                  return parseInt(found, 10) + marginRight;
               });

               if (this._stickyHeaderContext.top !== -marginTop) {
                  this._stickyHeaderContext.top = -marginTop;
                  this._stickyHeaderContext.updateConsumers();
               }
            },

            _resizeHandler: function() {
               this._displayState = _private.calcDisplayState(this);
            },

            _scrollHandler: function(ev) {
               if (!this._dragging) {
                  this._scrollTop = _private.getScrollTop(this._children.content);
                  this._notify('scroll', [this._scrollTop]);
               }
               this._children.scrollDetect.start(ev);
            },

            _scrollbarTaken: function() {
               if (this._showScrollbarOnHover && this._displayState.hasScroll) {
                  this._notify('scrollbarTaken', [], {bubbling: true});
               }
            },

            _arrowClickHandler: function(event, btnName) {
               var scrollParam;

               switch (btnName) {
                  case 'Begin':
                     scrollParam = 'top';
                     break;
                  case 'End':
                     scrollParam = 'bottom';
                     break;
                  case 'Prev':
                     scrollParam = 'pageUp';
                     break;
                  case 'Next':
                     scrollParam = 'pageDown';
                     break;
               }

               this._children.scrollWatcher.doScroll(scrollParam);
            },

            _scrollMoveHandler: function(e, scrollData) {
               if (scrollData.position === 'up') {
                  this._pagingState.stateUp = 'disabled';
                  this._pagingState.stateDown = 'normal';
               } else if (scrollData.position === 'down') {
                  this._pagingState.stateUp = 'normal';
                  this._pagingState.stateDown = 'disabled';
               } else {
                  this._pagingState.stateUp = 'normal';
                  this._pagingState.stateDown = 'normal';
               }
            },

            _mouseenterHandler: function(event) {
               this._scrollbarTaken(true);
            },

            _mouseleaveHandler: function(event) {
               if (this._showScrollbarOnHover) {
                  this._notify('scrollbarReleased', [], {bubbling: true});
               }
            },

            _scrollbarTakenHandler: function() {
               this._showScrollbarOnHover = false;
            },

            _scrollbarReleasedHandler: function(event) {
               if (!this._showScrollbarOnHover) {
                  this._showScrollbarOnHover = true;
                  event.preventDefault();
               }
            },

            _scrollbarVisibility: function() {
               return Boolean(!this._useNativeScrollbar && this._options.scrollbarVisible && this._displayState.hasScroll && this._showScrollbarOnHover);
            },

            /**
             * TODO: убрать после выполнения https://online.sbis.ru/opendoc.html?guid=93779c1a-8d18-42fe-8dc8-1bab779d0943.
             * Переделать на bind в шаблоне и избавится от прокидывания опций.
             */
            _positionChangedHandler: function(event, position) {
               _private.setScrollTop(this, position);
            },

            _draggingChangedHandler: function(event, dragging) {
               this._dragging = dragging;
            },

            /**
             * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} event
             * @param {Controls/StickyHeader/Types/InformationFixationEvent.typedef} fixedHeaderData
             * @private
             */
            _fixedHandler: function(event, fixedHeaderData) {
               _private.updateFixationState(this, fixedHeaderData);

               // If the header is single, then it makes no sense to send notifications.
               // Thus, we prevent unnecessary force updates on receiving messages.
               if (this._registeredHeadersIds.length < 2) {
                  return;
               }
               this._children.stickyHeaderShadow.start([this._stickyHeadersIds.top[this._stickyHeadersIds.top.length - 1], this._stickyHeadersIds.bottom[this._stickyHeadersIds.bottom.length - 1]]);

               //Clone the object, because in the future we will change it and without cloning, the changes will be propagated by reference.
               this._children.stickyHeaderHeight.start(cClone(this._stickyHeadersHeight));

               event.stopPropagation();
            },

            _stickyRegisterHandler: function(event, stickyId, register) {
               var index = this._registeredHeadersIds.indexOf(stickyId);
               event.blockUpdate = true;
               if (register && index === -1) {
                  this._registeredHeadersIds.push(stickyId);
               } else if (!register && index !== -1) {
                  this._registeredHeadersIds.splice(index, 1);
               }
            },

            /**
             * Update the context value of sticky header.
             * TODO: Плохой метод. Дублирование tmpl и вызов должен только в методе изменения видимости тени. Будет поправлено по https://online.sbis.ru/opendoc.html?guid=01c0fb63-9121-4ee4-a652-fe9c329eec8f
             * @param shadowVisible
             * @private
             */
            _updateStickyHeaderContext: function(shadowVisible) {
               var shadowPosition = '';

               if ((shadowVisible || this._options.shadowVisible) && this._displayState.hasScroll) {
                  shadowPosition = this._displayState.shadowPosition;
               }

               if (this._stickyHeaderContext.shadowPosition !== shadowPosition) {
                  this._stickyHeaderContext.shadowPosition = shadowPosition;
                  this._stickyHeaderContext.updateConsumers();
               }
            },

            _getChildContext: function() {
               return {
                  stickyHeader: this._stickyHeaderContext
               };
            },

            getDataId: function() {
               return 'Controls/Container/Scroll';
            },

            /**
             * Scrolls to the given position from the top of the container.
             * @param {Number} offset
             */
            scrollTo: function(offset) {
               _private.setScrollTop(this, offset);
            },

            /**
             * Scrolls to the top of the container.
             */
            scrollToTop: function() {
               _private.setScrollTop(this, 0);
            },

            /**
             * Scrolls to the bottom of the container.
             */
            scrollToBottom: function() {
               _private.setScrollTop(this, _private.getScrollHeight(this._children.content));
            },

            // TODO: система событий неправильно прокидывает аргументы из шаблонов, будет исправлено тут:
            // https://online.sbis.ru/opendoc.html?guid=19d6ff31-3912-4d11-976f-40f7e205e90a
            selectedKeysChanged: function(event) {
               // Forwarding bubbling events makes no sense.
               if (!event.propagating()) {
                  var args = Array.prototype.slice.call(arguments, 1);
                  this._notify('selectedKeysChanged', args);
               }
            },

            excludedKeysChanged: function(event) {
               // Forwarding bubbling events makes no sense.
               if (!event.propagating()) {
                  var args = Array.prototype.slice.call(arguments, 1);
                  this._notify('excludedKeysChanged', args);
               }
            },

            _saveScrollPosition: function(e) {
               /**
                * Only closest scroll container should react to this event, so we have to stop propagation here.
                * Otherwise we can accidentally scroll a wrong element.
                */
               e.stopPropagation();
               this._savedScrollPosition = this._children.content.scrollHeight;
            },

            _restoreScrollPosition: function(e) {
               /**
                * Only closest scroll container should react to this event, so we have to stop propagation here.
                * Otherwise we can accidentally scroll a wrong element.
                */
               e.stopPropagation();
               this._children.content.scrollTop = this._children.content.scrollHeight - this._savedScrollPosition;
            }
         });

      Scroll.getDefaultOptions = function() {
         return {
            shadowVisible: true,
            scrollbarVisible: true
         };
      };

      Scroll.contextTypes = function() {
         return {
            ScrollData: ScrollData
         };
      };

      Scroll._private = _private;

      return Scroll;
   }
);
