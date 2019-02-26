define('Controls/List/Swipe/List', [
   'Controls/List/Swipe/Constants'
], function(
   swipeConstants
) {
   'use strict';

   var _private = {
      getNumberInterval: function(number, limits) {
         for (var i = 0; i < limits.length; i++) {
            if (number < limits[i]) {
               return i;
            }
         }
         return limits.length;
      },

      initSwipeType: function(size, count) {
         var x1, x2, evenNumber, type;

         // inline
         type = _private.getNumberInterval(size, [
            swipeConstants.ROW_FIRST_TYPE_THRESHOLD,
            swipeConstants.ROW_SECOND_TYPE_THRESHOLD,
            swipeConstants.ROW_THIRD_TYPE_THRESHOLD,
            swipeConstants.ROW_FOURTH_TYPE_THRESHOLD
         ]);
         if (type < swipeConstants.ROW_TYPE_THRESHOLD) {
            return type + 1; // index start from 0
         }

         // 1 column
         x1 =
            (size -
               swipeConstants.VERTICAL_MARGIN -
               (swipeConstants.VERTICAL_MARGIN + swipeConstants.SEPARATOR_WIDTH) * (count - 1)) /
            count;
         type = _private.getNumberInterval(x1, [
            swipeConstants.COLUMN_FIRST_TYPE_THRESHOLD,
            swipeConstants.COLUMN_SECOND_TYPE_THRESHOLD,
            swipeConstants.COLUMN_THIRD_TYPE_THRESHOLD,
            swipeConstants.COLUMN_FOURTH_TYPE_THRESHOLD
         ]);
         if (type) {
            return type + swipeConstants.ROW_TYPE_THRESHOLD;
         }

         // 2column
         evenNumber = count % 2 ? count + 1 : count;
         x2 =
            (2 * size -
               swipeConstants.VERTICAL_MARGIN * 2 -
               (swipeConstants.VERTICAL_MARGIN + swipeConstants.SEPARATOR_WIDTH) * (evenNumber - 2)) /
            evenNumber;
         type = _private.getNumberInterval(x2, [
            swipeConstants.COLUMN_FIRST_TYPE_THRESHOLD,
            swipeConstants.COLUMN_SECOND_TYPE_THRESHOLD,
            swipeConstants.COLUMN_THIRD_TYPE_THRESHOLD,
            swipeConstants.COLUMN_FOURTH_TYPE_THRESHOLD
         ]);
         if (type) {
            return type + swipeConstants.ONE_COLUMN_TYPE_THRESHOLD;
         }
         return swipeConstants.TWO_COLUMN_MENU_TYPE;
      },

      initSwipeDirection: function(type) {
         if (type <= swipeConstants.ROW_TYPE_THRESHOLD) {
            return 'row';
         }
         return 'column';
      },

      swipeIsFull: function(type) {
         return (
            (type > swipeConstants.ROW_TYPE_THRESHOLD && type <= swipeConstants.ONE_COLUMN_TYPE_THRESHOLD) ||
            type === swipeConstants.TWO_COLUMN_MENU_TYPE
         );
      },

      getActionDefaultHeight: function(type) {
         var heights = {
            1: swipeConstants.SMALL_ICON_SIZE + swipeConstants.VERTICAL_MARGIN,
            2: swipeConstants.BIG_ICON_SIZE + swipeConstants.VERTICAL_MARGIN,
            3: swipeConstants.SMALL_ICON_SIZE + swipeConstants.TITLE_HEIGHT + swipeConstants.VERTICAL_MARGIN,
            0: swipeConstants.BIG_ICON_SIZE + swipeConstants.TITLE_HEIGHT + swipeConstants.VERTICAL_MARGIN
         };
         return heights[type % swipeConstants.SUBTYPE_COUNT]; // каждые swipeConstants.SUBTYPE_COUNT типа высота сбрасывается до 1
      },

      getSwipeConfig: function(itemActions, actionsHeight) {
         var type = _private.initSwipeType(actionsHeight, itemActions.all.length);

         return {
            type: type,
            direction: _private.initSwipeDirection(type),
            isFull: _private.swipeIsFull(type),
            swipeIconSize: _private.initSwipeIconSize(type),
            bigTitle: type === swipeConstants.TWO_COLUMN_MENU_TYPE
         };
      },

      initSwipeIconSize: function(type) {
         // нечетные типы должны быть с большими иконками
         return type % 2 ? 'small' : 'big';
      },

      initItemsForSwipe: function(itemActions, actionsHeight, swipeType) {
         itemActions.all.forEach(function(item) {
            item.height = _private.getActionDefaultHeight(swipeType) + 'px';
         });

         if (swipeType > swipeConstants.ROW_TYPE_THRESHOLD) {
            if (swipeType <= swipeConstants.ONE_COLUMN_TYPE_THRESHOLD) {
               return _private.getOneColumnsItems(itemActions);
            }
            return _private.getTwoColumsItems(swipeType, itemActions, actionsHeight);
         }
         return itemActions;
      },

      getOneColumnsItems: function(itemActions) {
         return {
            all: itemActions.all,
            showedFirst: itemActions.all
         };
      },

      getTwoColumsItems: function(swipeType, itemActions, actionsHeight) {
         var
            i,
            firstColumnItems,
            secondColumnItems,
            oneColumnCount = 0,
            allActions = itemActions.all,
            oneActionH = _private.getActionDefaultHeight(swipeType),
            sum = 0;

         for (i = allActions.length - 1; i >= 0; i--) {
            sum += oneActionH;
            if (actionsHeight >= sum) {
               oneColumnCount++;
            } else {
               break;
            }
            sum += swipeConstants.SEPARATOR_WIDTH;
         }

         if (swipeType === swipeConstants.TWO_COLUMN_MENU_TYPE) {
            firstColumnItems = allActions.slice(0, oneColumnCount);
            secondColumnItems = allActions.slice(oneColumnCount, oneColumnCount * 2 - 1);

            secondColumnItems.push({
               icon: 'icon-ExpandDown icon-primary ' + swipeConstants.ACTION_ICON_CLASS,
               height: 'auto',
               isMenu: true
            });
         } else {
            var
               height = Math.floor(
                  (actionsHeight - (oneColumnCount - 1)) / oneColumnCount
               ),
               firstColumnCount;

            if (oneColumnCount % 2 && oneColumnCount !== allActions.length / 2) {
               firstColumnCount = oneColumnCount - 1;
            } else if (oneColumnCount > allActions.length / 2) {
               // ситуация когда 3 операции и в первый столбец влезает две
               firstColumnCount = allActions.length - oneColumnCount;
            } else {
               firstColumnCount = oneColumnCount;
            }

            allActions.forEach(function(item) {
               item.height = height + 'px';
            });
            firstColumnItems = allActions.slice(0, firstColumnCount);
            secondColumnItems = allActions.slice(firstColumnCount, allActions.length);
         }

         return {
            all: allActions,
            showedFirst: firstColumnItems,
            showedSecond: secondColumnItems
         };
      },

      needShowIcon: function(action, direction, hasShowedItemActionWithIcon) {
         // https://online.sbis.ru/opendoc.html?guid=e4d479a6-a2d1-470c-899a-1baf6028ff21
         // согласно стандарту, операции должны отображаться с иконкой, если:
         // 1. операция с иконкой.
         // 2. операции выводятся в строку и среди отображаемых операций имеется хотя бы одна операция с иконкой
         return !!action.icon || direction === 'row' && hasShowedItemActionWithIcon;
      },

      needShowTitle: function(action, type, hasIcon) {
         var tempAction = action || { title: true, icon: true }; // menu emulateAction
         return (
            tempAction.title &&
            (!tempAction.icon ||
               (!!~swipeConstants.TYPES_WITH_TITLE.indexOf(type) && hasIcon !== false))
         );
      },

      needShowSeparator: function(action, itemActions, type) {
         var
            actionIndex = itemActions.all.indexOf(action) + 1,
            visibleItemsCount;
         if (itemActions.showed) {
            visibleItemsCount = itemActions.showed.length;
         } else if (itemActions.showedSecond) {
            visibleItemsCount = itemActions.showedFirst.length + itemActions.showedSecond.length;
         } else {
            visibleItemsCount = itemActions.showedFirst.length;
         }

         if (actionIndex === visibleItemsCount) {
            return false;
         }
         if (type > swipeConstants.ONE_COLUMN_TYPE_THRESHOLD) {
            // две колонки
            // если с меню то не показываем у меню и у средней
            // без меню не показываем у средней
            return actionIndex !== visibleItemsCount / 2 && !action.isMenu;
         }

         return !action.isMenu;
      }
   };

   var List = {
      needShowSeparator: function(action, itemActions, type) {
         return _private.needShowSeparator(action, itemActions, type);
      },

      needShowIcon: function(action, direction, hasShowedItemActionWithIcon) {
         return _private.needShowIcon(action, direction, hasShowedItemActionWithIcon);
      },

      needShowTitle: function(action, type, hasIcon) {
         return _private.needShowTitle(action, type, hasIcon);
      },

      initItemsForSwipe: function(itemActions, actionsHeight, swipeType) {
         return _private.initItemsForSwipe(itemActions, actionsHeight, swipeType);
      },

      getSwipeConfig: function(itemActions, actionsHeight) {
         return _private.getSwipeConfig(itemActions, actionsHeight);
      }
   };

   return List;
});
