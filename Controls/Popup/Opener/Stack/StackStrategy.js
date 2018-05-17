/**
 * Created by as.krasilnikov on 21.03.2018.
 */
define('Controls/Popup/Opener/Stack/StackStrategy', [], function() {
   var PANEL_SHADOW_WIDTH = 5; // Отступ контейнера под тень
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
      getPosition: function(index, tCoords, width, maxWidth, prevWidth, prevRight) {
         var
            top = tCoords.top,
            right = tCoords.right;
         if (index !== 0) {
            if (prevWidth) {
               var rightCalc = 100 - (width - prevWidth - prevRight);
               if (rightCalc > 0) {
                  right = Math.max(100, rightCalc);
                  if ((width + right) > maxWidth) {
                     return null;
                  }
               }
            } else {
               return {
                  width: width + PANEL_SHADOW_WIDTH,
                  right: this._getContentOffset(),
                  top: 0,
                  bottom: 0
               };
            }
         }
         return {
            width: width + PANEL_SHADOW_WIDTH,
            right: right + this._getContentOffset(),
            top: top,
            bottom: 0
         };
      },
      _getContentOffset: function() {
         var contentArea = document.getElementsByClassName('controls-content')[0];
         if (contentArea) {
            return document.body.offsetWidth - contentArea.getBoundingClientRect().width;
         }
         return 0;
      }
   };
});
