define('Controls/Controllers/Multiselect/Strategy/Hierarchy/AllData', [
   'Controls/Controllers/Multiselect/Strategy/Hierarchy/Base'
], function(
   Base
) {
   'use strict';

   var AllData = Base.extend({
      isAllSelection: function(options) {
         var
            rootId = options.rootId,
            selectedKeys = options.selectedKeys,
            excludedKeys = options.excludedKeys,
            items = options.items,
            allChildrenSelected = true,
            selectedChildrenCount = this.getSelectedChildrenCount(rootId, selectedKeys, excludedKeys, items),
            childrenIds = this.getChildrenIds(rootId, items);

         for (var i = 0; i < childrenIds.length; i++) {
            if (excludedKeys.indexOf(childrenIds[i]) !== -1) {
               allChildrenSelected = false;
               break;
            }
         }
         return (selectedKeys.indexOf(rootId) !== -1 || selectedChildrenCount === childrenIds.length) && allChildrenSelected;
      }
   });

   return AllData;
});
