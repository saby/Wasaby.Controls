define('Controls/Popup/TargetCoords',
   [],

   function() {

      return {
         get: function(target) {

            if (!target) {
               throw new Error('Target parameter is required');
            }


            // todo https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            if (target.get) {
               target = target.get(0);
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
