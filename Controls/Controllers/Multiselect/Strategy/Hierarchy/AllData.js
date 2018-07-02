define('Controls/Controllers/Multiselect/Strategy/Hierarchy/AllData', [
   'Controls/Controllers/Multiselect/Strategy/Hierarchy/Base'
], function(
   Base
) {
   'use strict';

   var AllData = Base.extend({
      isAllChildrenSelected: function(options) {
         var
            rootId = options.rootId,
            selectedKeys = options.selectedKeys,
            excludedKeys = options.excludedKeys,
            items = options.items,
            hasExcludedChildren = false,
            selectedChildrenCount = this.getSelectedChildrenCount(rootId, selectedKeys, excludedKeys, items),
            childrenIds = this.getChildrenIds(rootId, items);

         for (var i = 0; i < childrenIds.length; i++) {
            if (excludedKeys.indexOf(childrenIds[i]) !== -1) {
               hasExcludedChildren = true;
               break;
            }
         }

         return (selectedKeys.indexOf(rootId) !== -1 || selectedChildrenCount === childrenIds.length) && !hasExcludedChildren;
      }
   });

   return AllData;
});
