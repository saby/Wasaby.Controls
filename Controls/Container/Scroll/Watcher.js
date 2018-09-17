/**
 * Created by dv.zuev on 17.01.2018.
 * Компонент слушает события "снизу". События register и сохраняет Emmitterы в списке
 * то есть, кто-то снизу сможет услышать события верхних компонентов через это отношение
 */
define('Controls/Container/Scroll/Watcher',
   [
      'Core/Control',
      'wml!Controls/Container/Scroll/Watcher/Watcher',
      'Controls/Event/Registrar',
      'Core/detection'
   ],
   function(Control, template, Registrar, detection) {

      'use strict';

      var SCROLL_LOAD_OFFSET = 100;
      var global = (function() {
         return this || (0, eval)('this');
      })();

      var _private = {

         sendCanScroll: function(self, clientHeight, scrollHeight) {
            if (clientHeight < scrollHeight) {
               if (self._canScrollCache !== true) {
                  self._canScrollCache = true;
                  _private.start(self, 'canScroll');
               }
            } else {
               if (self._canScrollCache !== false) {
                  self._canScrollCache = false;
                  _private.start(self, 'cantScroll');
               }
            }
         },

         sendEdgePositions: function(self, clientHeight, scrollHeight, scrollTop) {
            //Проверка на триггеры начала/конца блока
            if (scrollTop <= 0) {
               _private.start(self, 'listTop', scrollTop);
            }
            if (scrollTop + clientHeight >= scrollHeight) {
               _private.start(self, 'listBottom', scrollTop);
            }

            //Проверка на триггеры загрузки
            if (scrollTop <= SCROLL_LOAD_OFFSET) {
               _private.start(self, 'loadTop', scrollTop);
            }
            if (scrollTop + clientHeight >= scrollHeight - SCROLL_LOAD_OFFSET) {
               _private.start(self, 'loadBottom', scrollTop);
            }
         },

         calcSizeCache: function(self, container) {
            var clientHeight, scrollHeight;

            clientHeight = container.clientHeight;
            scrollHeight = container.scrollHeight;
            self._sizeCache = {
               scrollHeight: scrollHeight,
               clientHeight: clientHeight
            };
         },

         onResizeContainer: function(self, container, withObserver) {
            _private.calcSizeCache(self, container);
            container.scrollTop = self._scrollTopCache;
            _private.sendCanScroll(self, self._sizeCache.clientHeight, self._sizeCache.scrollHeight);
            if (!withObserver) {
               _private.sendEdgePositions(self, self._sizeCache.clientHeight, self._sizeCache.scrollHeight, self._scrollTopCache);
            }

         },

         onScrollContainer: function(self, container, withObserver) {
            var curPosition;
            self._scrollTopCache = container.scrollTop;
            if (!self._sizeCache.clientHeight) {
               _private.calcSizeCache(self, container);
            }

            if (self._scrollTopCache <= 0) {
               curPosition = 'up';
            } else if (self._scrollTopCache + self._sizeCache.clientHeight >= self._sizeCache.scrollHeight) {
               curPosition = 'down';
            } else {
               curPosition = 'middle';
            }

            if (self._scrollPositionCache !== curPosition) {
               _private.start(self, 'scrollMove', {scrollTop: self._scrollTopCache, position: curPosition});
               if (!withObserver) {
                  _private.sendEdgePositions(self, self._sizeCache.clientHeight, self._sizeCache.scrollHeight, self._scrollTopCache);
               }
               self._scrollPositionCache = curPosition;
               self._scrollTopTimer = null;
            } else {
               if (!self._scrollTopTimer) {
                  self._scrollTopTimer = setTimeout(function() {
                     if (self._scrollTopTimer) {
                        _private.start(self, 'scrollMove', {scrollTop: self._scrollTopCache, position: curPosition});
                        if (!withObserver) {
                           _private.sendEdgePositions(self, self._sizeCache.clientHeight, self._sizeCache.scrollHeight, self._scrollTopCache);
                        }
                        self._scrollTopTimer = null;
                     }
                  }, 100);
               }
            }

         },

         initIntersectionObserver: function(self, elements) {
            self._observer = new IntersectionObserver(function(changes) {
               for (var i = 0; i < changes.length; i++) {
                  if (changes[i].isIntersecting) {
                     switch (changes[i].target) {
                        case elements.topLoadTrigger:
                           _private.start(self, 'loadTop');
                           break;
                        case elements.bottomLoadTrigger:
                           _private.start(self, 'loadBottom');
                           break;
                        case elements.topListTrigger:
                           _private.start(self, 'listTop');
                           break;
                        case elements.bottomListTrigger:
                           _private.start(self, 'listBottom');
                           break;
                     }
                  }
               }
            }, {});
            self._observer.observe(elements.topLoadTrigger);
            self._observer.observe(elements.bottomLoadTrigger);

            self._observer.observe(elements.topListTrigger);
            self._observer.observe(elements.bottomListTrigger);
         },

         onRegisterNewComponent: function(self, container, component, withObserver) {
            if (!self._sizeCache.clientHeight) {
               _private.calcSizeCache(self, container);
            }
            if (self._sizeCache.clientHeight <= self._sizeCache.scrollHeight) {
               self._registrar.startOnceTarget(component, 'cantScroll');
            } else {
               self._registrar.startOnceTarget(component, 'canScroll');
            }

            if (!withObserver) {
               //TODO надо кидать не всем компонентам, а адресно одному
               _private.sendEdgePositions(self, self._sizeCache.clientHeight, self._sizeCache.scrollHeight, self._scrollTopCache);
            }
         },

         doScroll: function(self, scrollParam, container) {
            if (scrollParam === 'top') {
               container.scrollTop = 0;
            } else {
               var clientHeight = self._sizeCache.clientHeight, scrollHeight;
               if (scrollParam === 'bottom') {
                  scrollHeight = self._sizeCache.scrollHeight;
                  container.scrollTop = scrollHeight - clientHeight;
               } else {
                  if (scrollParam === 'pageUp') {
                     container.scrollTop -= clientHeight;
                  } else {
                     container.scrollTop += clientHeight;
                  }
               }
            }
         },


         start: function(self, eventType, params) {
            self._registrar.start(eventType, params);
            self._notify(eventType, [params]);
         }
      };

      var Scroll = Control.extend({
         _template: template,
         _observer: null,
         _registrar: null,
         _sizeCache: null,
         _scrollTopCache: 0,
         _scrollTopTimer: null,
         _scrollPositionCache: null,
         _canScrollCache: null,

         constructor: function() {
            Scroll.superclass.constructor.apply(this, arguments);
            this._sizeCache = {};
         },

         _beforeMount: function() {
            this._registrar = new Registrar({register: 'listScroll'});
         },

         _afterMount: function() {
            _private.calcSizeCache(this, this._container);
            _private.sendCanScroll(this, this._sizeCache.clientHeight, this._sizeCache.scrollHeight);
            this._notify('register', ['controlResize', this, this._resizeHandler], {bubbling: true});
         },


         _scrollHandler: function(e) {
            _private.onScrollContainer(this, this._container, !!this._observer);
         },

         //TODO force - костыль для Controls/Container/Suggest/Layout/Dialog
         _resizeHandler: function(force) {
            _private.onResizeContainer(this, this._container, force !== undefined ? false : !!this._observer);
         },

         _registerIt: function(event, registerType, component, callback, triggers) {
            if (registerType === 'listScroll') {
               this._registrar.register(event, component, callback);

               //IntersectionObserver doesn't work correctly in Edge and Firefox
               //https://online.sbis.ru/opendoc.html?guid=aa514bbc-c5ac-40f7-81d4-50ba55f8e29d
               if (global && global.IntersectionObserver && triggers && !detection.isIE12 && !detection.firefox) {
                  if (!this._observer) {
                     _private.initIntersectionObserver(this, triggers);
                  }
               }

               _private.onRegisterNewComponent(this, this._container, component, !!this._observer);
            }
         },

         _doScrollHandler: function(e, scrollParam) {
            _private.doScroll(this, scrollParam, this._container);
         },

         doScroll: function(scrollParam) {
            _private.doScroll(this, scrollParam, this._container);
         },

         _unRegisterIt: function(event, registerType, component) {
            if (registerType === 'listScroll') {
               this._registrar.unregister(event, component);
            }
         },

         _beforeUnmount: function() {
            if (this._observer) {
               this._observer.disconnect();
               this._observer = null;
            }
            this._notify('unregister', ['controlResize', this], {bubbling: true});
            this._registrar.destroy();
            this._sizeCache = null;
         }
      });

      Scroll.getOptionTypes = function() {
         return {

         };
      };

      //для тестов
      Scroll._private = _private;

      return Scroll;
   }
);
