define('Controls/Container/MassSelector/MassSelectorContextField', [
   'Core/DataContext'
], function(DataContext) {
   return DataContext.extend({
      selectedKeys: null,
      itemsReadyCallback: null,
      count: 0,
      constructor: function(selectedKeys, itemsReadyCallback, count) {
         this.selectedKeys = selectedKeys;
         this.itemsReadyCallback = itemsReadyCallback;
         this.count = count;
      }
   });
});
