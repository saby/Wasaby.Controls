define('Controls/Container/MassSelector/SelectionContextField', [
   'Core/DataContext'
], function(DataContext) {
   'use strict';

   return DataContext.extend({
      selectedKeys: null,
      excludedKeys: null,
      count: 0,

      constructor: function(selectedKeys, excludedKeys, count) {
         this.selectedKeys = selectedKeys;
         this.excludedKeys = excludedKeys;
         this.count = count;
      }
   });
});
