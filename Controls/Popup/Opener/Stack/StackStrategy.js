/**
 * Created by as.krasilnikov on 21.03.2018.
 */
define('Controls/Popup/Opener/Stack/StackStrategy', ['Controls/Popup/TargetCoords'], function (TargetCoords) {
   var
      // минимальная ширина стековой панели
      MINIMAL_PANEL_WIDTH = 50,
      // минимальный отступ стековой панели от правого края
      MINIMAL_PANEL_DISTANCE = 50;

   return {
      /**
       * Возвращает позицию стек-панели
       * @function Controls/Popup/Opener/Stack/StackController#stack
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
       * @function Controls/Popup/Opener/Stack/StackController#getPanelWidth
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
       * @function Controls/Popup/Opener/Stack/StackController#getMaxPanelWidth
       * @param wWidth ширина окна
       */
      getMaxPanelWidth: function (wWidth) {
         return wWidth - MINIMAL_PANEL_DISTANCE;
      },
      getStackParentCoords: function () {
         var elements = document.getElementsByClassName('ws-Popup__stack-target-container');
         var targetCoords = TargetCoords.get(elements && elements.length ? elements[0] : document.body);

         return {
            top: targetCoords.top,
            right: window.innerWidth - targetCoords.right
         }
      }
   }
});