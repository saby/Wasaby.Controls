define('Controls/Container/MassSelector/MassSelectorContextField', [
   'Core/DataContext'
], function(DataContext) {
   return DataContext.extend({
      excludedKeys: null,
      selectedKeys: null,
      constructor: function(selectedKeys, excludedKeys) {
         this.selectedKeys = selectedKeys;
         this.excludedKeys = excludedKeys;
      }
   });
});
