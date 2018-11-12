define('Controls/List/TileView/resources/ItemSizeUtils', [], function() {
   'use strict';

   return {
      getItemSize: function(item, zoomCoefficient) {
         var
            result,
            rectAfterZoom,
            tileContent = item.querySelector('.controls-TileView__itemContent'),
            rectBeforeZoom = tileContent.getBoundingClientRect();
         tileContent.classList.add('controls-TileView__item_hovered');
         tileContent.style.width = rectBeforeZoom.width * zoomCoefficient + 'px';

         rectAfterZoom = tileContent.getBoundingClientRect();

         result = {
            width: rectAfterZoom.width,
            height: rectAfterZoom.height
         };

         tileContent.style.width = '';
         tileContent.classList.remove('controls-TileView__item_hovered');

         return result;
      }
   };
});
