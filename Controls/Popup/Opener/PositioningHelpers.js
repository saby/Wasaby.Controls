define('Controls/Popup/Opener/PositioningHelpers',
   [],
   function () {
      'use strict';

      var
         // минимальная ширина стековой панели
         MINIMAL_PANEL_WIDTH = 50,
         // минимальный отступ стековой панели от правого края
         MINIMAL_PANEL_DISTANCE = 50;

      var PositioningHelpers = {
         /**
          * Возвращает позицию диалогового окна
          * @function Controls/Popup/Opener/PositioningHelpers#dialog
          * @param wWidth ширина окна браузера
          * @param wHeight высота окна браузера
          * @param cWidth ширина диалогового окна
          * @param cHeight высота диалогового окна
          */
         dialog: function (wWidth, wHeight, cWidth, cHeight) {
            return {
               left: Math.round((wWidth - cWidth) / 2),
               top: Math.round((wHeight - cHeight) / 2)
            };
         },

         /**
          * TODO Возвращает позицию push-уведомления
          * @function Controls/Popup/Opener/PositioningHelpers#notification
          */
         notification: function () {
            return {
               right: 16,
               bottom: 16
            };
         },

         /**
          * Возвращает позицию плавающей панели
          * @function Controls/Popup/Opener/PositioningHelpers#sticky
          * @param targetCoords координаты таргета
          * @param hAlign горизонтальное выравнивание
          * @param vAlign вертикальное выравнивание
          * @param contWidth ширина плавающей панели
          * @param contHeight высота плавающей панели
          * @param wWidth ширина окна
          * @param wHeight высота окна
          */
         sticky: function (targetCoords, hAlign, vAlign, contWidth, contHeight, wWidth, wHeight) {
            var
               hSide = hAlign ? (hAlign.side || 'left') : 'left',
               hOffset = hAlign ? (hAlign.offset || 0) : 0,
               left = targetCoords.left - (hSide === 'right' ? contWidth || 0 : 0 ) + hOffset;
            if (( left + contWidth ) > wWidth) {
               left -= contWidth;
            }
            if (left < 0) {
               left += contWidth;
            }

            var
               vSide = vAlign ? (vAlign.side || 'bottom') : 'bottom',
               vOffset = vAlign ? (vAlign.offset || 0) : 0,
               top = targetCoords.top - (vSide === 'top' ? contHeight || 0 : 0) + vOffset;
            if (( top + contHeight ) > wHeight) {
               top -= contHeight;
            }
            if (top < 0) {
               top += contHeight;
            }

            return {
               left: left,
               top: top
            };
         },

         /**
          * Возвращает позицию стек-панели
          * @function Controls/Popup/Opener/PositioningHelpers#stack
          * @param index номер панели
          * @param minWidth минимальная ширина панели
          * @param maxWidth максимальная ширина панели
          * @param wWidth ширина окна
          * @param prevWidth ширина предыдущей панели
          * @param prevRight отступ справа предыдущей панели
          */
         stack: function (index, minWidth, maxWidth, wWidth, prevWidth, prevRight) {
            var
               width = this.getPanelWidth(minWidth, maxWidth, wWidth),
               right = 0;
            if (index !== 0) {
               if (prevWidth) {
                  var rightCalc = 100 - ( width - prevWidth - prevRight );
                  if( rightCalc > 0 ){
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
          * @function Controls/Popup/Opener/PositioningHelpers#getPanelWidth
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
          * @function Controls/Popup/Opener/PositioningHelpers#getMaxPanelWidth
          * @param wWidth ширина окна
          */
         getMaxPanelWidth: function (wWidth) {
            return wWidth - MINIMAL_PANEL_DISTANCE;
         }
      };

      return PositioningHelpers;
   }
);