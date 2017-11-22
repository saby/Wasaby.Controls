define('js!WSControls/Windows/Strategy/StickyPositioningStrategy',
   [
      'Core/Abstract',
      'js!WSControls/Windows/Strategy/IPositioningStrategy',
      'js!WSControls/Windows/Strategy/TargetCoords'
   ],

   function (Abstract, IPositioningStrategy, TargetCoords) {

      var StickyPositioningStrategy = Abstract.extend([IPositioningStrategy], {
         constructor: function (cfg) {
            StickyPositioningStrategy.superclass.constructor.apply(this, arguments);
            this._options = cfg;
         },

         getPosition: function (popup) {
            var
               container = popup.getContainer(),
               targetCoords = TargetCoords.get(this._options.target, this._options.corner),
               position = {};
            // вертикальное выравнивание
            if( this._options.verticalAlign ){
               position.top = targetCoords.top;
               if(this._options.verticalAlign.side === 'bottom'){
                  var offsetTop = position.top - container.height();
                  if( offsetTop > 0 ){
                     position.top = offsetTop;
                  }
               }
               position.top += this._options.verticalAlign.offset || 0;
            }
            else{
               position.top = targetCoords.top;
            }
            // горизонтальное выравнивание
            if( this._options.horizontalAlign ){
               position.left = targetCoords.left;
               if(this._options.horizontalAlign.side === 'right'){
                  var offsetLeft = position.left - container.width();
                  if( offsetLeft > 0 ){
                     position.left = offsetLeft;
                  }
               }
               position.left += this._options.horizontalAlign.offset || 0;
            }
            else{
               position.left = targetCoords.left;
            }
            return position;
         }
      });

      return StickyPositioningStrategy;
   });
