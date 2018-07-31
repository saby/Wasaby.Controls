define('Controls/Application/TouchDetector/TouchContextField', [
   'Core/DataContext'
], function(DataContext) {
   return DataContext.extend({
      isTouch: null,
      constructor: function(touch) {
         this.isTouch = touch;
      },
      setIsTouch: function(touch) {
         this.isTouch = touch;
         this.updateConsumers();
      }
   });
});
