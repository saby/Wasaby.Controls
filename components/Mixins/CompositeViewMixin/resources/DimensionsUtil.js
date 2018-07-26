define('SBIS3.CONTROLS/Mixins/CompositeViewMixin/resources/DimensionsUtil', [
], function() {
   'use strict';
   //Высота title без наведения. 18px height + 4px*2 padding + 1px border top
   var
      TITLE_HEIGHT = 27,
      scaleCoefficient = 1.5;

   var _private = {
      getTitleHeight: function(item, increaseSize) {
         var
            result,
            title = $('.controls-CompositeView__tileTitle', item);

         //Увеличиваем размер title чтобы правильно посчитать высоту, т.к. без увеличения title может быть в 2 строки,
         //а после увеличения влезть в одну, тогда мы неправильно посчитаем размер плитки.
         if (increaseSize) {
            title.css('width', 100 * scaleCoefficient + '%');
         }
         result =  $('.controls-CompositeView__tileTitle', item).outerHeight(true) - (item.hasClass('controls-CompositeView__item-withTitle') ? TITLE_HEIGHT : 0);
         title.css('width', '');
         return result;
      }
   };

   return {
      calcOutsideDimensions: function(item) {
         var
            itemRect = item.get(0).getBoundingClientRect(),
            additionalWidth = Math.floor(itemRect.width / 2),
            margin = Math.floor(item.outerWidth(true) / 2 - additionalWidth),
            additionalHeight = Math.floor(itemRect.height / 2),
            titleHeight = _private.getTitleHeight(item, true);

         return {
            padding: Math.ceil(additionalHeight / 2) + 'px ' + Math.ceil(additionalWidth / 2) + 'px ' + Math.ceil(additionalHeight / 2 + titleHeight) + 'px ' + Math.ceil(additionalWidth / 2) + 'px',
            margin: Math.floor(-(additionalHeight / 2 - margin)) + 'px ' + Math.floor(-(additionalWidth / 2 - margin)) + 'px ' + Math.floor(-(additionalHeight / 2 - margin) - titleHeight) + 'px ' + Math.floor(-(additionalWidth / 2 - margin)) + 'px'
         };
      },
      calcTitleDimensions: function(item) {
         var
            offset = _private.getTitleHeight(item),
            boundingClientRect = item.get(0).getBoundingClientRect(),
            margin = (Math.floor(item.outerHeight(true)) - Math.floor(boundingClientRect.height)) / 2;
         return {
            'padding-bottom': offset,
            'margin-bottom': -(offset - margin)
         };
      },
      getMargin: function(item) {
         var itemRect = item.get(0).getBoundingClientRect();
         return Math.round(item.outerWidth(true) - itemRect.width) / 2;
      },
      calcInsideDimensions: function(item, container) {
         var
            itemRects = item.get(0).getBoundingClientRect(),
            additionalWidth = Math.floor(itemRects.width / 2),
            margin = Math.floor(item.outerWidth(true) / 2 - additionalWidth),
            additionalHeight = Math.floor(itemRects.height / 2),
            containerRects = container.get(0).getBoundingClientRect(),
            horizontalRightDiffer = containerRects.width - (itemRects.width + item.get(0).offsetLeft + additionalWidth / 2),
            horizontalLeftDiffer = item.get(0).offsetLeft - additionalWidth / 2,
            verticalBottomDiffer = containerRects.height - (itemRects.height + item.get(0).offsetTop + additionalHeight / 2),
            verticalTopDiffer = item.get(0).offsetTop - additionalHeight / 2,
            marginLeft,
            marginRight,
            marginTop,
            marginBottom,
            paddingVertical = Math.ceil(additionalHeight / 2),
            paddingHorizontal = Math.ceil(additionalWidth / 2),
            titleHeight = _private.getTitleHeight(item, true);

         marginTop = marginBottom = Math.floor(-(additionalHeight / 2 - margin));
         marginLeft = marginRight = Math.floor(-(additionalWidth / 2 - margin));
         if (horizontalLeftDiffer < 0) {
            marginRight = marginRight + marginLeft - margin;
            marginLeft = margin;
         } else if (horizontalRightDiffer < 0) {
            marginLeft = marginLeft + marginRight - margin;
            marginRight = margin;
         }
         if (verticalTopDiffer < 0) {
            marginBottom = marginBottom + marginTop - margin;
            marginTop = margin;
         } else if (verticalBottomDiffer < 0) {
            marginTop = marginTop + marginBottom - margin;
            marginBottom = margin;
         }

         return {
            padding: paddingVertical + 'px ' + paddingHorizontal + 'px ' + (paddingVertical + titleHeight) + 'px ' + paddingHorizontal + 'px',
            margin: marginTop + 'px ' + marginRight + 'px ' + (marginBottom - titleHeight) + 'px ' + marginLeft + 'px'
         };
      }
   };
});
