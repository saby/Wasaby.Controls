define('Controls/Container/MultiSelector/SelectionContextField', [
   'Core/DataContext'
], function(DataContext) {
   'use strict';

   return DataContext.extend({
      selectedKeys: null,
      count: 0,
      items: null,

      constructor: function(selectedKeys, count, items) {
         this.selectedKeys = selectedKeys;
         this.count = count;
         this.items = items;
      }
   });
});
