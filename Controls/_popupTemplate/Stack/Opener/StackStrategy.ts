/**
 * Created by as.krasilnikov on 21.03.2018.
 */
   import {detection} from 'Env/Env';
   interface IPosition {
      right: Number,
      top: Number,
      bottom: Number,
      stackWidth?: Number,
      stackMinWidth?: Number,
      stackMaxWidth?: Number,
      position?: String
   }

   // Minimum popup indentation from the right edge
   const MINIMAL_PANEL_DISTANCE = 100;

   const _private = {
      getPanelWidth: function(item, tCoords, maxPanelWidth) {
         let panelWidth;
         let maxPanelWidthWithOffset = maxPanelWidth - tCoords.right;
         let minWidth = parseInt(item.popupOptions.minWidth, 10);
         let maxWidth = parseInt(item.popupOptions.maxWidth, 10);
         let availableMaxWidth = _private.getAvailableMaxWidth(item.popupOptions.maxWidth, maxPanelWidth);

         if (_private.isMaximizedPanel(item)) { // todo:https://online.sbis.ru/opendoc.html?guid=8f7f8cea-b39d-4046-b5b2-f8dddae143ad
            if (!_private.isMaximizedState(item)) {
               panelWidth = item.popupOptions.minimizedWidth;
            } else {
               panelWidth = Math.min(maxWidth, maxPanelWidthWithOffset);
            }
         } else if (item.popupOptions.width) {
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
         } 
         return panelWidth;
      },

      getAvailableMaxWidth (itemMaxWidth: number, maxPanelWidth: number): number {
         return itemMaxWidth ? Math.min(itemMaxWidth, maxPanelWidth) : maxPanelWidth;
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
       * @function Controls/_popupTemplate/Stack/Opener/StackController#getPosition
       * @param tCoords Coordinates of the container relative to which the panel is displayed
       * @param item Popup configuration
       */
      getPosition: function(tCoords, item):IPosition {
         var maxPanelWidth = this.getMaxPanelWidth();
         var width = _private.getPanelWidth(item, tCoords, maxPanelWidth);
         let position:IPosition = {
            stackWidth: width,
            right: item.hasMaximizePopup ? 0 : tCoords.right,
            top: tCoords.top,
            bottom: 0
         };

         // on mobile device fixed container proxying scroll on bottom container
         if (!detection.isMobilePlatform) {
            position.position = "fixed";
         }

         if (item.popupOptions.minWidth) {
            // todo: Удалить minimizedWidth https://online.sbis.ru/opendoc.html?guid=8f7f8cea-b39d-4046-b5b2-f8dddae143ad
            position.stackMinWidth = item.popupOptions.minimizedWidth || item.popupOptions.minWidth;
         }
         position.stackMaxWidth = _private.calculateMaxWidth(this, item.popupOptions.maxWidth, tCoords);

         return position;
      },

      /**
       * Returns the maximum possible width of popup
       * @function Controls/_popupTemplate/Stack/Opener/StackController#getMaxPanelWidth
       */
      getMaxPanelWidth: function() {
         // window.innerWidth брать нельзя, при масштабировании на ios это значение меняется, что влияет на ширину панелей.
         return document.body.clientWidth - MINIMAL_PANEL_DISTANCE;
      },

      isMaximizedPanel: _private.isMaximizedPanel,

      _private: _private
   };

