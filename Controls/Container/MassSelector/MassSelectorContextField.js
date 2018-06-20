define('Controls/Container/MassSelector/MassSelectorContextField', [
   'Core/DataContext'
], function(DataContext) {
   'use strict';

   return DataContext.extend({
      selectedKeys: null,
      excludedKeys: null,
      itemsReadyCallback: null,
      count: 0,

      constructor: function(selectedKeys, excludedKeys, itemsReadyCallback, count) {
         this.selectedKeys = selectedKeys;
         this.excludedKeys = excludedKeys;
         this.itemsReadyCallback = itemsReadyCallback;
         this.count = count;
      }
   });
});
