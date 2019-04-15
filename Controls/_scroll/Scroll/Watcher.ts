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
      'Env/Env',
      'Core/helpers/Object/isEmpty'
   ],
   function(Control, template, Registrar, Env, isEmpty) {

      'use strict';

      var SCROLL_LOAD_OFFSET = 100;
      var global = (function() {
         return this || (0, eval)('this');
      })();

      var _private = {

         getDOMContainer: function(element) {
            //TODO https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            if (element.get) {
               return element.get(0);
            }
            return element;
         },

         sendCanScroll: function(self, clientHeight, scrollHeight) {
            var eventName;
            if (clientHeight < scrollHeight) {
               if (self._canScrollCache !== true) {
                  self._canScrollCache = true;
                  eventName = 'canScroll';
               }
            } else {
               if (self._canScrollCache !== false) {
                  self._canScrollCache = false;
                  eventName = 'cantScroll';
               }
            }
            if (eventName) {
               _private.sendByRegistrar(self, eventName);
            }
         },

         sendEdgePositions: function(self, clientHeight, scrollHeight, scrollTop) {
            var eventNames = [], i;

            //Проверка на триггеры начала/конца блока
            if (scrollTop <= 0) {
               eventNames.push('listTop');
            }
            if (scrollTop + clientHeight >= scrollHeight) {
               eventNames.push('listBottom');
            }

            //Проверка на триггеры загрузки
            if (scrollTop <= SCROLL_LOAD_OFFSET) {
               eventNames.push('loadTopStart');
            } else {
               eventNames.push('loadTopStop');
            }
            if (scrollTop + clientHeight >= scrollHeight - SCROLL_LOAD_OFFSET) {
               eventNames.push('loadBottomStart');
            } else {
               eventNames.push('loadBottomStop');
            }

            for (i = 0; i < eventNames.length; i++) {
               _private.sendByRegistrar(self, eventNames[i], scrollTop);
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
         
         getSizeCache: function(self, container) {
            if (isEmpty(self._sizeCache)) {
               _private.calcSizeCache(self, container);
            }
            return self._sizeCache;
         },

         onResizeContainer: function(self, container, withObserver) {
            var scrollCompensation = 0;
            var sizeCache = _private.getSizeCache(self, container);
            if (self._needCompensation) {
               var prevHeight = sizeCache.scrollHeight;
               var curHeight = container.scrollHeight;

               if (self._scrollTopCache < (curHeight - prevHeight)) {
                  scrollCompensation = curHeight - prevHeight;
               }
            }
            _private.calcSizeCache(self, container);
            sizeCache = _private.getSizeCache(self, container);
            container.scrollTop = self._scrollTopCache;
            _private.sendCanScroll(self, sizeCache.clientHeight, sizeCache.scrollHeight);
            if (!withObserver) {
               if (scrollCompensation) {
                  container.scrollTop += scrollCompensation;

                  //TODO https://online.sbis.ru/opendoc.html?guid=0fb7a3a6-a05d-4eb3-a45a-c76cbbddb16f
                  //если была компенсация скролла, то следующую проверку необходимости надо звать по таймауту, чтоб подскролл точно успел пройти
                  window.setTimeout(function() {
                     _private.sendEdgePositions(self, sizeCache.clientHeight, sizeCache.scrollHeight, self._scrollTopCache);
                  }, 60);
               } else {
                  _private.sendEdgePositions(self, sizeCache.clientHeight, sizeCache.scrollHeight, self._scrollTopCache);
               }
            }

         },

         onScrollContainer: function(self, container, withObserver) {
            var curPosition;
            var sizeCache = _private.getSizeCache(self, container);
            self._scrollTopCache = container.scrollTop;
            if (!sizeCache.clientHeight) {
               _private.calcSizeCache(self, container);
               sizeCache = _private.getSizeCache(self, container);
            }

            if (self._scrollTopCache <= 0) {
               curPosition = 'up';
            } else if (self._scrollTopCache + sizeCache.clientHeight >= sizeCache.scrollHeight) {
               curPosition = 'down';
            } else {
               curPosition = 'middle';
            }

            if (self._scrollPositionCache !== curPosition) {
               _private.sendByRegistrar(self, 'scrollMove', {
                  scrollTop: self._scrollTopCache,
                  position: curPosition
               });
               if (!withObserver) {
                  _private.sendEdgePositions(self, sizeCache.clientHeight, sizeCache.scrollHeight, self._scrollTopCache);
               }
               self._scrollPositionCache = curPosition;
               self._scrollTopTimer = null;
            } else {
               if (!self._scrollTopTimer) {
                  self._scrollTopTimer = setTimeout(function() {
                     if (self._scrollTopTimer) {
                        _private.sendByRegistrar(self, 'scrollMove', {scrollTop: self._scrollTopCache, position: curPosition});
                        if (!withObserver) {
                           _private.sendEdgePositions(self, sizeCache.clientHeight, sizeCache.scrollHeight, self._scrollTopCache);
                        }
                        self._scrollTopTimer = null;
                     }
                  }, 100);
               }
            }

         },

         initIntersectionObserver: function(self, elements) {
            var eventName;
            self._observer = new IntersectionObserver(function(changes) {
               for (var i = 0; i < changes.length; i++) {
                  switch (changes[i].target) {
                     case elements.topLoadTrigger:
                        if (changes[i].isIntersecting) {
                           eventName = 'loadTopStart';
                        } else {
                           eventName = 'loadTopStop';
                        }
                        break;
                     case elements.bottomLoadTrigger:
                        if (changes[i].isIntersecting) {
                           eventName = 'loadBottomStart';
                        } else {
                           eventName = 'loadBottomStop';
                        }
                        break;
                     case elements.topListTrigger:
                        if (changes[i].isIntersecting) {
                           eventName = 'listTop';
                        }
                        break;
                     case elements.bottomListTrigger:
                        if (changes[i].isIntersecting) {
                           eventName = 'listBottom';
                        }
                        break;
                  }
                  if (eventName) {
                     _private.sendByRegistrar(self, eventName);
                     eventName = null;
                  }
               }
            }, {root: self._container[0] || self._container});//FIXME self._container[0] remove after https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            self._observer.observe(elements.topLoadTrigger);
            self._observer.observe(elements.bottomLoadTrigger);

            self._observer.observe(elements.topListTrigger);
            self._observer.observe(elements.bottomListTrigger);
         },

         onRegisterNewComponent: function(self, container, component, withObserver) {
            var sizeCache = _private.getSizeCache(self, container);
            if (!sizeCache.clientHeight) {
               _private.calcSizeCache(self, container);
               sizeCache = _private.getSizeCache(self, container);
            }
            if (sizeCache.clientHeight < sizeCache.scrollHeight) {
               self._registrar.startOnceTarget(component, 'canScroll');
            } else {
               self._registrar.startOnceTarget(component, 'cantScroll');
            }

            if (!withObserver) {
               //TODO надо кидать не всем компонентам, а адресно одному
               _private.sendEdgePositions(self, sizeCache.clientHeight, sizeCache.scrollHeight, self._scrollTopCache);
            }
         },

         doScroll: function(self, scrollParam, container) {
            if (scrollParam === 'top') {
               container.scrollTop = 0;
            } else {
               var sizeCache = _private.getSizeCache(self, container);
               var clientHeight = sizeCache.clientHeight, scrollHeight;
               if (scrollParam === 'bottom') {
                  scrollHeight = sizeCache.scrollHeight;
                  container.scrollTop = scrollHeight - clientHeight;
               } else {
                  if (scrollParam === 'pageUp') {
                     container.scrollTop -= clientHeight;
                  } else {
                     if (scrollParam === 'pageDown') {
                        container.scrollTop += clientHeight;
                     } else {
                        if (scrollParam === 'scrollCompensation') {
                           if (container.scrollTop === 0) {
                              container.scrollTop = 1;
                           }
                           self._needCompensation = true;
                        }
                     }
                  }
               }
            }
         },


         sendByRegistrar: function(self, eventType, params) {
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
         _needCompensation: false,

         constructor: function() {
            Scroll.superclass.constructor.apply(this, arguments);
            this._sizeCache = {};
         },

         _beforeMount: function() {
            
            //чтобы не было лишних синхронизаций при обработке событий
            //удалим по проекту
            //https://online.sbis.ru/opendoc.html?guid=11776bc8-39b7-4c55-b5b5-5cc2ea8d9fbe
            
            this._forceUpdate = function() {};
            this._registrar = new Registrar({register: 'listScroll'});
         },

         _afterMount: function() {
            if (!isEmpty(this._registrar._registry)) {
               _private.calcSizeCache(this, _private.getDOMContainer(this._container));
               _private.sendCanScroll(this, this._sizeCache.clientHeight, this._sizeCache.scrollHeight);
            }
            this._notify('register', ['controlResize', this, this._resizeHandler], {bubbling: true});
         },


         _scrollHandler: function(e) {
            _private.onScrollContainer(this, _private.getDOMContainer(this._container), !!this._observer);
         },

         _resizeHandler: function(e) {
            var withObserver = !!this._observer;
            _private.onResizeContainer(this, _private.getDOMContainer(this._container), withObserver);
         },

         _registerIt: function(event, registerType, component, callback, triggers) {
            if (registerType === 'listScroll') {
               this._registrar.register(event, component, callback);

               //IntersectionObserver doesn't work correctly in Edge and Firefox
               //https://online.sbis.ru/opendoc.html?guid=aa514bbc-c5ac-40f7-81d4-50ba55f8e29d
               if (global && global.IntersectionObserver && triggers && !Env.detection.isIE && !Env.detection.isIE12 && !Env.detection.firefox) {
                  if (!this._observer) {
                     _private.initIntersectionObserver(this, triggers);
                  }
               }

               _private.onRegisterNewComponent(this, _private.getDOMContainer(this._container), component, !!this._observer);
            }
         },

         _doScrollHandler: function(e, scrollParam) {
            _private.doScroll(this, scrollParam, _private.getDOMContainer(this._container));
         },

         doScroll: function(scrollParam) {
            _private.doScroll(this, scrollParam, _private.getDOMContainer(this._container));
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
