define('Controls/BreadCrumbs/ItemsViewModel', [
   'Core/Abstract',
   'tmpl!Controls/BreadCrumbs/resources/itemTemplate',
   'Core/helpers/Object/isEqual'
], function(Abstract,
   itemTemplate,
   isEqual
) {
   'use strict';

   var
      _private = {
         getItemsSizes: function(self, items) {
            //TODO: по сути копипаста, но так быстрее, чем мерять все айтемы по отдельности
            var
               measurer = document.createElement('div'),
               itemsSizes = [],
               itemsString;

            itemsString = items.reduce(function(acc, item, index) {
               return acc + itemTemplate({
                  itemData: self.getItemData(index, items)
               });
            }, '');

            measurer.innerHTML = itemsString;
            measurer.classList.add('controls-BreadCrumbsV__measurer');
            document.body.appendChild(measurer);
            [].forEach.call(measurer.getElementsByClassName('controls-BreadCrumbsV__crumb'), function(item) {
               itemsSizes.push(item.clientWidth);
            });
            document.body.removeChild(measurer);

            return itemsSizes;
         },

         shouldRedraw: function(currentItems, newItems, currentWidth, availableWidth) {
            return  !isEqual(currentItems, newItems) || currentWidth !== availableWidth;
         },

         canBlur: function(itemWidth, currentWidth, availableWidth) {
            //TODO: неправильно работает, я сейчас учитываю ширину стрелки.
            return itemWidth > BREAD_CRUMB_MIN_WIDTH && currentWidth - itemWidth + BREAD_CRUMB_MIN_WIDTH < availableWidth;
         },

         calculateBreadCrumbsToDraw: function(self, itemsSizes, availableWidth) {
            //TODO: hiddenItems на самом деле не нужны, т.к. в меню отображаются все айтемы
            var
               length = itemsSizes.length,
               i = length - 2,
               currentWidth,
               blurredItemIndex;
            self._visibleItems = [];
            self._hiddenItems = [];

            currentWidth = itemsSizes.reduce(function(acc, width) {
               return acc + width;
            }, 0);

            if (length > 2 && currentWidth > availableWidth) {
               //Сначала пробуем замылить предпоследний элемент
               if (_private.canBlur(itemsSizes[length - 2], currentWidth, availableWidth)) {
                  blurredItemIndex = length - 2;
               } else {
                  //Если замылить не получилось, то добавляем точки
                  currentWidth += DOTS_WIDTH;

                  for (i; i > 0; i--) {
                     if (currentWidth < availableWidth) {
                        break;
                     } else if (_private.canBlur(itemsSizes[i], currentWidth, availableWidth)) {
                        blurredItemIndex = i;
                        break;
                     } else {
                        currentWidth -= itemsSizes[i];
                        self._hiddenItems.push(self._items[i]);
                     }
                  }

                  // //Если осталось всего 2 крошки, но места все равно не хватает, то замыливаем первый элемент
                  // if (i === 0 && currentWidth > availableWidth) {
                  //    blurredItemIndex = 0;
                  // }
               }

               for (var j = 0; j <= i; j++) {
                  self._visibleItems.push({
                     item: self._items[j],
                     isBlurred: j === blurredItemIndex
                  });
               }

               if (self._hiddenItems.length > 0) {
                  self._visibleItems.push({
                     item: {
                        title: '...'
                     },
                     isDots: true
                  });
               }

               self._visibleItems.push({
                  item: self._items[length - 1]
               });
            } else {
               self._visibleItems = self._items.map(function(item) {
                  return {
                     item: item
                  };
               });
            }
         },

         getWidth: function(element) {
            var
               measurer = document.createElement('div'),
               width;
            measurer.classList.add('controls-BreadCrumbsV__measurer');

            //TODO: нужно эскейпить, наверное
            measurer.innerHTML = element;
            document.body.appendChild(measurer);
            width = measurer.clientWidth;
            document.body.removeChild(measurer);
            return width;
         }
      },
      //TODO: если создается из Explorer, то сss-ка BreadCrumbs не подгружена, т.е. все расчеты будут заведомо неправильными
      BREAD_CRUMB_MIN_WIDTH = _private.getWidth('<div class="controls-BreadCrumbsV__title_min"></div>'),
      DOTS_WIDTH = _private.getWidth(itemTemplate({
         itemData: {
            item: {
               title: '...'
            },
            isDots: true,
            hasArrow: true
         }
      }));

   var ItemsViewModel = Abstract.extend({
      _visibleItems: [],
      _hiddenItems: [],

      getItemData: function(index, items) {
         var
            currentItem = items[index],
            count = items.length;
         return {
            item: currentItem.item,
            hasArrow: count > 1 && index !== count - 1,
            isBlurred: currentItem.isBlurred,
            isDots: currentItem.isDots
         };
      },

      setItems: function(items) {
         this._items = items;
      },

      recalcCrumbs: function(availableWidth) {
         //TODO: добавить shouldRedraw
         var items = this._items.map(function(item) {
            return {
               item: item
            }
         });
         _private.calculateBreadCrumbsToDraw(this, _private.getItemsSizes(this, items), availableWidth);
      },

      getItemsSizes: function() {
         var items = this._items.map(function(item) {
            return {
               item: item
            }
         });
         return _private.getItemsSizes(this, items).reduce(function(acc, width) {
            return acc + width;
         }, 0);
      }
   });

   return ItemsViewModel;
});
