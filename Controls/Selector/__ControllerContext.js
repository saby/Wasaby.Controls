define('Controls/Selector/__ControllerContext', [
   'Core/DataContext'
], function(DataContext) {
   'use strict';
   
   return DataContext.extend({
      selectedItems: null,
      
      constructor: function(selectedItems) {
         this.selectedItems = selectedItems;
      }
   });
});
