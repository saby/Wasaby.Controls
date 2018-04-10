define('Controls/Popup/TargetCoords',
   [],

   function() {

      return {
         get: function(target) {

            if (!target) {
               throw new Error('Target parameter is required');
            }

            var
               box = target.getBoundingClientRect(),
               top = box.top,
               left = box.left,
               bottom = box.bottom,
               right = box.right;

            var fullTopOffset =
               window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0 -
               document.documentElement.clientTop || document.body.clientTop || 0;

            var fullLeftOffset =
               window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0 -
               document.documentElement.clientLeft || document.body.clientLeft || 0;

            return {
               top: Math.round(top + fullTopOffset),
               bottom: Math.round(bottom + fullTopOffset),
               left: Math.round(left + fullLeftOffset),
               right: Math.round(right + fullLeftOffset),
               width: box.width,
               height: box.height,
               topScroll: fullTopOffset,
               leftScroll: fullLeftOffset
            };
         }
      };
   }
);
