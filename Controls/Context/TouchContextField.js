define('Controls/Context/TouchContextField', [
   'Core/compatibility',
   'Core/DataContext'
], function(compatibility, DataContext) {
   return DataContext.extend({
      isTouch: null,
      constructor: function(touch) {
         // todo: https://online.sbis.ru/opendoc.html?guid=e277e8e0-8617-41c9-842b-5c7dcb116e2c
         if (typeof touch === 'object') {
            touch = compatibility.touch;
         }
         this.isTouch = touch;
      },
      setIsTouch: function(touch) {
         this.isTouch = touch;
         this.updateConsumers();
      }
   });
});
