import DataContext = require('Core/DataContext');
      export = DataContext.extend({
         constructor: function(cfg) {
            this.pagingVisible = cfg.pagingVisible;
         }
      });
   
