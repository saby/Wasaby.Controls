define('Controls/Popup/Opener/Stack/StackController',
   [
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Stack/StackStrategy',
      'WS.Data/Collection/List',
      'Controls/Popup/TargetCoords',
      'Core/Deferred',
      'Core/constants'
   ],
   function(BaseController, StackStrategy, List, TargetCoords, cDeferred, cConstants) {
      'use strict';

      var MINIMAL_PANEL_WIDTH = 50; // минимальная ширина стековой панели, todo уйдет в css после доработки по заданию размеров для панели
      var MINIMAL_PANEL_DISTANCE = 50; // минимальный отступ стековой панели от правого края

      var _private = {

         /**
          * Расчитываает ширину панели, исходя из ее минимальной и максимальной ширины
          * @function Controls/Popup/Opener/Stack/StackController#getPanelWidth
          * @param minWidth минимальная ширина панели
          * @param maxWidth максимальная ширина панели
          * @param wWidth ширина окна
          */
         getPanelWidth: function(minWidth, maxWidth, wWidth) {
            if (!minWidth) {
               minWidth = MINIMAL_PANEL_WIDTH;
            }
            if (!maxWidth) {
               maxWidth = this.getMaxPanelWidth(wWidth);
            }
            var
               newWidth = Math.min(this.getMaxPanelWidth(wWidth), maxWidth);
            if (newWidth < minWidth) {
               return Math.max(minWidth, MINIMAL_PANEL_WIDTH);
            } else if (newWidth < MINIMAL_PANEL_WIDTH) {
               return MINIMAL_PANEL_WIDTH;
            }
            return newWidth;
         },

         /**
          * Расчитываает максимально возможную ширину панели
          * @function Controls/Popup/Opener/Stack/StackController#getMaxPanelWidth
          * @param wWidth ширина окна
          */
         getMaxPanelWidth: function(wWidth) {
            return wWidth - MINIMAL_PANEL_DISTANCE;
         },
         getStackParentCoords: function() {
            var elements = document.getElementsByClassName('ws-Popup__stack-target-container');
            var targetCoords = TargetCoords.get(elements && elements.length ? elements[0] : document.body);

            return {
               top: targetCoords.top,
               right: window.innerWidth - targetCoords.right
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
         constructor: function(cfg) {
            StackController.superclass.constructor.call(this, cfg);
            this._stack = new List();
         },

         elementCreated: function(item, container) {
            var templateStyle = getComputedStyle(container.children[0]);
            if (!item.popupOptions.minWidth) {
               item.popupOptions.minWidth = parseInt(templateStyle.minWidth, 10);
            }
            if (!item.popupOptions.maxWidth) {
               item.popupOptions.maxWidth = parseInt(templateStyle.maxWidth, 10);
            }
            this._stack.add(item, 0);
            this._update();
         },

         elementUpdated: function() {
            this._update();
         },

         elementDestroyed: function(element, container) {
            var
               self = this,
               def = new cDeferred();
            if (cConstants.browser.chrome && !cConstants.browser.isMobilePlatform) {
               container.addEventListener('transitionend', function() {
                  self._stack.remove(element);
                  self._update();
                  def.callback();
               });
               container.style.width = '0';
            } else {
               self._stack.remove(element);
               self._update();
               def.callback();
            }
            return def;
         },

         getDefaultPosition: function() {
            var position = this._getItemPosition(this._stack.getCount());
            return {
               right: position.right,
               top: position.top,
               width: 0
            };
         },

         _update: function() {
            var self = this;
            this._stack.each(function(item, index) {
               item.position = self._getItemPosition(index);
            });
         },

         _getItemPosition: function(index) {
            var tCoords = _private.getStackParentCoords();
            var item = this._stack.at(index);
            var previous = this._stack.at(index - 1);
            var prevData = previous ? previous.position : {};
            var width = item ? _private.getPanelWidth(item.popupOptions.minWidth, item.popupOptions.maxWidth, window.innerWidth) : 0;
            var maxPanelWidth = _private.getMaxPanelWidth(window.innerWidth);
            return StackStrategy.getPosition(index, tCoords, width, maxPanelWidth, prevData.width, prevData.right);
         }
      });

      return new StackController();
   }
);
