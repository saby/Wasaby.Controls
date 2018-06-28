define('Controls/Controllers/Multiselect/Strategy/Simple/Base', [
   'Core/core-simpleExtend'
], function(cExtend) {
   'use strict';

   var Base = cExtend.extend({
      getCount: function(selectedKeys, excludedKeys, items) {
         if (this.isAllSelection({
            selectedKeys: selectedKeys,
            excludedKeys: excludedKeys,
            items: items
         })) {
            return items.getCount() - excludedKeys.length;
         } else {
            return selectedKeys.length;
         }
      }
   });

   return Base;
});
