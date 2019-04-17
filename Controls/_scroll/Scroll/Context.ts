import DataContext = require('Core/DataContext');
      export = DataContext.extend({
         _moduleName: 'Controls/_scroll/Scroll/Context',
         constructor: function(cfg) {
            this.pagingVisible = cfg.pagingVisible;
         }
      });

