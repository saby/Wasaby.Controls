define('Controls/Utils/BreadCrumbsUtil', [
   'Controls/List/resources/utils/ItemsUtil',
   'tmpl!Controls/_BreadCrumbs/resources/itemsTemplate',
   'tmpl!Controls/_BreadCrumbs/resources/itemTemplate'
], function(
   ItemsUtil,
   itemsTemplate,
   itemTemplate
) {
   'use strict';

   var
      ARROW_WIDTH = 0,
      HOME_WIDTH = 0,
      BREAD_CRUMB_MIN_WIDTH = 0,
      DOTS_WIDTH = 0,
      initialized;

   var _private = {
      initializeConstants: function() {
         if (initialized) {
            return;
         }
         if (window) {
            ARROW_WIDTH = _private.getWidth('<span class="controls-BreadCrumbsV__arrow icon-size icon-DayForward icon-primary action-hover"></span>');
            HOME_WIDTH = _private.getWidth('<div class="controls-BreadCrumbsV__home icon-size icon-Home3 icon-primary"></div>');
            BREAD_CRUMB_MIN_WIDTH = _private.getWidth('<div class="controls-BreadCrumbsV__title_min"></div>');
            DOTS_WIDTH = _private.getWidth(itemTemplate({
               itemData: {
                  getPropValue: ItemsUtil.getPropertyValue,
                  item: {
                     title: '...'
                  },
                  isDots: true,
                  hasArrow: true
               }
            }));
         }
         initialized = true;
      },

      getItemData: function(index, items, withOverflow) {
         var
            currentItem = items[index],
            count = items.length;
         return {
            getPropValue: ItemsUtil.getPropertyValue,
            item: currentItem,
            hasArrow: count > 1 && index !== count - 1,
            withOverflow: withOverflow
         };
      },

      getItemsSizes: function(items) {
         var
            measurer = document.createElement('div'),
            itemsSizes = [];

         measurer.innerHTML = itemsTemplate({
            itemTemplate: itemTemplate,
            items: items.map(function(item, index) {
               return _private.getItemData(index, items);
            })
         });
         measurer.classList.add('controls-BreadCrumbsV__measurer');
         document.body.appendChild(measurer);
         [].forEach.call(measurer.getElementsByClassName('controls-BreadCrumbsV__crumb'), function(item) {
            itemsSizes.push(item.clientWidth);
         });
         document.body.removeChild(measurer);

         return itemsSizes;
      },

      getWidth: function(element) {
         var
            measurer = document.createElement('div'),
            width;
         measurer.classList.add('controls-BreadCrumbsV__measurer');

         if (typeof element === 'string') {
            measurer.innerHTML = element;
         } else {
            measurer.appendChild(element);
         }
         document.body.appendChild(measurer);
         width = measurer.clientWidth;
         document.body.removeChild(measurer);
         return width;
      },

      canShrink: function(itemWidth, currentWidth, availableWidth) {
         return itemWidth > BREAD_CRUMB_MIN_WIDTH && currentWidth - itemWidth + BREAD_CRUMB_MIN_WIDTH < availableWidth;
      }
   };

   return {
      getWidth: function(element) {
         return _private.getWidth(element);
      },

      calculateBreadCrumbsToDraw: function(self, items, availableWidth) {
         _private.initializeConstants();

         var
            itemsSizes = _private.getItemsSizes(items),
            length = items.length,
            currentWidth,
            shrinkedItemIndex;
         self._visibleItems = [];
         availableWidth -= HOME_WIDTH;

         currentWidth = itemsSizes.reduce(function(acc, width) {
            return acc + width;
         }, 0) + HOME_WIDTH;

         if (currentWidth > availableWidth) {
            if (length > 2) {
               //Сначала пробуем замылить предпоследний элемент
               if (_private.canShrink(itemsSizes[length - 2], currentWidth, availableWidth)) {
                  for (var j = 0; j < length; j++) {
                     self._visibleItems.push(_private.getItemData(j, items, j === length - 2));
                  }
               } else {
                  //Если замылить не получилось, то добавляем точки
                  currentWidth += DOTS_WIDTH;

                  for (var i = length - 2; i > 0; i--) {
                     if (currentWidth <= availableWidth) {
                        break;
                     } else if (_private.canShrink(itemsSizes[i], currentWidth, availableWidth)) {
                        shrinkedItemIndex = i;
                        currentWidth -= itemsSizes[i] - BREAD_CRUMB_MIN_WIDTH;
                        break;
                     } else {
                        currentWidth -= itemsSizes[i];
                     }
                  }

                  //Если осталось всего 2 крошки, но места все равно не хватает, то пытаемся обрезать первый элемент.
                  if (i === 0 && currentWidth > availableWidth && itemsSizes[0] - ARROW_WIDTH > BREAD_CRUMB_MIN_WIDTH) {
                     shrinkedItemIndex = 0;
                  }

                  for (var j = 0; j <= i; j++) {
                     self._visibleItems.push(_private.getItemData(j, items, j === shrinkedItemIndex));
                  }

                  self._visibleItems.push({
                     getPropValue: ItemsUtil.getPropertyValue,
                     item: {
                        title: '...'
                     },
                     isDots: true,
                     hasArrow: true
                  });

                  self._visibleItems.push(_private.getItemData(length - 1, items, i === 0 && currentWidth > availableWidth && itemsSizes[length - 1] - ARROW_WIDTH > BREAD_CRUMB_MIN_WIDTH));
               }
            } else {
               self._visibleItems = items.map(function(item, index, items) {
                  var
                     hasArrow = index !== 1,
                     withOverflow = itemsSizes[index] - (hasArrow ? ARROW_WIDTH : 0) > BREAD_CRUMB_MIN_WIDTH;
                  return _private.getItemData(index, items, withOverflow);
               });
            }
         } else {
            self._visibleItems = items.map(function(item, index, items) {
               return _private.getItemData(index, items);
            });
         }
      },

      getMaxCrumbsWidth: function(items) {
         _private.initializeConstants();

         return _private.getItemsSizes(items, itemsTemplate, itemTemplate).reduce(function(acc, width) {
            return acc + width;
         }, 0) + HOME_WIDTH;
      },

      shouldRedraw: function(currentItems, newItems, oldWidth, availableWidth) {
         return currentItems !== newItems || oldWidth !== availableWidth;
      }
   };
});
