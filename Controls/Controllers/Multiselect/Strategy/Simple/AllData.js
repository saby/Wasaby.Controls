define('Controls/Controllers/Multiselect/Strategy/Simple/AllData', [
   'Core/core-simpleExtend'
], function(
   cExtend
) {
   'use strict';

   var AllData = cExtend.extend({
      isAllSelection: function(options) {
         var
            selectedKeys = options.selectedKeys,
            excludedKeys = options.excludedKeys,
            items = options.items;

         return selectedKeys[0] === null || selectedKeys.length === items.getCount() && !excludedKeys.length;
      },

      getCount: function(selectedKeys, excludedKeys, items) {
         //TODO: всегда должна возвращаться цифра, но надо править тесты
         return this.isAllSelection({
            selectedKeys: selectedKeys,
            excludedKeys: excludedKeys,
            items: items
         }) ? 'all' : selectedKeys.length;
      }
   });

   return AllData;
});
