/**
 * Created by as.krasilnikov on 21.03.2018.
 */
define('Controls/Popup/Opener/Stack/StackStrategy', [], function() {
   var PANEL_SHADOW_WIDTH = 8; // Отступ контейнера под тень
   var MINIMAL_PANEL_DISTANCE = 20; // минимальный отступ стековой панели от правого края

   var _private = {
      getPanelWidth: function(item, tCoords, maxPanelWidth) {
         var panelWidth;
         var maxPanelWidthWithOffset = maxPanelWidth - tCoords.right;
         var minWidth = parseInt(item.popupOptions.minWidth, 10);
         var maxWidth = parseInt(item.popupOptions.maxWidth, 10);

         if (_private.isMaximizedPanel(item) && !_private.isMaximizedState(item)) {
            panelWidth = item.popupOptions.minimizedWidth;
         } else if (!minWidth || !maxWidth) { // Если не заданы размеры - строимся по размерам контейнера
            if (item.containerWidth > maxPanelWidthWithOffset) {
               panelWidth = maxPanelWidthWithOffset; //По ширине контента, но не больше допустимого значения
            }
         } else if (maxWidth <= maxPanelWidthWithOffset) {
            panelWidth = maxWidth;
         } else if (minWidth > maxPanelWidthWithOffset) { // Если минимальная ширина не умещается в экран - позиционируемся по правому краю окна
            if (_private.isMaximizedPanel(item)) {
               minWidth = item.popupOptions.minimizedWidth;
            }
            if (minWidth > maxPanelWidthWithOffset) {
               tCoords.right = 0; // Если минимальная ширина не умещается в экран - позиционируемся по правому краю окна
            }
            panelWidth = minWidth;
         } else {
            panelWidth = maxPanelWidthWithOffset; //Возвращаем допустимую ширину
         }

         return panelWidth;
      },
      isMaximizedPanel: function(item) {
         return !!item.popupOptions.minimizedWidth;
      },

      isMaximizedState: function(item) {
         return !!item.popupOptions.maximized;
      }
   };

   return {

      /**
       * Возвращает позицию стек-панели
       * @function Controls/Popup/Opener/Stack/StackController#stack
       * @param tCoords Координаты контейнера, относительно которого показывается панель
       * @param item Конфиг позиционируемой панели
       */
      getPosition: function(tCoords, item) {
         return {
            width: _private.getPanelWidth(item, tCoords, this.getMaxPanelWidth()),
            right: item.hasMaximizePopup ? 0 : tCoords.right,
            top: tCoords.top,
            bottom: 0
         };
      },

      /**
       * Расчитываает максимально возможную ширину панели
       * @function Controls/Popup/Opener/Stack/StackController#getMaxPanelWidth
       * @param wWidth ширина окна
       */
      getMaxPanelWidth: function() {
         return window.innerWidth - MINIMAL_PANEL_DISTANCE - PANEL_SHADOW_WIDTH;
      },

      isMaximizedPanel: _private.isMaximizedPanel
   };
});
