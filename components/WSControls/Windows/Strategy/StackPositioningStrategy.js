define('js!WSControls/Windows/Strategy/StackPositioningStrategy',
   [
      'Core/Abstract',
      'js!WSControls/Windows/Strategy/IPositioningStrategy'
   ],

   function (Abstract, IPositioningStrategy) {

      var StackPositioningStrategy = Abstract.extend([IPositioningStrategy], {
         constructor: function (cfg) {
            StackPositioningStrategy.superclass.constructor.apply(this, arguments);
         },

         getPosition: function () {
            return {
               top: 0,
               right: 0,
               bottom: 0
            }
         }
      });

      return StackPositioningStrategy;
   });
