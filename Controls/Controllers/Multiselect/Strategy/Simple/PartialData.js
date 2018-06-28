define('Controls/Controllers/Multiselect/Strategy/Simple/PartialData', [
   'Core/core-simpleExtend'
], function(cExtend) {
   'use strict';

   var PartialData = cExtend.extend({
      isAllSelection: function(options) {
         return options.selectedKeys[0] === null;
      },

      getCount: function(selectedKeys, excludedKeys) {
         //TODO: всегда должна возвращаться цифра, но надо править тесты
         if (this.isAllSelection({ selectedKeys: selectedKeys })) {
            if (excludedKeys.length) {
               return 'part';
            } else {
               return 'all';
            }
         } else {
            return selectedKeys.length;
         }
      }
   });

   return PartialData;
});
