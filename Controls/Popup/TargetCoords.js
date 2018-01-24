define('Controls/Popup/TargetCoords',
   [],

   function () {

      return {
         get: function (target, corner) {
            if( !target ){
               target = document.body;
            }
            var
               top = 0,
               left = 0;
            if (target) {
               var box = target.getBoundingClientRect();
               top += (corner && corner.vertical === 'bottom' ? box.bottom : box.top) || 0;
               left += (corner && corner.horizontal === 'right' ? box.right : box.left) || 0;
               top += window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
               top -= document.documentElement.clientTop || document.body.clientTop || 0;
               left += window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
               left -= document.documentElement.clientLeft || document.body.clientLeft || 0;
            }
            return {
               top: Math.round(top),
               bottom: Math.round(window.innerHeight - top),
               left: Math.round(left),
               right: Math.round(window.innerWidth - left),
               width: box.width,
               height: box.height
            };
         }
      };
   }
);
