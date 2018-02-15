/**
 * Created by kraynovdo on 15.02.2018.
 */
/**
 * Created by dv.zuev on 17.01.2018.
 * Компонент слушает события "снизу". События register и сохраняет Emmitterы в списке
 * то есть, кто-то снизу сможет услышать события верхних компонентов через это отношение
 */
define('Controls/Layout/Scroll',
   [
      'Core/Control',
      'tmpl!Controls/Layout/Scroll/Scroll',
      'Controls/Event/Registrar',
      'Core/helpers/Function/throttle',
      'WS.Data/Type/descriptor'
   ],
   function(Control, template, Registrar, throttle, types) {

      'use strict';

      var SCROLL_LOAD_OFFSET = 100;
      var global = (function() { return this || (0,eval)('this') })();

      var _private = {
         onScroll: function(self, container) {
            var scrollTop, clientHeight, scrollHeight;

            scrollTop = container.scrollTop;
            clientHeight = container.clientHeight;
            scrollHeight = container.scrollHeight;

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

         start: function(self, eventType, scrollTop) {
            self._registrar.start(eventType, scrollTop);
         }
      };

      var Scroll = Control.extend({
         _template: template,
         _observer: null,


         _beforeMount: function(){
            this._registrar = new Registrar({register: 'listScroll'});
         },


         _scrollHandler: function(e) {
            var self = this;
            // подписка на скролл через throttle. Нужно подобрать оптимальное значение,
            // как часто кидать внутреннее событие скролла. На простом списке - раз в 100мс достаточно.
            throttle(function(){
               if (!self._observer) {
                  _private.onScroll(self, e.target);
               }
               _private.start(self, 'middle', e.target.scrollTop);
            }, 100, true)();
         },

         _registerIt: function(event, registerType, component, callback, triggers){
            this._registrar.register(event, registerType, component, callback);

            if (global && global.IntersectionObserver && triggers) {
               _private.initIntersectionObserver(this, triggers);
            }
            else {
               _private.onScroll(this, this._container);
            }

         },



         _unRegisterIt: function(event, registerType, component){
            this._registrar.unregister(event, registerType, component, callback);
         },


         _beforeUnmount: function() {
            if (this._observer) {
               this._observer.unobserve();
               this._observer = null;
            }
            this._registrar.destroy();
         }



      });

      Scroll.getOptionTypes = function() {
         return {

         };
      };

      return Scroll;
   }
);
