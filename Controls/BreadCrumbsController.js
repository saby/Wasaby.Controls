define('Controls/BreadCrumbsController', [
   'Core/Control',
   'tmpl!Controls/BreadCrumbsController/BreadCrumbsController',
   'tmpl!Controls/BreadCrumbs/resources/itemsTemplate',
   'tmpl!Controls/BreadCrumbs/resources/itemTemplate',
   'tmpl!Controls/BreadCrumbs/resources/menuItemTemplate',
   'WS.Data/Collection/RecordSet',
   'Core/helpers/Object/isEqual',

   //TODO: если сss-ка BreadCrumbs не подгружена, то все расчеты будут заведомо неправильными
   'css!Controls/BreadCrumbs/BreadCrumbs'
], function(
   Control,
   template,
   itemsTemplate,
   itemTemplate,
   menuItemTemplate,
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

         getItemsSizes: function(self, items) {
            //TODO: по сути копипаста, но так быстрее, чем мерять все айтемы по отдельности
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

         shouldRedraw: function(currentItems, newItems, oldWidth, availableWidth) {
            return  !isEqual(currentItems, newItems) || oldWidth !== availableWidth;
         },

         canBlur: function(itemWidth, currentWidth, availableWidth) {
            return itemWidth > BREAD_CRUMB_MIN_WIDTH && currentWidth - itemWidth + BREAD_CRUMB_MIN_WIDTH < availableWidth;
         },

         calculateBreadCrumbsToDraw: function(self, items, itemsSizes, availableWidth) {
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

            if (currentWidth > availableWidth) {
               if (length > 2) {
                  //Сначала пробуем замылить предпоследний элемент
                  if (_private.canBlur(itemsSizes[length - 2], currentWidth, availableWidth)) {
                     for (var j = 0; j < length; j++) {
                        self._visibleItems.push(_private.getItemData(j, items, j === length - 2));
                     }
                  } else {
                     //Если замылить не получилось, то добавляем точки
                     self._hasMenu = true;
                     currentWidth += DOTS_WIDTH;

                     for (i; i > 0; i--) {
                        if (currentWidth < availableWidth) {
                           break;
                        } else if (_private.canBlur(itemsSizes[i], currentWidth, availableWidth)) {
                           blurredItemIndex = i;
                           currentWidth -= itemsSizes[i] - BREAD_CRUMB_MIN_WIDTH;
                           break;
                        } else {
                           currentWidth -= itemsSizes[i];
                        }
                     }

                     //TODO: вообще может быть ситуация, когда замыливаться будет только одна крошка, потому что вторую некуда сжимать, нужно подумать как с этим жить
                     //Если осталось всего 2 крошки, но места все равно не хватает, то замыливаем первый и последний элементы одновременно
                     if (i === 0 && currentWidth > availableWidth) {
                        blurredItemIndex = 0;
                     }

                     for (var j = 0; j <= i; j++) {
                        self._visibleItems.push(_private.getItemData(j, items, j === blurredItemIndex));
                     }

                     self._visibleItems.push({
                        item: {
                           title: '...'
                        },
                        isDots: true,
                        hasArrow: true
                     });

                     self._visibleItems.push(_private.getItemData(length - 1, items, blurredItemIndex === 0));
                  }
               } else {
                  //TODO: вообще может быть ситуация, когда замыливаться будет только одна крошка, потому что вторую некуда сжимать, нужно подумать как с этим жить
                  self._visibleItems = items.map(function(item, index, items) {
                     return _private.getItemData(index, items, true);
                  });
               }
            } else {
               self._visibleItems = items.map(function(item, index, items) {
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
         },

         onCloseMenu: function(self, args) {
            var
               actionName = args && args.action,
               event = args && args.event;

            //todo: Особая логика событий попапа, исправить как будут нормально приходить аргументы
            if (actionName === 'itemClick') {
               var item = args.data && args.data[0] && args.data[0].getRawData();
               self._onItemClick(event, {}, item);
            }
            self._children.menuOpener.close();
         },

         onItemClick: function(self, originalEvent, item, isDots) {
            if (isDots) {

               //оборачиваю айтемы в рекордсет чисто ради того, чтобы меню могло с ними работать
               var
                  rs = new RecordSet({
                     rawData: self._options.items
                  }),
                  wrapperCount = 0;
               rs.each(function(item) {
                  item.set('wrapperCount', wrapperCount++);
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
         }
      },
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
      _oldWidth: 0,

      _beforeMount: function() {
         this._onCloseMenu = this._onCloseMenu.bind(this);
      },

      _afterMount: function() {
         //TODO: нужно приделать костыли для браузеров без прелоад (т.е. всех, кроме хрома, сафари и оперы)
         if (this._options.items && this._options.items.length > 0) {
            this._oldWidth = this._container.clientWidth - HOME_WIDTH;
            _private.calculateBreadCrumbsToDraw(this,  this._options.items, _private.getItemsSizes(this, this._options.items), this._oldWidth);
            this._forceUpdate();
         }
      },

      _beforeUpdate: function(newOptions) {
         if (_private.shouldRedraw(this._options.items, newOptions.items, this._oldWidth, this._container.clientWidth - HOME_WIDTH)) {
            this._oldWidth = this._container.clientWidth - HOME_WIDTH;
            _private.calculateBreadCrumbsToDraw(this,  newOptions.items, _private.getItemsSizes(this, newOptions.items), this._container.clientWidth - HOME_WIDTH);
         }
      },

      getMaxCrumbsWidth: function() {
         return _private.getItemsSizes(this, this._options.items).reduce(function(acc, width) {
            return acc + width;
         }, 0) + HOME_WIDTH;
      },

      _onCloseMenu: function(args) {
         _private.onCloseMenu(this, args);
      },

      _onItemClick: function(e, originalEvent, item, isDots) {
         _private.onItemClick(this, originalEvent, item, isDots);
      },

      _onResize: function() {
         //Здесь только скрываю меню, т.к. перерасчет крошек запустится в beforeUpdate
         this._children.menuOpener.close();
      }
   });

   return BreadCrumbsController;
});
