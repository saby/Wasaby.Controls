define('Controls/List/Swipe/Tile', [
   'Controls/List/Swipe/Constants'
], function(
   swipeConstants
) {
   'use strict';

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
            sum += swipeConstants.BIG_ICON_SIZE + swipeConstants.VERTICAL_MARGIN;
            if (actionsHeight >= sum) {
               visibleItems.push(actionsWithIcons[i]);
            } else {
               break;
            }
            sum += swipeConstants.SEPARATOR_WIDTH;
         }


         if (visibleItems.length < actionsWithIcons.length) {
            visibleItems.pop();
            visibleItems.push({
               icon: 'icon-ExpandDown icon-primary ' + swipeConstants.ACTION_ICON_CLASS,
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
