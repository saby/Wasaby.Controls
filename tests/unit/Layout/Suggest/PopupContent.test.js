define(['Controls/Container/Suggest/__PopupContent'], function(PopupContent) {
   
   describe('Controls.Container.Suggest.__PopupContent', function() {
      
      it('afterUpdate', function() {
         var options = {
            showContent: true
         };
   
         var oldOptions = {
            showContent: false
         };
   
         var layer = new PopupContent();
         var resized = false;
   
         layer.saveOptions(options);
         layer._notify = function(eventName) {
            if (eventName === 'controlResize') {
               resized = true;
            }
         };
   
         layer._afterUpdate(oldOptions);
   
         assert.isTrue(resized);
      });
      
   });
   
});