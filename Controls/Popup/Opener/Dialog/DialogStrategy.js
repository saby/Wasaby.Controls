/**
 * Created by as.krasilnikov on 21.03.2018.
 */
define('Controls/Popup/Opener/Dialog/DialogStrategy', [], function() {
   return {

      /**
       * Returns popup position
       * @function Controls/Popup/Opener/Dialog/Strategy#getPosition
       * @param windowData The parameters of the browser window
       * @param containerSizes Popup container sizes
       * @param item Popup configuration
       */
      getPosition: function(windowData, containerSizes, item) {
         var width, height, left, top, dif;

         if (item.dragged) {
            left = Math.max(0, item.position.left);
            top = Math.max(0, item.position.top);

            // check overflowX
            dif = (item.position.left + containerSizes.width) - windowData.width;
            left -= Math.max(0, dif);

            // check overflowY
            dif = (item.position.top + containerSizes.height) - windowData.height;
            top -= Math.max(0, dif);
            return {
               left: left,
               top: top,
               width: item.position.width,
               height: item.position.height
            };
         }

         var popupOptions = item.popupOptions;

         if (popupOptions.maximize) {
            width = windowData.width;
            height = windowData.height;
         } else {
            width = !popupOptions.maximize ? this._calculateValue(popupOptions.minWidth, popupOptions.maxWidth, containerSizes.width, windowData.width) : windowData.width;
            height = !popupOptions.maximize ? this._calculateValue(popupOptions.minHeight, popupOptions.maxHeight, containerSizes.height, windowData.height) : windowData.height;
         }

         left = this._getLeftCoord(windowData.width, width);
         top = this._getTopCoord(windowData, height);

         // don't limit container size when it fit in window
         if (!popupOptions.minWidth && !popupOptions.maxWidth && width < windowData.width) {
            width = undefined;
         }

         if (!popupOptions.minHeight && !popupOptions.maxHeight && height < windowData.height) {
            height = undefined;
         }

         var availableMaxWidth = Math.min(popupOptions.maxWidth || windowData.width, windowData.width);
         var availableMaxHeight = Math.min(popupOptions.maxHeight || windowData.height, windowData.height);

         return {
            width: width,
            height: height,
            maxHeight: Math.max(availableMaxHeight, popupOptions.minHeight || 0),
            maxWidth: Math.max(availableMaxWidth, popupOptions.minWidth || 0),
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
      _getLeftCoord: function(wWidth, width) {
         return Math.max(Math.round((wWidth - width) / 2), 0);
      },

      _getTopCoord: function(windowData, height) {
         var coord = Math.round((windowData.height - height) / 2) + windowData.scrollTop;
         return Math.max(coord, windowData.scrollTop);
      }
   };
});
