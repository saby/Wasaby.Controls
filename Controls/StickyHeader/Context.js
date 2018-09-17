define('Controls/StickyHeader/Context',
   [
      'Core/DataContext'
   ],
   function(DataContext) {
      return DataContext.extend({
         constructor: function(config) {
            this.shadowVisible = config.shadowVisible;
         }
      });
   }
);
