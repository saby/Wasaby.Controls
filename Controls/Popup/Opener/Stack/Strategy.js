define('js!Controls/Popup/Opener/Stack/Strategy',
   [
      'js!Controls/Popup/Opener/BaseStrategy',
      'WS.Data/Collection/List'
   ],
   function (BaseStrategy, List) {
      'use strict';

      var
         // минимальная ширина стековой панели
         MINIMAL_PANEL_WIDTH = 50,
         // минимальный отступ стековой панели от правого края
         MINIMAL_PANEL_DISTANCE = 50;

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

         addElement: function (element) {
            this._stack.add(element, 0);
            this._update();
         },

         removeElement: function (element) {
            this._stack.remove(element);
            this._update();
         },

         _update: function () {
            var
               self = this,
               previous;
            this._stack.each(function (item, index) {
               var
                  minWidth = item.popupOptions.minWidth,
                  maxWidth = item.popupOptions.maxWidth,
                  prevWidth = previous ? previous.width : null,
                  prevRight = previous ? previous.right : null;
               item.position = self.getPosition(index, minWidth, maxWidth, window.outerWidth, prevWidth, prevRight);
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
          * @param minWidth минимальная ширина панели
          * @param maxWidth максимальная ширина панели
          * @param wWidth ширина окна
          * @param prevWidth ширина предыдущей панели
          * @param prevRight отступ справа предыдущей панели
          */
         getPosition: function (index, minWidth, maxWidth, wWidth, prevWidth, prevRight) {
            var
               width = this.getPanelWidth(minWidth, maxWidth, wWidth),
               right = 0;
            if (index !== 0) {
               if (prevWidth) {
                  var rightCalc = 100 - ( width - prevWidth - prevRight );
                  if (rightCalc > 0) {
                     right = Math.max(100, rightCalc);
                     if (( width + right ) > this.getMaxPanelWidth(wWidth)) {
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
               top: 0,
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