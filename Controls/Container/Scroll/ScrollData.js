define('Controls/Container/Scroll/ScrollData',
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
