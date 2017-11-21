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

         getPosition: function (popup) {
            var
               container = popup.getContainer(),
               popupWidth = container.width(),
               popupHeight = container.height(),
               windowWidth = window.outerWidth,
               windowHeight = window.innerHeight,
               position = {
                  top: (windowHeight - popupHeight) / 2,
                  left: (windowWidth - popupWidth) / 2
               };

            position.left = Math.round(position.left);
            position.top = Math.round(position.top);
            return position;
         }
      });

      return DialogPositioningStrategy;
   });
