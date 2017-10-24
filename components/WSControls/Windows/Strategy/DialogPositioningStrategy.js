define('js!WSControls/Windows/Strategy/DialogPositioningStrategy',
   [
      'Core/Abstract',
      'js!WSControls/Windows/Strategy/IPositioningStrategy'
   ],

   function (Abstract, IPositioningStrategy) {

      var DialogPositioningStrategy = Abstract.extend([IPositioningStrategy], {
         constructor: function (cfg) {
            DialogPositioningStrategy.superclass.constructor.apply(this, arguments);
            this._options = cfg;
         },

         getPosition: function () {
            return {
               left: 200,
               top: 400
            }
         }
      });

      return DialogPositioningStrategy;
   });
