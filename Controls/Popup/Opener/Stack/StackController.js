define('Controls/Popup/Opener/Stack/StackController',
   [
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Stack/StackStrategy',
      'WS.Data/Collection/List',
      'Controls/Popup/TargetCoords',
      'Core/Deferred',
      'Core/constants',
      'css!Controls/Popup/Opener/Stack/Stack'
   ],
   function(BaseController, StackStrategy, List, TargetCoords, Deferred, cConstants) {
      'use strict';
      var HAS_ANIMATION = cConstants.browser.chrome && !cConstants.browser.isMobilePlatform;

      var _private = {

         prepareSizes: function(item, container) {
            var templateStyle = getComputedStyle(container.children[0]);

            item.popupOptions.minWidth = parseInt(item.popupOptions.minWidth || templateStyle.minWidth, 10);
            item.popupOptions.maxWidth = parseInt(item.popupOptions.maxWidth || templateStyle.maxWidth, 10);

            // Если задано одно значение - приравниваем minWidth и maxWidth
            item.popupOptions.minWidth = item.popupOptions.minWidth || item.popupOptions.maxWidth;
            item.popupOptions.maxWidth = item.popupOptions.maxWidth || item.popupOptions.minWidth;

            if (item.popupOptions.maxWidth < item.popupOptions.minWidth) {
               item.popupOptions.maxWidth = item.popupOptions.minWidth;
            }

            item.containerWidth = container.getElementsByClassName('controls-Popup__template')[0].offsetWidth; // Берем размеры пользовательского шаблона
         },

         getStackParentCoords: function() {
            var elements = document.getElementsByClassName('controls-Popup__stack-target-container');
            var targetCoords = TargetCoords.get(elements && elements.length ? elements[0] : document.body);

            return {
               top: Math.max(targetCoords.top, 0),
               right: Math.max(window.innerWidth - targetCoords.right, 0)
            };
         },
         elementDestroyed: function(instance, element) {
            instance._stack.remove(element);
            instance._update();
            instance._destroyDeferred[element.id].callback();
            delete instance._destroyDeferred[element.id];
         },
         removeAnimationClasses: function(className) {
            return className.replace(/controls-Stack__close|controls-Stack__open|controls-Stack__waiting/ig, '');
         }
      };

      /**
       * Контроллер стековых панелей.
       * @class Controls/Popup/Opener/Stack/StackController
       * @control
       * @private
       * @category Popup
       */

      var StackController = BaseController.extend({
         _destroyDeferred: {},
         constructor: function(cfg) {
            StackController.superclass.constructor.call(this, cfg);
            this._stack = new List();
            _private.elementDestroyed.bind(this);
            this._fixTemplateAnimation.bind(this);
         },

         elementCreated: function(item, container) {
            if (this._checkContainer(item, container)) {
               _private.prepareSizes(item, container);
               this._stack.add(item, 0);
               if (HAS_ANIMATION) {
                  item.popupOptions.className += ' controls-Stack__open';
               }
               this._update();
            }
         },

         elementUpdated: function(item, container) {
            if (this._canUpdate(container)) {
               if (this._checkContainer(item, container)) {
                  _private.prepareSizes(item, container);
                  this._update();
               }
            }
         },

         _canUpdate: function(container) {
            // if container contains waiting class then animation wasn't over
            // if container contains closing class then popup destroying
            // todo https://online.sbis.ru/opendoc.html?guid=85b389eb-205e-4a7b-b333-12f5cdc2523e
            return !container.classList.contains('controls-Stack__waiting') && !container.classList.contains('controls-Stack__close');
         },

         elementDestroyed: function(element, container) {
            this._destroyDeferred[element.id] = new Deferred();
            if (HAS_ANIMATION) {
               element.popupOptions.className += ' controls-Stack__close';
               container.classList.add('controls-Stack__close');
               this._fixTemplateAnimation(element);
            } else {
               _private.elementDestroyed(this, element);
               return (new Deferred()).callback();
            }
            return this._destroyDeferred[element.id];
         },

         elementAnimated: function(element, container) {
            element.popupOptions.className = _private.removeAnimationClasses(element.popupOptions.className);
            if (this._destroyDeferred[element.id]) {
               _private.elementDestroyed(this, element);
            } else {
               container.classList.remove('controls-Stack__waiting', 'controls-Stack__open');
            }
         },

         _update: function() {
            var self = this;
            this._stack.each(function(item, index) {
               item.position = self._getItemPosition(index);
            });
         },

         getDefaultPosition: function(popupOptions) {
            var baseCoord = { top: 0, right: 0 };
            var position = StackStrategy.getPosition(baseCoord, { popupOptions: popupOptions });

            // set sizes before positioning. Need for templates who calculate sizes relatively popup sizes
            return {
               top: -10000,
               left: -10000,
               width: position.width || undefined
            };
         },

         _getItemPosition: function(index) {
            var tCoords = _private.getStackParentCoords();
            var item = this._stack.at(index);
            return StackStrategy.getPosition(tCoords, item);
         },
         _getTemplateContainer: function(container) {
            return container.getElementsByClassName('controls-Popup__template')[0];
         },


         // Метод, который проверяет работу анимации. Если анимация через пол секунды не сообщила о своем завершении -
         // завершает ее вручную. Необходимость вызвана изощренной логикой прикладных разработчиков, которые сами
         // по непонятным никому причинам из js кода удаляют шаблон или отписываются от всех его событий, что мешает
         // работе анимации
         _fixTemplateAnimation: function(element) {
            var self = this;
            setTimeout(function() {
               var destroyDef = self._destroyDeferred[element.id];
               if (destroyDef && !destroyDef.isReady()) {
                  _private.elementDestroyed(self, element);
               }
            }, 500);
         }
      });

      return new StackController();
   });
