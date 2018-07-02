define('Controls/Controllers/Multiselect/Strategy/Simple/PartialData', [
   'Controls/Controllers/Multiselect/Strategy/Simple/Base'
], function(Base) {
   'use strict';

   var PartialData = Base.extend({
      isAllChildrenSelected: function(options) {
         return options.selectedKeys[0] === null && !options.excludedKeys.length;
      }
   });

   return PartialData;
});
