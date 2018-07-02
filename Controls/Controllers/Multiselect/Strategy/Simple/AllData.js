define('Controls/Controllers/Multiselect/Strategy/Simple/AllData', [
   'Controls/Controllers/Multiselect/Strategy/Simple/Base'
], function(
   Base
) {
   'use strict';

   var AllData = Base.extend({
      isAllChildrenSelected: function(options) {
         var
            selectedKeys = options.selectedKeys,
            excludedKeys = options.excludedKeys,
            items = options.items;

         return selectedKeys[0] === null || selectedKeys.length === items.getCount() && !excludedKeys.length;
      }
   });

   return AllData;
});
