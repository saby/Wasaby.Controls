define('Controls/BreadCrumbsController', [
   'Core/Control',
   'Controls/List/resources/utils/ItemsUtil',
   'WS.Data/Collection/RecordSet',
   'tmpl!Controls/BreadCrumbsController/BreadCrumbsController',
   'tmpl!Controls/BreadCrumbs/resources/itemsTemplate',
   'tmpl!Controls/BreadCrumbs/resources/itemTemplate',
   'tmpl!Controls/BreadCrumbsController/resources/menuItemTemplate',
   'tmpl!Controls/BreadCrumbsController/resources/menuContentTemplate',
   'Controls/BreadCrumbs' //Подгружаю здесь крошки, чтобы на момент высчитывания стилей css-ка точно была подгружена
], function(
   Control,
   ItemsUtil,
   RecordSet,
   template,
   itemsTemplate,
   itemTemplate,
   menuItemTemplate
) {
   'use strict';

   var
      HOME_WIDTH,
      BREAD_CRUMB_MIN_WIDTH,
      DOTS_WIDTH,
      _private = {
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

         getItemsSizes: function(self, items) {
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
            return currentItems !== newItems || oldWidth !== availableWidth;
         },

         canShrink: function(itemWidth, currentWidth, availableWidth) {
            return itemWidth > BREAD_CRUMB_MIN_WIDTH && currentWidth - itemWidth + BREAD_CRUMB_MIN_WIDTH < availableWidth;
         },

         calculateBreadCrumbsToDraw: function(self, items, itemsSizes, availableWidth) {
            var
               length = itemsSizes.length,
               currentWidth,
               shrinkedItemIndex;
            self._visibleItems = [];

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

                     //TODO: вообще может быть ситуация, когда замыливаться будет только одна крошка, потому что вторую некуда сжимать, нужно подумать как с этим жить
                     //Если осталось всего 2 крошки, но места все равно не хватает, то замыливаем первый и последний элементы одновременно
                     if (i === 0 && currentWidth > availableWidth) {
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

                     self._visibleItems.push(_private.getItemData(length - 1, items, shrinkedItemIndex === 0));
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

            measurer.innerHTML = element;
            document.body.appendChild(measurer);
            width = measurer.clientWidth;
            document.body.removeChild(measurer);
            return width;
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
         calculateConstants: function() {
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
      };

   var BreadCrumbsController = Control.extend({
      _template: template,
      _visibleItems: [],
      _oldWidth: 0,

      _beforeMount: function() {
         //Эта функция передаётся по ссылке в Opener, так что нужно биндить this, чтобы не потерять его
         this._onResult = this._onResult.bind(this);
      },

      _afterMount: function() {
         _private.calculateConstants();

         //TODO: нужно приделать костыли для браузеров без preload
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

      getMaxCrumbsWidth: function(items) {
         return _private.getItemsSizes(this, items).reduce(function(acc, width) {
            return acc + width;
         }, 0) + HOME_WIDTH;
      },

      _onResult: function(args) {
         _private.onResult(this, args);
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
