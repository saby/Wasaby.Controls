define('Controls/Container/MultiSelector/SelectionContextField', [
   'Core/DataContext'
], function(DataContext) {
   'use strict';

   return DataContext.extend({
      selectedKeys: null,
      excludedKeys: null,
      count: 0,
      selectionInstance: null,
      items: null,

      constructor: function(selectedKeys, excludedKeys, count, selectionInstance, items) {
         this.selectedKeys = selectedKeys;
         this.excludedKeys = excludedKeys;
         this.count = count;
         this.selectionInstance = selectionInstance;
         this.items = items;
      }
   });
});
