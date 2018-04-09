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
      getPosition: function(wWidth, wHeight, sizes) {
         return {
            left: Math.round((wWidth - sizes.width) / 2),
            top: Math.round((wHeight - sizes.height) / 2)
         };
      }
   };
});
