define('Controls/List/Swipe/Tile', [

], function(

) {
   'use strict';

   var ACTION_ICON_CLASS = 'controls-itemActionsV__action_icon icon-size',
      BIG_ICON_SIZE = 32,
      VERTICAL_MARGIN = 12,
      SEPARATOR_WIDTH = 1;
   var _private = {
      initItemsForSwipe: function(itemActions, actionsHeight) {
         var
            i,
            visibleItems = [],
            sum = 0,
            actionsWithIcons = itemActions.all.filter(function(item) {
               return item.icon !== undefined;
            });

         for (i = 0; i <= actionsWithIcons.length - 1; i++) {
            sum += BIG_ICON_SIZE + VERTICAL_MARGIN;
            if (actionsHeight >= sum) {
               visibleItems.push(actionsWithIcons[i]);
            } else {
               break;
            }
            sum += SEPARATOR_WIDTH;
         }


         if (visibleItems.length < actionsWithIcons.length) {
            visibleItems.pop();
            visibleItems.push({
               title: 'Еще',
               icon: 'icon-ExpandDown icon-primary ' + ACTION_ICON_CLASS,
               isMenu: true
            });
         }

         return {
            all: itemActions.all,
            showedFirst: visibleItems
         };
      },

      needShowSeparator: function(action, itemActions) {
         var actionIndex = itemActions.all.indexOf(action) + 1;

         return !action.isMenu && actionIndex !== itemActions.showedFirst.length;
      }
   };

   var Tile = {
      needShowSeparator: function(action, itemActions) {
         return _private.needShowSeparator(action, itemActions);
      },

      needShowIcon: function() {
         return true;
      },

      needShowTitle: function() {
         return false;
      },

      initItemsForSwipe: function(itemActions, actionsHeight) {
         return _private.initItemsForSwipe(itemActions, actionsHeight);
      },

      getSwipeConfig: function() {
         return {
            direction: 'column',
            isFull: true,
            swipeIconSize: 'big'
         };
      }
   };

   return Tile;
});
