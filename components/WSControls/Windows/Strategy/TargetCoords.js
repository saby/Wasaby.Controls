define('js!WSControls/Windows/Strategy/TargetCoords', [],

   function () {

      return {
         get: function (target, corner) {
            var
               width = target.width() || 0,
               height = target.height() || 0,
               top = 0,
               left = 0;
            if (target) {
               //
               var box = target[0].getBoundingClientRect();
               top += box.top || 0;
               left += box.left || 0;
               top += window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
               top -= document.documentElement.clientTop || document.body.clientTop || 0;
               left += window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
               left -= document.documentElement.clientLeft || document.body.clientLeft || 0;
            }
            // сместим контейнер относительно таргета
            if (corner) {
               if (corner.vertical === 'bottom') {
                  top += height;
               }
               if (corner.horizontal === 'right') {
                  left += width;
               }
            }
            return {
               top: Math.round(top),
               left: Math.round(left),
               width: width,
               height: height
            };
         }
      };
   });
