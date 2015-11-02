(function($) {

   $.event.special.swipe = {

      xTreshold: 50,
      yTreshold: 15,
      scrollTreshold: 30,
      durTreshold: 600,
      eventInProgress: false,

      start: function(event) {
         var data = event.originalEvent.touches ?
            event.originalEvent.touches[0] : event,
            location = $.event.special.swipe.getLocation(data);
         return {
            time: (new Date()).getTime(),
            coords: [location.x, location.y],
            origin: $(event.target)
         };
      },

      stop: function(event) {
         var data = event.originalEvent.touches ?
            event.originalEvent.touches[0] : event,
            location = $.event.special.swipe.getLocation(data);
         return {
            time: (new Date()).getTime(),
            coords: [location.x, location.y]
         };
      },
      getLocation: function(event) {
         return {
            x: event.clientX,
            y: event.clientY
         };
      },

      handleSwipe: function(start, stop, self, target) {
         if (stop.time - start.time < $.event.special.swipe.durTreshold &&
            Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.xTreshold &&
            Math.abs(start.coords[1] - stop.coords[1]) < $.event.special.swipe.yTreshold) {
            var direction = start.coords[0] > stop.coords[0] ? 'left' : 'right';
            $.event.trigger($.Event('swipe', {
               target: target,
               swipestart: start,
               swipestop: stop,
               direction: direction
            }), undefined, self);

            return true;
         }
         return false;
      },

      setup: function() {
         var context = {},
            self = this,
            data = $.data(this, 'swipe-event');

         if (!data) {
            data = {};
            $.data(this, 'swipe-event', data);
         }
         data.swipe = context;

         context.start = function(event) {
            if ($.event.special.swipe.eventInProgress) {
               return;
            }
            $.event.special.swipe.eventInProgress = true;
            var stop,
               start = $.event.special.swipe.start(event),
               target = event.target,
               emitted = false;

            context.move = function(event) {
               if (!start || event.isDefaultPrevented()) {
                  return;
               }
               stop = $.event.special.swipe.stop(event);

               if (!emitted) {
                  emitted = $.event.special.swipe.handleSwipe(start, stop, self, target);
                  if (emitted) {
                     $.event.special.swipe.eventInProgress = false;
                  }
               }
               // prevent scrolling
               if (Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.scrollTreshold) {
                  event.preventDefault();
               }
            };

            context.stop = function() {
               emitted = true;
               $.event.special.swipe.eventInProgress = false;
               $(document).off('touchmove', context.move);
            };

            $(document).on('touchmove', context.move);
            $(document).one('touchend', context.stop);
         };

         $(this).bind('touchstart', context.start);
      },

      teardown: function() {
         var data, context;
         data = $.data(this, 'swipe-event');
         if (data) {
            context = data.swipe;
            delete data.swipe;
            $.removeData(this, 'swipe-event');
         }
         if (context) {
            if (context.start) {
               $(this).off('ontouchstart', context.start);
            }
            if (context.move) {
               $(document).off('ontouchmove', context.move);
            }
            if (context.stop) {
               $(document).off('ontouchend', context.stop);
            }
         }
      }

   };

   $.event.special.tap = {
      tapholdThreshold: 750,
      tapThreshold: 100,
      setup: function() {
         var $this = $(this),
            self = this,
            context = {},
            data = $.data(this, 'tap-event'),
            isTaphold = false;

         if (!data) {
            data = {};
            $.data(this, 'tap-event', data);
         }
         data.tap = context;
         context.start = function(event) {
            isTaphold = false;
            var timer,
               target = event.target,
               startTime = new Date().getTime();

            function clearTapTimer() {
               clearTimeout(timer);
            }

            timer = setTimeout(function() {
               isTaphold = true;
               $.event.trigger($.Event('taphold', {
                  target: target
               }), undefined, self);
            }, $.event.special.tap.tapholdThreshold);

            $(document).one('touchend', function(event) {
               clearTapTimer();
               var endTime = new Date().getTime();
               if (!isTaphold && event.target == target && endTime - startTime < $.event.special.tap.tapThreshold){
                  $.event.trigger($.Event('tap', {
                     target: target
                  }), undefined, self);
               }
            });
         };
         $this.bind('touchstart', context.start);
      },

      teardown: function() {
         var data, context;
         data = $.data(this, 'tap-event');
         if (data) {
            context = data.tap;
            delete data.tap;
            $.removeData(this, 'tap-event');
         }
         $(this).unbind('touchstart', context.strat);
      }

   };

   $.event.special.taphold = {
      setup: function() {
         $(this).bind('tap', $.noop);
      },
      teardown: function() {
         $(this).unbind('tap');
      }
   };

})(jQuery);