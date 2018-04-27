define('Controls/Utils/BreadCrumbsUtil', [
   'Controls/List/resources/utils/ItemsUtil',
   'WS.Data/Collection/RecordSet',
   'tmpl!Controls/BreadCrumbs/resources/itemsTemplate',
   'tmpl!Controls/BreadCrumbs/resources/itemTemplate',
   'tmpl!Controls/BreadCrumbsController/resources/menuItemTemplate',
   'tmpl!Controls/BreadCrumbsController/resources/menuContentTemplate'
], function(
   ItemsUtil,
   RecordSet,
   itemsTemplate,
   itemTemplate,
   menuItemTemplate
) {
   'use strict';

   var _private = {
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

         measurer.innerHTML = element;
         document.body.appendChild(measurer);
         width = measurer.clientWidth;
         document.body.removeChild(measurer);
         return width;
      },

      canShrink: function(itemWidth, currentWidth, availableWidth) {
         return itemWidth > BREAD_CRUMB_MIN_WIDTH && currentWidth - itemWidth + BREAD_CRUMB_MIN_WIDTH < availableWidth;
      }
   };

   var
      ARROW_WIDTH = window && _private.getWidth('<span class="controls-BreadCrumbsV__arrow icon-size icon-DayForward icon-primary action-hover"></span>'),
      HOME_WIDTH = window && _private.getWidth('<div class="controls-BreadCrumbsV__home icon-size icon-Home3 icon-primary"></div>'),
      BREAD_CRUMB_MIN_WIDTH = window && _private.getWidth('<div class="controls-BreadCrumbsV__title_min"></div>'),
      DOTS_WIDTH = window && _private.getWidth(itemTemplate({
         itemData: {
            getPropValue: ItemsUtil.getPropertyValue,
            item: {
               title: '...'
            },
            isDots: true,
            hasArrow: true
         }
      }));

   return {
      getWidth: function(element) {
         return _private.getWidth(element);
      },

      calculateBreadCrumbsToDraw: function(self, items, availableWidth) {
         var
            itemsSizes = _private.getItemsSizes(items),
            length = itemsSizes.length,
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
         return _private.getItemsSizes(items, itemsTemplate, itemTemplate).reduce(function(acc, width) {
            return acc + width;
         }, 0) + HOME_WIDTH;
      },

      shouldRedraw: function(currentItems, newItems, oldWidth, availableWidth) {
         return currentItems !== newItems || oldWidth !== availableWidth;
      },

      onItemClick: function(self, originalEvent, item, isDots) {
         if (isDots) {

            //Оборачиваю айтемы в рекордсет чисто ради того, чтобы меню могло с ними работать
            //Нельзя сделать source, т.к. с ним оно не умеет работать
            //По этой задаче научится: https://online.sbis.ru/opendoc.html?guid=c46567a3-77ab-46b1-a8d2-aa29e0cdf9d0
            var rs = new RecordSet({
               rawData: self._options.items
            });
            rs.each(function(item, index) {
               item.set('indentation', index);
            });
            self._children.menuOpener.open({
               target: originalEvent.target,
               templateOptions: {
                  items: rs,
                  itemTemplate: menuItemTemplate
               }
            });
         } else {
            self._notify('itemClick', [item]);
         }
      },

      onResult: function(self, args) {
         var
            actionName = args && args.action,
            event = args && args.event;

         //todo: Особая логика событий попапа, исправить как будут нормально приходить аргументы
         //https://online.sbis.ru/opendoc.html?guid=0ca4b2db-b359-4e7b-aac6-97e061b953bf
         if (actionName === 'itemClick') {
            var item = args.data && args.data[0] && args.data[0].getRawData();
            self._onItemClick(event, {}, item);
         }
         self._children.menuOpener.close();
      }
   };
});
