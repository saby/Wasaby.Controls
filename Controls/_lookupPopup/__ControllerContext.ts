import DataContext = require('Core/DataContext');
   
   
   export = DataContext.extend({
      selectedItems: null,
      _moduleName: "Controls/_lookupPopup/__ControllerContext",
      constructor: function(selectedItems) {
         this.selectedItems = selectedItems;
      }
   });

