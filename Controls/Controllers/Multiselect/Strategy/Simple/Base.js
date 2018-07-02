define('Controls/Controllers/Multiselect/Strategy/Simple/Base', [
   'Core/core-simpleExtend'
], function(cExtend) {
   'use strict';

   var Base = cExtend.extend({
      isAllSelection: function(options) {
         var
            selectedKeys = options.selectedKeys;

         return selectedKeys[0] === null;
      },

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
