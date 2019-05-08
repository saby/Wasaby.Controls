/**
 * Created by as.krasilnikov on 21.03.2018.
 */

   // Minimum popup indentation from the right edge
   var MINIMAL_PANEL_DISTANCE = 20;

   var _private = {
      getPanelWidth: function(item, tCoords, maxPanelWidth) {
         var panelWidth;
         var maxPanelWidthWithOffset = maxPanelWidth - tCoords.right;
         var minWidth = parseInt(item.popupOptions.minWidth, 10);
         var maxWidth = parseInt(item.popupOptions.maxWidth, 10);
         var availableMaxWidth = Math.min(item.popupOptions.maxWidth, maxPanelWidth);

         if (item.popupOptions.width) {
            // todo: https://online.sbis.ru/opendoc.html?guid=256679aa-fac2-4d95-8915-d25f5d59b1ca
            panelWidth = Math.min(item.popupOptions.width, availableMaxWidth); // less then maxWidth
            panelWidth = Math.max(panelWidth, item.popupOptions.minimizedWidth || minWidth || 0); // more then minWidth
         } else if (minWidth > maxPanelWidthWithOffset) { // If the minimum width does not fit into the screen - positioned on the right edge of the window
            if (_private.isMaximizedPanel(item)) {
               minWidth = item.popupOptions.minimizedWidth;
            }
            if (minWidth > maxPanelWidthWithOffset) {
               tCoords.right = 0;
            }
            panelWidth = minWidth;
         } else if (_private.isMaximizedPanel(item)) { // todo:https://online.sbis.ru/opendoc.html?guid=8f7f8cea-b39d-4046-b5b2-f8dddae143ad
            if (!_private.isMaximizedState(item)) {
               panelWidth = item.popupOptions.minimizedWidth;
            } else {
               panelWidth = Math.min(maxWidth, maxPanelWidthWithOffset);
            }
         }
         return panelWidth;
      },
      isMaximizedPanel: function(item) {
         return !!item.popupOptions.minimizedWidth;
      },

      isMaximizedState: function(item) {
         return !!item.popupOptions.maximized;
      },
      calculateMaxWidth: function(self, popupMaxWidth, tCoords) {
         let maxPanelWidth = self.getMaxPanelWidth();
         if (popupMaxWidth) {
            return Math.min(popupMaxWidth, maxPanelWidth - tCoords.right);
         }
         return maxPanelWidth;
      }
   };

   export = {

      /**
       * Returns popup position
       * @function Controls/_popup/Opener/Stack/StackController#getPosition
       * @param tCoords Coordinates of the container relative to which the panel is displayed
       * @param item Popup configuration
       */
      getPosition: function(tCoords, item) {
         var maxPanelWidth = this.getMaxPanelWidth();
         var width = _private.getPanelWidth(item, tCoords, maxPanelWidth);
         var position = {
            stackWidth: width,
            right: item.hasMaximizePopup ? 0 : tCoords.right,
            top: tCoords.top,
            bottom: 0,
            position: 'fixed'
         };

         if (item.popupOptions.minWidth) {
            // todo: Удалить minimizedWidth https://online.sbis.ru/opendoc.html?guid=8f7f8cea-b39d-4046-b5b2-f8dddae143ad
            position.stackMinWidth = item.popupOptions.minimizedWidth || item.popupOptions.minWidth;
         }
         position.stackMaxWidth = _private.calculateMaxWidth(this, item.popupOptions.maxWidth, tCoords);

         return position;
      },

      /**
       * Returns the maximum possible width of popup
       * @function Controls/_popup/Opener/Stack/StackController#getMaxPanelWidth
       */
      getMaxPanelWidth: function() {
         return window.innerWidth - MINIMAL_PANEL_DISTANCE;
      },

      isMaximizedPanel: _private.isMaximizedPanel,

      _private: _private
   };

