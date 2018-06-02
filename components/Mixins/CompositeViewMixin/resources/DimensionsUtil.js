define('SBIS3.CONTROLS/Mixins/CompositeViewMixin/resources/DimensionsUtil', [
], function() {
   return {
      calcOutsideDimensions: function(item) {
         var
            additionalWidth = Math.floor(item.outerWidth() / 2),
            margin = Math.floor(item.outerWidth(true) / 2 - additionalWidth),
            additionalHeight = Math.floor(item.outerHeight() / 2);

         return {
            padding: Math.ceil(additionalHeight / 2) + 'px ' + Math.ceil(additionalWidth / 2) + 'px',
            margin: '' + Math.floor(-(additionalHeight / 2 - margin)) + 'px ' + Math.floor(-(additionalWidth / 2 - margin)) + 'px'
         };
      },
      calcInsideDimensions: function(item, container) {
         var
            additionalWidth = Math.floor(item.outerWidth() / 2),
            margin = Math.floor(item.outerWidth(true) / 2 - additionalWidth),
            additionalHeight = Math.floor(item.outerHeight() / 2),
            containerRects = container.get(0).getBoundingClientRect(),
            itemRects = item.get(0).getBoundingClientRect(),
            horizontalRightDiffer = containerRects.width - (itemRects.width + item.get(0).offsetLeft + additionalWidth / 2),
            horizontalLeftDiffer = item.get(0).offsetLeft - additionalWidth / 2,
            verticalBottomDiffer = containerRects.height - (itemRects.height + item.get(0).offsetTop + additionalHeight / 2),
            verticalTopDiffer = item.get(0).offsetTop - additionalHeight / 2 ,
            marginLeft,
            marginRight,
            marginTop,
            marginBottom,
            padding = Math.ceil(additionalHeight / 2) + 'px ' + Math.ceil(additionalWidth / 2) + 'px';

         marginTop = marginBottom = (Math.floor(-(additionalHeight / 2 - margin)) + 'px ');
         marginLeft = marginRight = (Math.floor(-(additionalWidth / 2 - margin)) + 'px ');
         if (horizontalLeftDiffer < 0) {
            marginRight = (Math.floor(-(additionalWidth - margin)) + 'px ');
            marginLeft = 0;
         } else if (horizontalRightDiffer < 0) {
            marginLeft = (Math.floor(-(additionalWidth - margin)) + 'px');
            marginRight = 0 + ' ';
         }
         if (verticalTopDiffer < 0) {
            marginBottom = (Math.floor(-(additionalHeight - margin)) + 'px ');
            marginTop = 0 + ' ';
         } else if (verticalBottomDiffer < 0) {
            marginTop = (Math.floor(-(additionalHeight - margin)) + 'px ');
            marginBottom = 0 + ' ';
         }

         return {
            padding: padding,
            margin: marginTop + marginRight + marginBottom + marginLeft
         };
      }
   }
});
