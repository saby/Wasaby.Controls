define('Controls/Popup/Opener/Stack/StackController',
   [
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Stack/StackStrategy',
      'Types/collection',
      'Controls/Popup/TargetCoords',
      'Core/Deferred',
      'wml!Controls/Popup/Opener/Stack/StackContent',
      'css!theme?Controls/Popup/Opener/Stack/Stack'
   ],
   function(BaseController, StackStrategy, collection, TargetCoords, Deferred) {
      'use strict';
      var STACK_CLASS = 'controls-Stack';
      var _private = {

         prepareSizes: function(item, container) {
            var templateStyle = container ? getComputedStyle(container.children[0]) : {};
            var defaultOptions = _private.getDefaultOptions(item);

            item.popupOptions.minWidth = parseInt(item.popupOptions.minWidth || defaultOptions.minWidth || templateStyle.minWidth, 10);
            item.popupOptions.maxWidth = parseInt(item.popupOptions.maxWidth || defaultOptions.maxWidth || templateStyle.maxWidth, 10);
            item.popupOptions.width = parseInt(item.popupOptions.width || defaultOptions.width, 10);

            // Validate the configuration
            if (item.popupOptions.maxWidth < item.popupOptions.minWidth) {
               item.popupOptions.maxWidth = item.popupOptions.minWidth;
            }

            if (!item.popupOptions.hasOwnProperty('minimizedWidth')) {
               item.popupOptions.minimizedWidth = defaultOptions.minimizedWidth;
            }

            // optimization: don't calculate the size of the container, if the configuration is set
            if (container && !item.popupOptions.width) {
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
            item.position = StackStrategy.getPosition(targetCoords, item);
            item.popupOptions.stackWidth = item.position.stackWidth;
            item.popupOptions.stackMinWidth = item.position.stackMinWidth;
            item.popupOptions.stackMaxWidth = item.position.stackMaxWidth;
            _private.updatePopupOptions(item);
            return item.position;
         },

         addShadowClass: function(item) {
            _private.removeShadowClass(item);
            item.popupOptions.stackClassName += ' controls-Stack__shadow';
         },

         removeShadowClass: function(item) {
            item.popupOptions.stackClassName = (item.popupOptions.stackClassName || '').replace(/controls-Stack__shadow/ig, '').trim();
         },

         prepareUpdateClassses: function(item) {
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
            if (!item.popupOptions._version) {
               item.popupOptions.getVersion = function() {
                  return this._version;
               };
               item.popupOptions._version = 0;
            }
            item.popupOptions._version++;
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
            return templateClass.getDefaultOptions ? templateClass.getDefaultOptions() : {};
         }
      };

      /**
       * Stack Popup Controller
       * @class Controls/Popup/Opener/Stack/StackController
       * @control
       * @private
       * @category Popup
       */

      var StackController = BaseController.extend({
         constructor: function(cfg) {
            StackController.superclass.constructor.call(this, cfg);
            this._stack = new collection.List();
         },

         elementCreated: function(item, container) {
            if (item.popupOptions.isCompoundTemplate) {
               _private.prepareSizes(item, container);
               _private.setStackContent(item);
               this._stack.add(item);
               this._update();
            }
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
            this._stack.remove(item);
            this._update();
            return (new Deferred()).callback();
         },

         _update: function() {
            var maxPanelWidth = StackStrategy.getMaxPanelWidth();
            var maxWidth = 0;
            var cache = {};
            this._stack.each(function(item) {
               if (item.popupState !== BaseController.POPUP_STATE_DESTROYING) {
                  item.position = _private.getItemPosition(item);
                  var currentWidth = item.containerWidth || item.position.stackWidth || item.position.stackMaxWidth;

                  // Drawing only 1 shadow on popup of the same size. Done in order not to duplicate the shadow.
                  if (currentWidth > maxWidth) {
                     maxWidth = currentWidth;
                     cache = {};
                  }
                  if (!cache[currentWidth]) {
                     cache[currentWidth] = 1;
                     _private.addShadowClass(item);
                  } else {
                     _private.removeShadowClass(item);
                  }
                  if (StackStrategy.isMaximizedPanel(item)) {
                     _private.prepareMaximizedState(maxPanelWidth, item);
                  }
               }
            });
         },

         getDefaultConfig: function(item) {
            _private.prepareSizes(item);
            _private.setStackContent(item);
            _private.addStackClasses(item.popupOptions);
            if (StackStrategy.isMaximizedPanel(item)) {
               // set default values
               item.popupOptions.templateOptions.showMaximizedButton = undefined; // for vdom dirtyChecking
               var maximizedState = item.popupOptions.hasOwnProperty('maximized') ? item.popupOptions.maximized : false;
               _private.setMaximizedState(item, maximizedState);
            }

            if (item.popupOptions.isCompoundTemplate) {
               // set sizes before positioning. Need for templates who calculate sizes relatively popup sizes
               var position = _private.getItemPosition(item);
               item.position = {
                  top: -10000,
                  left: -10000,
                  height: _private.getWindowSize().height,
                  stackWidth: position.stackWidth || undefined
               };
            } else {
               this._stack.add(item);
               this._update();
            }
         },

         _private: _private
      });

      return new StackController();
   });
