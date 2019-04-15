/**
 * Context field for Suggest options
 */
import DataContext = require('Core/DataContext');



export = DataContext.extend({
   constructor: function(options) {
      this.options = options;
   }
});

