define('Controls/Controllers/Multiselect/Strategy/Hierarchy/PartialData', [
   'Controls/Controllers/Multiselect/Strategy/Hierarchy/Base'
], function(
   Base
) {
   'use strict';

   var PartialData = Base.extend({
      isAllSelection: function(options) {
         var
            rootId = options.rootId,
            selectedKeys = options.selectedKeys,
            excludedKeys = options.excludedKeys,
            items = options.items,
            isParentSelected = this.isParentSelected(rootId, selectedKeys, excludedKeys, items),
            childrenIds = this.getChildrenIds(rootId, items),
            allChildrenSelected = true;

         for (var i = 0; i < childrenIds.length; i++) {
            if (excludedKeys.indexOf(childrenIds[i]) !== -1) {
               allChildrenSelected = false;
               break;
            }
         }

         return (isParentSelected || selectedKeys.indexOf(rootId) !== -1) && allChildrenSelected;
      }
   });

   return PartialData;
});
