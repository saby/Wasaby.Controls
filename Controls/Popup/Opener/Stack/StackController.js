define('Controls/Popup/Opener/Stack/StackController',
   [
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Stack/StackStrategy',
      'WS.Data/Collection/List',
      'Controls/Popup/TargetCoords',
      'Core/Deferred',
      'Core/constants',
      'Core/core-clone',
      'wml!Controls/Popup/Opener/Stack/StackContent',
      'css!theme?Controls/Popup/Opener/Stack/Stack'
   ],
   function(BaseController, StackStrategy, List, TargetCoords, Deferred, cConstants, cClone) {
      'use strict';
      var HAS_ANIMATION = cConstants.browser.chrome && !cConstants.browser.isMobilePlatform;
      var STACK_CLASS = 'controls-Stack';
      var _private = {

         prepareSizes: function(item, container) {
            var templateStyle = container ? getComputedStyle(container.children[0]) : {};
            var defaultOptions = _private.getDefaultOptions(item);

            item.popupOptions.minWidth = parseInt(item.popupOptions.minWidth || defaultOptions.minWidth || templateStyle.minWidth, 10);
            item.popupOptions.maxWidth = parseInt(item.popupOptions.maxWidth || defaultOptions.maxWidth || templateStyle.maxWidth, 10);

            // Если задано одно значение - приравниваем minWidth и maxWidth
            item.popupOptions.minWidth = item.popupOptions.minWidth || item.popupOptions.maxWidth;
            item.popupOptions.maxWidth = item.popupOptions.maxWidth || item.popupOptions.minWidth;

            if (item.popupOptions.maxWidth < item.popupOptions.minWidth) {
               item.popupOptions.maxWidth = item.popupOptions.minWidth;
            }

            if (!item.popupOptions.hasOwnProperty('minimizedWidth')) {
               item.popupOptions.minimizedWidth = defaultOptions.minimizedWidth;
            }

            // optimization: don't calculate the size of the container, if the configuration is set
            if (container && !item.popupOptions.minWidth && !item.popupOptions.maxWidth) {
               item.containerWidth = _private.getContainerWidth(item, container);
            }
         },

         getContainerWidth: function(item, container) {
            // The width can be set when the panel is displayed. To calculate the width of the content, remove this value.
            var currentContainerWidth = container.style.width;
            container.style.width = 'auto';

            var templateWidth = container.querySelector('.controls-Stack__content').offsetWidth;
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
            return (className || '').replace(/controls-Stack__close|controls-Stack__open|controls-Stack__waiting/ig, '').trim();
         },

         prepareUpdateClassses: function(item) {
            item.popupOptions.stackClassName = _private.removeAnimationClasses(item.popupOptions.stackClassName);
            _private.addStackClasses(item.popupOptions);
            _private.updatePopupOptions(item);
         },

         addStackClasses: function(popupOptions) {
            var className = popupOptions.className || '';
            if (className.indexOf(STACK_CLASS) < 0) {
               popupOptions.className = className + ' ' + STACK_CLASS;
            }
         },

         updatePopupOptions: function(item) {
            // for vdom synchronizer. Updated the link to the options when className was changed
            item.popupOptions = cClone(item.popupOptions);
         },

         prepareMaximizedState: function(maxPanelWidth, item) {
            var canMaximized = maxPanelWidth > item.popupOptions.minWidth;
            if (!canMaximized) {
               // If we can't turn around, we hide the turn button and change the state
               item.popupOptions.templateOptions.showMaximizedButton = false;
               item.popupOptions.templateOptions.maximized = false;
            } else {
               item.popupOptions.templateOptions.showMaximizedButton = true;

               // Restore the state after resize
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
         },
         setStackContent: function(item) {
            item.popupOptions.content = 'wml!Controls/Popup/Opener/Stack/StackContent';
         },

         getDefaultOptions: function(item) {
            var template = item.popupOptions.template;
            var templateClass = typeof template === 'string' ? require(template) : template;
            return templateClass.getDefaultOptions();
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
            _private.setStackContent(item);
            this._stack.add(item);
            if (HAS_ANIMATION && !item.popupOptions.isCompoundTemplate) {
               item.popupOptions.stackClassName += ' controls-Stack__open';
               _private.updatePopupOptions(item);
               item.popupState = BaseController.POPUP_STATE_CREATING;
            }
            this._update();
         },

         elementUpdated: function(item, container) {
            _private.prepareUpdateClassses(item);
            _private.setStackContent(item);
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
               item.popupOptions.stackClassName += ' controls-Stack__close';
               _private.updatePopupOptions(item);
               this._fixTemplateAnimation(item);
            } else {
               _private.elementDestroyed(this, item);
               return (new Deferred()).callback();
            }
            return this._destroyDeferred[item.id];
         },

         elementAnimated: function(item) {
            item.popupOptions.stackClassName = _private.removeAnimationClasses(item.popupOptions.stackClassName);
            _private.updatePopupOptions(item);
            if (item.popupState === BaseController.POPUP_STATE_DESTROYING) {
               _private.elementDestroyed(this, item);
            } else {
               item.popupState = BaseController.POPUP_STATE_CREATED;
               return true;
            }
         },

         _update: function() {
            var maxPanelWidth = StackStrategy.getMaxPanelWidth();
            var cache = {};
            this._stack.each(function(item) {
               item.position = _private.getItemPosition(item);
               var currentWidth = item.containerWidth || item.position.width;
               if (!cache[currentWidth]) {
                  cache[currentWidth] = 1;
                  item.popupOptions.stackClassName += ' controls-Stack__shadow';
               }
               if (StackStrategy.isMaximizedPanel(item)) {
                  _private.prepareMaximizedState(maxPanelWidth, item);
               }
            });
         },

         getDefaultConfig: function(item) {
            var baseCoord = { top: 0, right: 0 };
            _private.prepareSizes(item);
            var position = StackStrategy.getPosition(baseCoord, item);
            _private.setStackContent(item);
            _private.addStackClasses(item.popupOptions);
            if (StackStrategy.isMaximizedPanel(item)) {
               // set default values
               item.popupOptions.templateOptions.showMaximizedButton = undefined; // for vdom dirtyChecking
               var maximizedState = item.popupOptions.hasOwnProperty('maximized') ? item.popupOptions.maximized : false;
               _private.setMaximizedState(item, maximizedState);
            }
            if (HAS_ANIMATION && !item.popupOptions.isCompoundTemplate) {
               item.popupOptions.stackClassName += 'controls-Stack__waiting';
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
