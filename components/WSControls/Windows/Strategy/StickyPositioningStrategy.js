define('js!WSControls/Windows/Strategy/StickyPositioningStrategy',
   [
      'Core/Abstract',
      'js!WSControls/Windows/Strategy/IPositioningStrategy'
   ],

   function (Abstract, IPositioningStrategy) {

      var StickyPositioningStrategy = Abstract.extend([IPositioningStrategy], {
         constructor: function (cfg) {
            StickyPositioningStrategy.superclass.constructor.apply(this, arguments);
         },

         getPosition: function () {
            return {
               left: 'auto',
               top: 'auto',
               right: 'auto',
               bottom: 'auto',
               width: 'auto',
               height: 'auto'
            }
         }
      });

      return StickyPositioningStrategy;
   });
