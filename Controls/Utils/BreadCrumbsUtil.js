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

   return {
      ARROW_WIDTH: 0,
      HOME_WIDTH: 0,
      BREAD_CRUMB_MIN_WIDTH: 0,
      DOTS_WIDTH: 0,

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
               return this.getItemData(index, items);
            }.bind(this))
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
         return itemWidth > this.BREAD_CRUMB_MIN_WIDTH && currentWidth - itemWidth + this.BREAD_CRUMB_MIN_WIDTH < availableWidth;
      },

      calculateBreadCrumbsToDraw: function(self, items, itemsSizes, availableWidth) {
         var
            length = itemsSizes.length,
            currentWidth,
            shrinkedItemIndex;
         self._visibleItems = [];

         currentWidth = itemsSizes.reduce(function(acc, width) {
            return acc + width;
         }, 0) + this.HOME_WIDTH;

         if (currentWidth > availableWidth) {
            if (length > 2) {
               //Сначала пробуем замылить предпоследний элемент
               if (this.canShrink(itemsSizes[length - 2], currentWidth, availableWidth)) {
                  for (var j = 0; j < length; j++) {
                     self._visibleItems.push(this.getItemData(j, items, j === length - 2));
                  }
               } else {
                  //Если замылить не получилось, то добавляем точки
                  currentWidth += this.DOTS_WIDTH;

                  for (var i = length - 2; i > 0; i--) {
                     if (currentWidth <= availableWidth) {
                        break;
                     } else if (this.canShrink(itemsSizes[i], currentWidth, availableWidth)) {
                        shrinkedItemIndex = i;
                        currentWidth -= itemsSizes[i] - this.BREAD_CRUMB_MIN_WIDTH;
                        break;
                     } else {
                        currentWidth -= itemsSizes[i];
                     }
                  }

                  //Если осталось всего 2 крошки, но места все равно не хватает, то пытаемся обрезать первый элемент.
                  if (i === 0 && currentWidth > availableWidth && itemsSizes[0] - this.ARROW_WIDTH > this.BREAD_CRUMB_MIN_WIDTH) {
                     shrinkedItemIndex = 0;
                  }

                  for (var j = 0; j <= i; j++) {
                     self._visibleItems.push(this.getItemData(j, items, j === shrinkedItemIndex));
                  }

                  self._visibleItems.push({
                     getPropValue: ItemsUtil.getPropertyValue,
                     item: {
                        title: '...'
                     },
                     isDots: true,
                     hasArrow: true
                  });

                  self._visibleItems.push(this.getItemData(length - 1, items, i === 0 && currentWidth > availableWidth && itemsSizes[length - 1] - this.ARROW_WIDTH > this.BREAD_CRUMB_MIN_WIDTH));
               }
            } else {
               self._visibleItems = items.map(function(item, index, items) {
                  var
                     hasArrow = index !== 1,
                     withOverflow = itemsSizes[index] - (hasArrow ? this.ARROW_WIDTH : 0) > this.BREAD_CRUMB_MIN_WIDTH;
                  return this.getItemData(index, items, withOverflow);
               }.bind(this));
            }
         } else {
            self._visibleItems = items.map(function(item, index, items) {
               return this.getItemData(index, items);
            }.bind(this));
         }
      },

      calculateConstants: function() {
         this.ARROW_WIDTH = this.getWidth('<span class="controls-BreadCrumbsV__arrow icon-size icon-DayForward icon-primary action-hover"></span>');
         this.HOME_WIDTH = this.getWidth('<div class="controls-BreadCrumbsV__home icon-size icon-Home3 icon-primary"></div>');
         this.BREAD_CRUMB_MIN_WIDTH = this.getWidth('<div class="controls-BreadCrumbsV__title_min"></div>');
         this.DOTS_WIDTH = this.getWidth(itemTemplate({
            itemData: {
               getPropValue: ItemsUtil.getPropertyValue,
               item: {
                  title: '...'
               },
               isDots: true,
               hasArrow: true
            }
         }));
      },

      getMaxCrumbsWidth: function(items) {
         return this.getItemsSizes(items, itemsTemplate, itemTemplate).reduce(function(acc, width) {
            return acc + width;
         }, 0) + this.HOME_WIDTH;
      },

      shouldRedraw: function(currentItems, newItems, oldWidth, availableWidth) {
         return currentItems !== newItems || oldWidth !== availableWidth;
      },

      onItemClick: function(self, originalEvent, item, isDots) {
         if (isDots) {

            //Оборачиваю айтемы в рекордсет чисто ради того, чтобы меню могло с ними работать
            //Нельзя сделать source, т.к. с ним оно не умеет работать
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
         if (actionName === 'itemClick') {
            var item = args.data && args.data[0] && args.data[0].getRawData();
            self._onItemClick(event, {}, item);
         }
         self._children.menuOpener.close();
      }
   };
});
