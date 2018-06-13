define('SBIS3.CONTROLS/Mixins/CompositeViewMixin/resources/DimensionsUtil', [
], function() {
   return {
      calcOutsideDimensions: function(item) {
         var
            itemRect = item.get(0).getBoundingClientRect(),
            additionalWidth = Math.floor(itemRect.width / 2),
            margin = Math.floor(item.outerWidth(true) / 2 - additionalWidth),
            additionalHeight = Math.floor(item.outerHeight(true) / 2);

         return {
            padding: Math.ceil(additionalHeight / 2) + 'px ' + Math.ceil(additionalWidth / 2) + 'px',
            margin: '' + Math.floor(-(additionalHeight / 2 - margin)) + 'px ' + Math.floor(-(additionalWidth / 2 - margin)) + 'px'
         };
      },
      calcInsideDimensions: function(item, container) {
         var
            itemRects = item.get(0).getBoundingClientRect(),
            additionalWidth = Math.floor(itemRects.width / 2),
            margin = Math.floor(item.outerWidth(true) / 2 - additionalWidth),
            additionalHeight = Math.floor(item.outerHeight(true) / 2),
            containerRects = container.get(0).getBoundingClientRect(),
            horizontalRightDiffer = containerRects.width - (itemRects.width + item.get(0).offsetLeft + additionalWidth / 2),
            horizontalLeftDiffer = item.get(0).offsetLeft - additionalWidth / 2,
            verticalBottomDiffer = containerRects.height - (itemRects.height + item.get(0).offsetTop + additionalHeight / 2),
            verticalTopDiffer = item.get(0).offsetTop - additionalHeight / 2,
            marginLeft,
            marginRight,
            marginTop,
            marginBottom,
            paddingTop = Math.ceil(additionalHeight / 2),
            paddingBottom = Math.ceil(additionalWidth / 2);

         marginTop = marginBottom = Math.floor(-(additionalHeight / 2 - margin));
         marginLeft = marginRight = Math.floor(-(additionalWidth / 2 - margin));
         if (horizontalLeftDiffer < 0) {
            marginRight += marginLeft;
            marginLeft = 0;
         } else if (horizontalRightDiffer < 0) {
            marginLeft += marginRight;
            marginRight = 0;
         }
         if (verticalTopDiffer < 0) {
            marginBottom += marginTop;
            marginTop = 0;
         } else if (verticalBottomDiffer < 0) {
            marginTop += marginBottom;
            marginBottom = 0;
         }

         return {
            padding: paddingTop + 'px ' + paddingBottom + 'px',
            margin: marginTop + 'px ' + marginRight + 'px ' + marginBottom + 'px ' + marginLeft + 'px'
         };
      }
   };
});
