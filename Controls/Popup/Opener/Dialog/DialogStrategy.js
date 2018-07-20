/**
 * Created by as.krasilnikov on 21.03.2018.
 */
define('Controls/Popup/Opener/Dialog/DialogStrategy', [], function() {
   return {

      /**
       * Возвращает позицию диалогового окна
       * @function Controls/Popup/Opener/Dialog/Strategy#getPosition
       * @param wWidth ширина окна браузера
       * @param wHeight высота окна браузера
       * @param sizes размеры диалогового окна
       */
      getPosition: function(wWidth, wHeight, containerSizes, popupOptions) {
         var width, height, left, top;

         if (popupOptions.maximize) {
            width = wWidth;
            height = wHeight;
         } else {
            width = !popupOptions.maximize ? this._calculateValue(popupOptions.minWidth, popupOptions.maxWidth, containerSizes.width, wWidth) : wWidth;
            height = !popupOptions.maximize ? this._calculateValue(popupOptions.minHeight, popupOptions.maxHeight, containerSizes.height, wHeight) : wHeight;
         }

         left = this._getCoord(wWidth, width);
         top = this._getCoord(wHeight, height);

         //don't limit container size when it fit in window
         if (!popupOptions.minWidth && !popupOptions.maxWidth && width < wWidth) {
            width = undefined;
         }

         if (!popupOptions.minHeight && !popupOptions.maxHeight && height < wHeight) {
            height = undefined;
         }

         return {
            width: width,
            height: height,
            left: left,
            top: top
         };
      },
      _calculateValue: function(minRange, maxRange, containerValue, windowValue) {
         var hasMinValue = true;

         if (!minRange && !maxRange) {
            minRange = maxRange = containerValue;
            hasMinValue = false;
         }

         if (windowValue - maxRange >= 0) {
            return maxRange;
         }
         if (hasMinValue) {
            return windowValue > minRange ? windowValue : minRange;
         }
         return windowValue;
      },
      _getCoord: function(windowValue, value) {
         var coord = Math.round((windowValue - value) / 2);
         return Math.max(coord, 0);
      }
   };
});
