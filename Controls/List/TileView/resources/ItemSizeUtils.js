define('Controls/List/TileView/resources/ItemSizeUtils', [], function() {
   'use strict';

   return {
      getItemSize: function(item, zoomCoefficient) {
         var
            result,
            tileContent = item.getElementsByClassName('controls-TileView__itemContent')[0];
         tileContent.classList.add('controls-TileView__item_hovered');
         tileContent.style.width = tileContent.clientWidth * zoomCoefficient + 'px';

         result = {
            width: tileContent.clientWidth,
            height: tileContent.clientHeight
         };

         tileContent.style.width = '';
         tileContent.classList.remove('controls-TileView__item_hovered');

         return result;
      }
   };
});
