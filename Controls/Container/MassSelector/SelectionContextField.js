define('Controls/Container/MassSelector/SelectionContextField', [
   'Core/DataContext'
], function(DataContext) {
   'use strict';

   return DataContext.extend({
      selectedKeys: null,
      excludedKeys: null,
      count: 0,
      selectionInstance: null,

      constructor: function(selectedKeys, excludedKeys, count, selectionInstance) {
         this.selectedKeys = selectedKeys;
         this.excludedKeys = excludedKeys;
         this.count = count;
         this.selectionInstance = selectionInstance;
      }
   });
});
