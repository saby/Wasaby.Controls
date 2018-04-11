define('Controls/Container/Scroll/Context',
   [
      'Core/DataContext'
   ],
   function(DataContext) {
      return DataContext.extend({
         constructor: function(cfg) {
            this.pagingVisible = cfg.pagingVisible;
         }
      });
   }
);
