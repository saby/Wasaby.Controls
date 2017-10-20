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
               left: 'auto',
               top: 'auto',
               right: '16px',
               bottom: '16px',
               width: 'auto',
               height: 'auto'
            }
         }
      });

      return PushPositioningStrategy;
   });
