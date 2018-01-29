define('Controls/Popup/Opener/Stack/Strategy',
   [
      'Controls/Popup/Opener/BaseStrategy',
      'WS.Data/Collection/List',
      'Controls/Popup/TargetCoords'
   ],
   function (BaseStrategy, List, TargetCoords) {
      'use strict';

      var
         // минимальная ширина стековой панели
         MINIMAL_PANEL_WIDTH = 50,
         // минимальный отступ стековой панели от правого края
         MINIMAL_PANEL_DISTANCE = 50,
         POPUP_CLASS = 'ws-Container__stack-panel';

      var _private = {
         getStackParentCoords: function () {
            var elements = document.getElementsByClassName('ws-Popup__stack-target-container');
            var targetCoords = TargetCoords.get(elements && elements.length ? elements[0] : document.body);

            return {
               top: targetCoords.top,
               right: window.innerWidth - targetCoords.right
            }
         }
      };

      /**
       * Контроллер стековых панелей.
       * @class Controls/Popup/Opener/Stack/Strategy
       * @control
       * @private
       * @category Popup
       */

      var Strategy = BaseStrategy.extend({
         constructor: function (cfg) {
            Strategy.superclass.constructor.call(this, cfg);
            this._stack = new List();
         },

         elementCreated: function (element) {
            if (!element.popupOptions) {
               element.popupOptions = {};
            }
            //Добавляем стандартный класс
            element.popupOptions.className += ' ' + POPUP_CLASS;
            this._stack.add(element, 0);
            this._update();
         },

         elementUpdated: function(){
            this._update();
         },

         elementDestroyed: function (element) {
            this._stack.remove(element);
            this._update();
         },

         _update: function () {
            var
               self = this,
               tCoords = _private.getStackParentCoords(),
               previous;
            this._stack.each(function (item, index) {
               var
                  prevWidth = previous ? previous.width : null,
                  prevRight = previous ? previous.right : null,
                  width = self.getPanelWidth(item.popupOptions.minWidth, item.popupOptions.maxWidth, window.innerWidth),
                  maxPanelWidth = self.getMaxPanelWidth(window.innerWidth);
               item.position = self.getPosition(index, tCoords, width, maxPanelWidth, prevWidth, prevRight);
               previous = item.position;
               if (!previous) {
                  item.position = self.getDefaultPosition();
               }
            });
         },

         /**
          * Возвращает позицию стек-панели
          * @function Controls/Popup/Opener/Stack/Strategy#stack
          * @param index номер панели
          * @param tCoords точка, относительно которой будет вылезать панель
          * @param width ширина панели
          * @param maxWidth максимально возможная ширина панели
          * @param prevWidth ширина предыдущей панели
          * @param prevRight отступ справа предыдущей панели
          */
         getPosition: function (index, tCoords, width, maxWidth, prevWidth, prevRight) {
            var
               top = tCoords.top,
               right = tCoords.right;
            if (index !== 0) {
               if (prevWidth) {
                  var rightCalc = 100 - ( width - prevWidth - prevRight );
                  if (rightCalc > 0) {
                     right = Math.max(100, rightCalc);
                     if (( width + right ) > maxWidth) {
                        return null;
                     }
                  }
               }
               else {
                  return null;
               }
            }
            return {
               width: width,
               right: right,
               top: top,
               bottom: 0
            };
         },

         /**
          * Расчитываает ширину панели, исходя из ее минимальной и максимальной ширины
          * @function Controls/Popup/Opener/Stack/Strategy#getPanelWidth
          * @param minWidth минимальная ширина панели
          * @param maxWidth максимальная ширина панели
          * @param wWidth ширина окна
          */
         getPanelWidth: function (minWidth, maxWidth, wWidth) {
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
            }
            else if (newWidth < MINIMAL_PANEL_WIDTH) {
               return MINIMAL_PANEL_WIDTH;
            }
            return newWidth;
         },

         /**
          * Расчитываает максимально возможную ширину панели
          * @function Controls/Popup/Opener/Stack/Strategy#getMaxPanelWidth
          * @param wWidth ширина окна
          */
         getMaxPanelWidth: function (wWidth) {
            return wWidth - MINIMAL_PANEL_DISTANCE;
         }
      });

      return new Strategy();
   }
);