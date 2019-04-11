import DataContext = require('Core/DataContext');
   
   
   export = DataContext.extend({
      selectedItems: null,
      
      constructor: function(selectedItems) {
         this.selectedItems = selectedItems;
      }
   });

