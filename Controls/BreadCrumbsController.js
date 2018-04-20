define('Controls/BreadCrumbsController', [
   'Core/Control',
   'tmpl!Controls/BreadCrumbsController/BreadCrumbsController',
   'tmpl!Controls/BreadCrumbs/resources/itemsTemplate',
   'tmpl!Controls/BreadCrumbs/resources/itemTemplate',
   'WS.Data/Collection/RecordSet',
   'Core/helpers/Object/isEqual',

   //TODO: только чтобы первый раз нормально посчитались размеры
   'css!Controls/BreadCrumbs/BreadCrumbs'
], function(
   Control,
   template,
   itemsTemplate,
   itemTemplate,
   RecordSet,
   isEqual
) {
   'use strict';

   var
      _private = {
         getItemData: function(index, items, isBlurred) {
            var
               currentItem = items[index],
               count = items.length;
            return {
               item: currentItem,
               hasArrow: count > 1 && index !== count - 1,
               isBlurred: isBlurred
            };
         },

         getItemsSizes: function(self) {
            //TODO: по сути копипаста, но так быстрее, чем мерять все айтемы по отдельности
            var
               measurer = document.createElement('div'),
               itemsSizes = [];

            measurer.innerHTML = itemsTemplate({
               itemTemplate: itemTemplate,
               items: self._options.items.map(function(item, index, items) {
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

         shouldRedraw: function(currentItems, newItems, currentWidth, availableWidth) {
            return  !isEqual(currentItems, newItems) || currentWidth !== availableWidth;
         },

         canBlur: function(itemWidth, currentWidth, availableWidth) {
            //TODO: неправильно работает, я сейчас учитываю ширину стрелки, а нужно смотреть только на title
            return itemWidth > BREAD_CRUMB_MIN_WIDTH && currentWidth - itemWidth + BREAD_CRUMB_MIN_WIDTH < availableWidth;
         },

         calculateBreadCrumbsToDraw: function(self, itemsSizes, availableWidth) {
            //TODO: последняя крошка не обрезается никогда
            //TODO: если крошка одна, то сейчас она не обрезается
            var
               length = itemsSizes.length,
               i = length - 2,
               currentWidth,
               blurredItemIndex;
            self._visibleItems = [];
            self._hasMenu = false;

            currentWidth = itemsSizes.reduce(function(acc, width) {
               return acc + width;
            }, 0) + HOME_WIDTH;

            if (length > 2 && currentWidth > availableWidth) {
               //Сначала пробуем замылить предпоследний элемент
               if (_private.canBlur(itemsSizes[length - 2], currentWidth, availableWidth)) {
                  blurredItemIndex = length - 2;
               } else {

                  //Если замылить не получилось, то добавляем точки
                  self._hasMenu = true;
                  currentWidth += DOTS_WIDTH;

                  for (i; i > 0; i--) {
                     if (currentWidth < availableWidth) {
                        break;
                     } else if (_private.canBlur(itemsSizes[i], currentWidth, availableWidth)) {
                        blurredItemIndex = i;
                        break;
                     } else {
                        currentWidth -= itemsSizes[i];
                     }
                  }

                  //Если осталось всего 2 крошки, но места все равно не хватает, то замыливаем первый элемент
                  if (i === 0 && currentWidth > availableWidth) {
                     blurredItemIndex = 0;
                  }
               }

               for (var j = 0; j <= i; j++) {
                  self._visibleItems.push(_private.getItemData(j, self._options.items, j === blurredItemIndex));
               }

               self._visibleItems.push({
                  item: {
                     title: '...'
                  },
                  isDots: true,
                  hasArrow: true
               });

               self._visibleItems.push(_private.getItemData(length - 1, self._options.items));
            } else {
               self._visibleItems = self._options.items.map(function(item, index, items) {
                  return _private.getItemData(index, items);
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

      //TODO: если сss-ка BreadCrumbs не подгружена, то все расчеты будут заведомо неправильными
      HOME_WIDTH = _private.getWidth('<div class="controls-BreadCrumbsV__home icon-size icon-Home3 icon-primary"></div>'),
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

   var BreadCrumbsController = Control.extend({
      _template: template,
      _visibleItems: [],
      _hasMenu: false,

      _afterMount: function() {
         if (this._options.items && this._options.items.length > 0) {
            _private.calculateBreadCrumbsToDraw(this, _private.getItemsSizes(this), this._container.clientWidth - HOME_WIDTH);
            this._forceUpdate();
         }
      },

      getMaxCrumbsWidth: function() {
         return _private.getItemsSizes(this).reduce(function(acc, width) {
            return acc + width;
         }, 0) + HOME_WIDTH;
      },

      _onItemClick: function(e, originalEvent, item, isDots) {
         if (isDots) {
            //TODO: сейчас бы оборачивать айтемы в рекордсет чисто ради того, чтобы меню могло с ними работать
            this._children.menuOpener.open({
               target: originalEvent.target,
               templateOptions: {
                  items: new RecordSet({
                     rawData: this._options.items
                  })
               }
            });
         } else {
            this._notify('itemClick', [item]);
         }
      },

      _onResize: function() {
         //TODO: добавить shouldRedraw
         _private.calculateBreadCrumbsToDraw(this, _private.getItemsSizes(this), this._container.clientWidth - HOME_WIDTH);
      }
   });

   return BreadCrumbsController;
});
