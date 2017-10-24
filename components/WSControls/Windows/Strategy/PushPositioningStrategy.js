define('js!WSControls/Windows/Strategy/PushPositioningStrategy',
   [
      'Core/Abstract',
      'js!WSControls/Windows/Strategy/IPositioningStrategy'
   ],

   function (Abstract, IPositioningStrategy) {

      var PushPositioningStrategy = Abstract.extend([IPositioningStrategy], {
         constructor: function (cfg) {
            PushPositioningStrategy.superclass.constructor.apply(this, arguments);
         },

         getPosition: function () {
            return {
               right: 16,
               bottom: 16
            }
         }
      });

      return PushPositioningStrategy;
   });
