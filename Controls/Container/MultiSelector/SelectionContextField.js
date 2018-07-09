define('Controls/Container/MultiSelector/SelectionContextField', [
   'Core/DataContext'
], function(DataContext) {
   'use strict';

   return DataContext.extend({
      selectedKeys: null,
      excludedKeys: null,
      calculatedSelectedKeys: null,
      count: 0,
      items: null,

      constructor: function(selectedKeys, excludedKeys, calculatedSelectedKeys, count, items) {
         //TODO: убрать items после того, как прикручу Санин контейнер
         this.selectedKeys = selectedKeys;
         this.excludedKeys = excludedKeys;
         this.calculatedSelectedKeys = calculatedSelectedKeys;
         this.count = count;
         this.items = items;
      }
   });
});
