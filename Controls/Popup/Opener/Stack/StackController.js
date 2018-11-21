define('Controls/Popup/Opener/Stack/StackController',
   [
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Stack/StackStrategy',
      'WS.Data/Collection/List',
      'Controls/Popup/TargetCoords',
      'Core/Deferred',
      'Core/constants',
      'css!theme?Controls/Popup/Opener/Stack/Stack'
   ],
   function(BaseController, StackStrategy, List, TargetCoords, Deferred, cConstants) {
      'use strict';
      var HAS_ANIMATION = cConstants.browser.chrome && !cConstants.browser.isMobilePlatform;
      var STACK_CLASS = 'controls-Stack';
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

            // optimization: don't calculate the size of the container, if the configuration is set
            if (!item.popupOptions.minWidth && !item.popupOptions.maxWidth) {
               item.containerWidth = _private.getContainerWidth(item, container);
            }
         },

         getContainerWidth: function(item, container) {
            // The width can be set when the panel is displayed. To calculate the width of the content, remove this value.
            var currentContainerWidth = container.style.width;
            container.style.width = 'auto';

            var templateWidth = container.querySelector('.controls-Popup__template').offsetWidth;
            container.style.width = currentContainerWidth;
            return templateWidth;
         },

         getStackParentCoords: function() {
            var elements = document.getElementsByClassName('controls-Popup__stack-target-container');
            var targetCoords = TargetCoords.get(elements && elements.length ? elements[0] : document.body);

            return {
               top: Math.max(targetCoords.top, 0),
               right: Math.max(window.innerWidth - targetCoords.right, 0)
            };
         },

         getItemPosition: function(item) {
            var targetCoords = _private.getStackParentCoords();
            return StackStrategy.getPosition(targetCoords, item);
         },

         elementDestroyed: function(instance, item) {
            instance._stack.remove(item);
            instance._update();
            instance._destroyDeferred[item.id].callback();
            delete instance._destroyDeferred[item.id];
         },

         removeAnimationClasses: function(className) {
            className = (className || '');
            return className.replace(/controls-Stack__close|controls-Stack__open|controls-Stack__waiting/ig, '').trim();
         },

         prepareUpdateClassses: function(className) {
            className = (className || '');
            className = _private.removeAnimationClasses(className);
            className = _private.addStackClasses(className);
            return className.trim();
         },

         addStackClasses: function(className) {
            className = (className || '');
            if (className.indexOf(STACK_CLASS) < 0) {
               className += ' ' + STACK_CLASS;
            }
            return className;
         },

         prepareMaximizedState: function(maxPanelWidth, item) {
            var canMaximized = maxPanelWidth > item.popupOptions.minWidth;
            if (!canMaximized) {
               //If we can't turn around, we hide the turn button and change the state
               item.popupOptions.templateOptions.showMaximizedButton = false;
               item.popupOptions.templateOptions.maximized = false;
            } else {
               item.popupOptions.templateOptions.showMaximizedButton = true;

               //Restore the state after resize
               item.popupOptions.templateOptions.maximized = item.popupOptions.maximized;
            }
         },
         setMaximizedState: function(item, state) {
            item.popupOptions.maximized = state;
            item.popupOptions.templateOptions.maximized = state;
         },
         getWindowSize: function() {
            return {
               width: window.innerWidth,
               height: window.innerHeight
            };
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
            _private.prepareSizes(item, container);
            this._stack.add(item, 0);
            if (HAS_ANIMATION && !item.popupOptions.isCompoundTemplate) {
               item.popupOptions.className += ' controls-Stack__open';
               item.popupState = BaseController.POPUP_STATE_CREATING;
            }
            this._update();
         },

         elementUpdated: function(item, container) {
            item.popupOptions.className = _private.prepareUpdateClassses(item.popupOptions.className);
            _private.prepareSizes(item, container);
            this._update();
         },

         elementMaximized: function(item, container, state) {
            _private.setMaximizedState(item, state);
            _private.prepareSizes(item, container);
            this._update();
         },

         elementDestroyed: function(item) {
            this._destroyDeferred[item.id] = new Deferred();
            if (HAS_ANIMATION) {
               item.popupOptions.className += ' controls-Stack__close';
               this._fixTemplateAnimation(item);
            } else {
               _private.elementDestroyed(this, item);
               return (new Deferred()).callback();
            }
            return this._destroyDeferred[item.id];
         },

         elementAnimated: function(item) {
            item.popupOptions.className = _private.removeAnimationClasses(item.popupOptions.className);
            if (item.popupState === BaseController.POPUP_STATE_DESTROYING) {
               _private.elementDestroyed(this, item);
            } else {
               item.popupState = BaseController.POPUP_STATE_CREATED;
               return true;
            }
         },

         _update: function() {
            var maxPanelWidth = StackStrategy.getMaxPanelWidth();
            this._stack.each(function(item) {
               item.position = _private.getItemPosition(item);
               if (StackStrategy.isMaximizedPanel(item)) {
                  _private.prepareMaximizedState(maxPanelWidth, item);
               }
            });
         },

         getDefaultConfig: function(item) {
            var baseCoord = { top: 0, right: 0 };
            var position = StackStrategy.getPosition(baseCoord, { popupOptions: item.popupOptions });
            item.popupOptions.className = _private.addStackClasses(item.popupOptions.className);
            if (StackStrategy.isMaximizedPanel(item)) {
               //set default values
               item.popupOptions.templateOptions.showMaximizedButton = undefined; //for vdom dirtyChecking
               var maximizedState = item.popupOptions.hasOwnProperty('maximized') ? item.popupOptions.maximized : false;
               _private.setMaximizedState(item, maximizedState);
            }
            if (HAS_ANIMATION && !item.popupOptions.isCompoundTemplate) {
               item.popupOptions.className += ' controls-Stack__waiting';
            }

            // set sizes before positioning. Need for templates who calculate sizes relatively popup sizes
            item.position = {
               top: -10000,
               left: -10000,
               height: _private.getWindowSize().height,
               width: position.width || undefined
            };
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
         },

         _private: _private
      });

      return new StackController();
   });
