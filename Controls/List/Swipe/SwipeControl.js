define('Controls/List/Swipe/SwipeControl', [
   'Core/Control',
   'wml!Controls/List/Swipe/SwipeControl',
   'Controls/Application/TouchDetector/TouchContextField',
   'Controls/List/ItemActions/Utils/Actions',
   'Controls/Utils/Toolbar',
   'css!Controls/List/Swipe/Swipe'
], function(Control, template, TouchContextField, aUtil) {
   'use strict';

   var ACTION_ICON_CLASS = 'controls-itemActionsV__action_icon  icon-size',
      SMALL_ICON_SIZE = 24,
      BIG_ICON_SIZE = 32,
      TITLE_HEIGHT = 16,
      VERTICAL_MARGIN = 12,
      ROW_FIRST_TYPE_THRESHOLD = 38,
      ROW_SECOND_TYPE_THRESHOLD = 46,
      ROW_THIRD_TYPE_THRESHOLD = 54,
      ROW_FOURTH_TYPE_THRESHOLD = 73,
      COLUMN_FIRST_TYPE_THRESHOLD = 24,
      COLUMN_SECOND_TYPE_THRESHOLD = 32,
      COLUMN_THIRD_TYPE_THRESHOLD = 40,
      COLUMN_FOURTH_TYPE_THRESHOLD = 48,
      SEPARATOR_WIDTH = 1,
      TWO_COLUMN_MENU_TYPE = 13,
      ROW_TYPE_THRESHOLD = 4,
      ONE_COLUMN_TYPE_THRESHOLD = 8,
      SUBTYPE_COUNT = 4,
      TYPES_WITH_TITLE = [3, 4, 7, 8, 11, 12];
   var _private = {
      
      getNumberInterval: function(number,  limits) {
         for (var i = 0; i <  limits.length; i++) {
            if (number < limits[i]) {
               return i;
            }
         }
         return limits.length;
      },

      initSwipeType: function(size, count) {
         var x1, x2, evenNumber, type;

         //inline
         type = _private.getNumberInterval(size, [
            ROW_FIRST_TYPE_THRESHOLD,
            ROW_SECOND_TYPE_THRESHOLD,
            ROW_THIRD_TYPE_THRESHOLD,
            ROW_FOURTH_TYPE_THRESHOLD
         ]);
         if (type < ROW_TYPE_THRESHOLD) {
            return type + 1; //index start from 0
         }

         //1 column
         x1 =
            (size -
               VERTICAL_MARGIN -
               (VERTICAL_MARGIN + SEPARATOR_WIDTH) * (count - 1)) /
            count;
         type = _private.getNumberInterval(x1, [
            COLUMN_FIRST_TYPE_THRESHOLD,
            COLUMN_SECOND_TYPE_THRESHOLD,
            COLUMN_THIRD_TYPE_THRESHOLD,
            COLUMN_FOURTH_TYPE_THRESHOLD
         ]);
         if (type) {
            return type + ROW_TYPE_THRESHOLD;
         }

         //2column
         evenNumber = count % 2 ? count + 1 : count;
         x2 =
            (2 * size -
               VERTICAL_MARGIN * 2 -
               (VERTICAL_MARGIN + SEPARATOR_WIDTH) * (evenNumber - 2)) /
            evenNumber;
         type = _private.getNumberInterval(x2, [
            COLUMN_FIRST_TYPE_THRESHOLD,
            COLUMN_SECOND_TYPE_THRESHOLD,
            COLUMN_THIRD_TYPE_THRESHOLD,
            COLUMN_FOURTH_TYPE_THRESHOLD
         ]);
         if (type) {
            return type + ONE_COLUMN_TYPE_THRESHOLD;
         }
         return TWO_COLUMN_MENU_TYPE;
      },

      initSwipeDirection: function(type) {
         if (type <= ROW_TYPE_THRESHOLD) {
            return 'row';
         } else {
            return 'column';
         }
      },

      swipeIsFull: function(type) {
         return (
            (type > ROW_TYPE_THRESHOLD && type <= ONE_COLUMN_TYPE_THRESHOLD) ||
            type === TWO_COLUMN_MENU_TYPE
         );
      },

      getActionDefaultHeight: function(type) {
         var heights = {
            1: SMALL_ICON_SIZE + VERTICAL_MARGIN,
            2: BIG_ICON_SIZE + VERTICAL_MARGIN,
            3: SMALL_ICON_SIZE + TITLE_HEIGHT + VERTICAL_MARGIN,
            0: BIG_ICON_SIZE + TITLE_HEIGHT + VERTICAL_MARGIN
         };
         return heights[type % SUBTYPE_COUNT]; //каждые SUBTYPE_COUNT типа высота сбрасывается до 1
      },

      notifyAndResetSwipe: function(self) {
         self._swipeConfig = null;
         self._notify('closeSwipe', [
            self._options.listModel.getSwipeItem()
         ]);
         self._options.listModel.setSwipeItem(null);
         self._options.listModel.setActiveItem(null);
      },

      closeSwipe: function(self, withAnimation) {
         if (self._animationState === 'open') {
            self._animationState = 'close';
            if (withAnimation) {
               self._options.listModel._nextVersion();
            } else {
               _private.notifyAndResetSwipe(self);
            }
         }
      },

      initSwipe: function(self, itemData, childEvent) {
         var actionsHeight = childEvent.target.closest('.js-controls-SwipeControl__actionsContainer').clientHeight;
         self._swipeConfig = {};
         self._options.listModel.setSwipeItem(itemData);
         self._options.listModel.setActiveItem(itemData);
         if (self._options.itemActionsPosition !== 'outside') {
            self._swipeConfig.type = _private.initSwipeType(
               actionsHeight,
               itemData.itemActions.all.length
            );
            self._swipeConfig.direction = _private.initSwipeDirection(
               self._swipeConfig.type
            );
            self._swipeConfig.isFull = _private.swipeIsFull(
               self._swipeConfig.type
            );
            self._swipeConfig.separatorType = _private.initSeparatorType(
               self._swipeConfig.direction
            );
            self._swipeConfig.swipeIconSize = _private.initSwipeIconSize(
               self._swipeConfig.type
            );
            self._swipeConfig.bigTitle =
               self._swipeConfig.type === TWO_COLUMN_MENU_TYPE;
            _private.initItemsForSwipe(self, itemData, actionsHeight);
         }
         self._animationState = 'open';
      },

      initSeparatorType: function(direction) {
         return direction === 'row' ? 'vertical' : 'horizontal';
      },

      initSwipeIconSize: function(type) {
         //нечетные типы должны быть с большими иконками
         return (
            'controls-itemActionsV__action_icon_' + (type % 2 ? 'small' : 'big')
         );
      },

      initItemsForSwipe: function(self, itemData, actionsHeight) {
         var allActions = itemData.itemActions.all;
         self._swipeConfig.hasIcon = false;
         self._visibleItemsCount = allActions.length;

         for (var i = self._visibleItemsCount - 1; i >= 0; i--) {
            allActions[i].height =
               _private.getActionDefaultHeight(self._swipeConfig.type) + 'px';
            if (allActions[i].icon) {
               self._swipeConfig.hasIcon = true;
            }
         }

         if (
            self._swipeConfig.type > ROW_TYPE_THRESHOLD &&
            self._swipeConfig.type <= ONE_COLUMN_TYPE_THRESHOLD
         ) {
            _private.initOneColumsItems(self, itemData);
         }

         if (self._swipeConfig.type > ONE_COLUMN_TYPE_THRESHOLD) {
            _private.initTwoColumsItems(self, itemData, actionsHeight);
         }
      },

      initOneColumsItems: function(self, itemData) {
         var allActions = itemData.itemActions.all;
         self._options.listModel.setItemActions(itemData.item, {
            all: allActions,
            showedFirst: allActions
         });
      },

      initTwoColumsItems: function(self, itemData, actionsHeight) {
         var i,
            firstColumnItems = [],
            secondColumnItems = [],
            oneColumnCount = 0,
            allActions = itemData.itemActions.all,
            oneActionH = _private.getActionDefaultHeight(
               self._swipeConfig.type
            ),
            sum = 0;

         for (i = self._visibleItemsCount - 1; i >= 0; i--) {
            sum += oneActionH;
            if (actionsHeight >= sum) {
               oneColumnCount++;
            } else {
               break;
            }
            sum += SEPARATOR_WIDTH; //separator width
         }

         if (self._swipeConfig.type === TWO_COLUMN_MENU_TYPE) {
            self._visibleItemsCount = oneColumnCount * 2;

            for (i = 0; i < self._visibleItemsCount; i++) {
               if (i < oneColumnCount) {
                  firstColumnItems.push(allActions[i]);
               } else if (i < self._visibleItemsCount - 1) {
                  // -1 menu action
                  secondColumnItems.push(allActions[i]);
               }
            }
            secondColumnItems.push({
               title: 'Еще',
               icon: 'icon-ExpandDown icon-primary ' + ACTION_ICON_CLASS,
               height: 'auto',
               isMenu: true
            });
         } else {
            var height = Math.floor(
                  (actionsHeight - (oneColumnCount - 1)) / oneColumnCount
               ),
               firstColumnCount =
                  oneColumnCount % 2 && oneColumnCount !== allActions.length / 2
                     ? oneColumnCount - 1
                     : oneColumnCount > allActions.length / 2 //ситуация когда 3 операции и в ервый столбец влезает две
                        ? allActions.length - oneColumnCount
                        : oneColumnCount;

            for (i = 0; i < self._visibleItemsCount; i++) {
               allActions[i].height = height + 'px';
               if (i < firstColumnCount) {
                  firstColumnItems.push(allActions[i]);
               } else {
                  secondColumnItems.push(allActions[i]);
               }
            }
         }

         self._options.listModel.setItemActions(itemData.item, {
            all: allActions,
            showedFirst: firstColumnItems,
            showedSecond: secondColumnItems
         });
      },

      needShowIcon: function(action, direction, hasShowedItemActionWithIcon) {
         // https://online.sbis.ru/opendoc.html?guid=e4d479a6-a2d1-470c-899a-1baf6028ff21
         // согласно стандарту, операции должны отображаться с иконкой, если:
         // 1. операция с иконкой.
         // 2. операции выводятся в строку и среди отображаемых операций имеется хотя бы одна операция с иконкой
         return !!action.icon || direction === 'row' && hasShowedItemActionWithIcon;
      },

      needShowTitle: function(action, type, hasIcon) {
         var tempAction = action ? action : { title: true, icon: true }; //menu emulateAction
         return (
            tempAction.title &&
            (!tempAction.icon ||
               (!!~TYPES_WITH_TITLE.indexOf(type) && hasIcon !== false))
         );
      },

      needShowSeparator: function(self, action, itemData, type) {
         var actionIndex = itemData.itemActions.all.indexOf(action) + 1; //+1 array
         //если не свайп или последний элемент
         if (!type || actionIndex === self._visibleItemsCount) {
            return false;
         }
         if (type > ONE_COLUMN_TYPE_THRESHOLD) {
            //две колонки
            //если с меню то не показываем у меню и у средней
            //без меню не показываем у средней
            return (
               actionIndex !== self._visibleItemsCount / 2 && !action.isMenu
            );
         }
         return !action.isMenu;
      },

      bindHandlers: function(self) {
         self._needShowSeparator = self._needShowSeparator.bind(self);
      },

      updateModel: function(self, newOptions) {
         _private.closeSwipe(self);
         newOptions.listModel.subscribe('onListChange', function() {
            _private.closeSwipe(self);
         });
      }
   };

   var SwipeControl = Control.extend({
      _template: template,
      _swipeConfig: null,

      _beforeMount: function(newOptions, context) {
         _private.bindHandlers(this);
         this._isTouch = context.isTouch.isTouch;
         if (newOptions.listModel) {
            _private.updateModel(this, newOptions);
         }
      },

      _beforeUpdate: function(newOptions, context) {
         this._isTouch = context.isTouch.isTouch;
         if (this._swipeConfig && !this._isTouch) {
            _private.closeSwipe(this);
         }
         if (
            newOptions.itemActions &&
            this._options.itemActions !== newOptions.itemActions
         ) {
            _private.closeSwipe(this);
         }
         if (
            newOptions.listModel &&
            this._options.listModel !== newOptions.listModel
         ) {
            _private.updateModel(this, newOptions);
         }
      },

      _listSwipe: function(event, itemData, childEvent) {
         if (
            childEvent.nativeEvent.direction === 'left' &&
            itemData.itemActions
         ) {
            _private.initSwipe(this, itemData, childEvent);
         } else {
            _private.closeSwipe(this, true);
         }
      },

      _listDeactivated: function() {
         _private.closeSwipe(this);
      },

      _listClick: function() {
         _private.closeSwipe(this);
      },

      _needShowSeparator: function(action, itemData, type) {
         return _private.needShowSeparator(this, action, itemData, type);
      },

      _needShowIcon: function(action, direction, hasShowedItemActionWithIcon) {
         return _private.needShowIcon(action, direction, hasShowedItemActionWithIcon);
      },

      _needShowTitle: function(action, type, hasIcon) {
         return _private.needShowTitle(action, type, hasIcon);
      },

      _onItemActionsClick: function(event, action, itemData) {
         aUtil.itemActionsClick(this, event, action, itemData, true);
      },

      closeSwipe: function() {
         _private.closeSwipe(this);
      },

      _onAnimationEnd: function() {
         if (this._animationState === 'close') {
            _private.notifyAndResetSwipe(this);
         }
      }
   });

   SwipeControl.contextTypes = function contextTypes() {
      return {
         isTouch: TouchContextField
      };
   };

   //tests
   SwipeControl._private = _private;

   return SwipeControl;
});
