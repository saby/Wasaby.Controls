define('Controls/Container/MultiSelector/SelectionContextField', [
   'Core/DataContext'
], function(DataContext) {
   'use strict';

   return DataContext.extend({
      selectedKeys: null,
      excludedKeys: null,
      calculatedSelectedKeys: null,
      count: 0,

      constructor: function(selectedKeys, excludedKeys, calculatedSelectedKeys, count) {
         this.selectedKeys = selectedKeys;
         this.excludedKeys = excludedKeys;
         this.calculatedSelectedKeys = calculatedSelectedKeys;
         this.count = count;
      },

      updateSelection: function(selectedKeys, excludedKeys, calculatedSelectedKeys, count) {
         this.selectedKeys = selectedKeys;
         this.excludedKeys = excludedKeys;
         this.calculatedSelectedKeys = calculatedSelectedKeys;
         this.count = count;
         this.updateConsumers();
      }
   });
});
