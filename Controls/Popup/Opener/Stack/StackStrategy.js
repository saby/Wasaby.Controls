/**
 * Created by as.krasilnikov on 21.03.2018.
 */
define('Controls/Popup/Opener/Stack/StackStrategy', [], function() {
   var PANEL_SHADOW_WIDTH = 8; // Отступ контейнера под тень
   var MINIMAL_PANEL_DISTANCE = 20; // минимальный отступ стековой панели от правого края

   var _private = {
      getPanelWidth: function(item, tCoords, maxPanelWidth) {
         var maxPanelWidthWithOffset = maxPanelWidth - tCoords.right;
         var minWidth = item.popupOptions.minWidth;
         var maxWidth = item.popupOptions.maxWidth;

         if (!minWidth || !maxWidth) { // Если не заданы размеры - строимся по размерам контейнера
            return Math.min(item.containerWidth, maxPanelWidthWithOffset); //По ширине контента, но не больше допустимого значения
         }

         if (maxWidth <= maxPanelWidthWithOffset) {
            return maxWidth;
         }
         if (minWidth > maxPanelWidthWithOffset) { // Если минимальная ширина не умещается в экран - позиционируемся по правому краю окна
            tCoords.right = 0;
            return minWidth;
         }

         return maxPanelWidthWithOffset; //Возвращаем допустимую ширину
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
            width: _private.getPanelWidth(item, tCoords, this.getMaxPanelWidth()) + PANEL_SHADOW_WIDTH,
            right: tCoords.right,
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
      }
   };
});
