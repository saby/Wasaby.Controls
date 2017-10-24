define('js!WSControls/Windows/Strategy/StickyPositioningStrategy',
   [
      'Core/Abstract',
      'js!WSControls/Windows/Strategy/IPositioningStrategy'
   ],

   function (Abstract, IPositioningStrategy) {

      var StickyPositioningStrategy = Abstract.extend([IPositioningStrategy], {
         constructor: function (cfg) {
            StickyPositioningStrategy.superclass.constructor.apply(this, arguments);
            this._options = cfg;
         },

         getPosition: function () {
            var
               elem = this._options.target[0],
               box = elem.getBoundingClientRect(),
               body = document.body,
               docElem = document.documentElement,
               scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
               scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
               clientTop = docElem.clientTop || body.clientTop || 0,
               clientLeft = docElem.clientLeft || body.clientLeft || 0,
               top = box.top +  scrollTop - clientTop,
               left = box.left + scrollLeft - clientLeft;
            return {
               top: Math.round(top) + 'px',
               left: Math.round(left) + 'px',
               right: 'auto',
               bottom: 'auto'
            }
         }
      });

      return StickyPositioningStrategy;
   });
