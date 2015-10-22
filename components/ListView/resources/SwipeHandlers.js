(function() {
   var eventsChannel = $ws.single.EventBus.channel('TouchesChannel');
   
   $(document).bind('touchstart', handleTouchStart);
   
   $(document).bind('touchmove', handleTouchMove);

   $(document).bind('touchend', handleTouchEnd);

   var xDown = null,
      yDown = null,
      touchTime = null,
      longTapInterval = null;

   function handleTouchStart(e) {
      e = e.originalEvent;
      touchTime = new Date().getTime();
      xDown = e.touches[0].clientX;
      yDown = e.touches[0].clientY;
      longTapInterval = setInterval(function(){
         eventsChannel.notify('onLongTap', e.target);
         e.preventDefault();
         clearInterval(longTapInterval);  
      }, 700);
      eventsChannel.notify('onTap', e.target);
   }

   function handleTouchMove(e) {
      var xTreshold = 50,
         yTreshold = 15,
         durTreshold = 600;
      
      e = e.originalEvent;

      if (!xDown || !yDown) {
         return;
      }

      var xUp = e.touches[0].clientX,
         yUp = e.touches[0].clientY,
         xDiff = xDown - xUp,
         yDiff = yDown - yUp,
         time = new Date().getTime();
      
      if (time - touchTime <= durTreshold) {
         if (yDiff > yTreshold) {
            e.preventDefault();
         }
         if (xDiff >= xTreshold && Math.abs(yDiff) <= yTreshold) {
            eventsChannel.notify('onSwipe', e.target);
            e.preventDefault();
            xDown = null;
            yDown = null;
         }
      }
   }

   function handleTouchEnd(){
      clearInterval(longTapInterval);      
   }

})();