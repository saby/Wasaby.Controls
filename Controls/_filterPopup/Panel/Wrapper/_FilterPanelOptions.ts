/**
 * Context field for filter panel options
 */
import DataContext = require('Core/DataContext');



   export = DataContext.extend({
      constructor: function(options) {
         this.options = options;
      },
      _moduleName: 'Controls/_filterPopup/Panel/Wrapper/_FilterPanelOptions'
   });

