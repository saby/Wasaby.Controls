define('Controls/OperationsPanel/Utils', [
   'tmpl!Controls/OperationsPanel/ItemTemplate',
   'Controls/Utils/Toolbar',
   'Controls/Utils/getWidth'
], function(
   itemTemplate,
   tUtil,
   getWidthUtil
) {
   'use strict';

   var
      MENU_WIDTH = 0,
      initialized;

   var _private = {
      initializeConstants: function() {
         if (initialized) {
            return;
         }
         MENU_WIDTH = window && getWidthUtil.getWidth('<span class="controls-ToolBarV__menuOpen controls-ToolbarV_item__styled"><i class="icon-medium icon-ExpandDown"/></span>');

         initialized = true;
      },


      getItemsSizes: function(items) {
         var
            measurer = document.createElement('div'),
            itemsSizes = [],
            itemsMark = '';

         items.forEach(function(item) {
            itemsMark += itemTemplate({
               item: item,
               size: 'm'});
         });

         measurer.innerHTML = itemsMark;

         measurer.classList.add('controls-UtilsOperationsPanel__measurer');
         document.body.appendChild(measurer);
         [].forEach.call(measurer.getElementsByClassName('controls-ToolbarV_item'), function(item) {
            var
               styles = window.getComputedStyle(item),
               padding = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
            itemsSizes.push(item.clientWidth + padding);
         });
         document.body.removeChild(measurer);

         return itemsSizes;
      }
   };

   return {

      fillItemsType: function(self, items, availableWidth) {
         var
            visibleItems = items.filter(function(item) {
               return !item[self._options.parentProperty] && item[self._options.parentProperty] !== 0;
            }),
            length = visibleItems.length,
            itemsSizes = _private.getItemsSizes(visibleItems),
            currentWidth = itemsSizes.reduce(function(acc, width) {
               return acc + width;
            }, 0);

         _private.initializeConstants();

         items.forEach(function(item) {
            item.showType = 0;
            item.title = item.title || ''; //страховка от дураков
         });

         if (currentWidth > availableWidth) {
            currentWidth += MENU_WIDTH;
            for (var i = length - 1; i >= 0; i--) {
               if (currentWidth > availableWidth) {
                  currentWidth -= itemsSizes[i];
                  visibleItems[i].showType = tUtil.showType.MENU;
               } else {
                  visibleItems[i].showType = tUtil.showType.MENU_TOOLBAR;
               }
            }
         } else {
            items.forEach(function(item) {
               item.showType = tUtil.showType.TOOLBAR;
            });
         }
      }
   };
});
