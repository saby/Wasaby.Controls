define('Controls/Utils/FontLoadUtil', [
   'Core/Deferred',
   'css!theme?Controls/Utils/FontLoadUtil'
], function(Deferred) {
   'use strict';

   var
      fallbackFontWidth,
      _private = {
         isLoaded: function(className) {
            var
               measurer = document.createElement('div'),
               loadedFontWidth;

            measurer.innerText = 'test string';
            measurer.classList.add('controls-FontLoadUtil__measurer');
            document.body.appendChild(measurer);

            if (!fallbackFontWidth) {
               measurer.classList.add('controls-FontLoadUtil__measurer_fallback');
               fallbackFontWidth = measurer.clientWidth;
               measurer.classList.remove('controls-FontLoadUtil__measurer_fallback');
            }

            measurer.classList.add(className);
            loadedFontWidth = measurer.clientWidth;
            document.body.removeChild(measurer);
            return fallbackFontWidth !== loadedFontWidth;
         }
      };

   return {
      waitForFontLoad: function(className) {
         var
            def = new Deferred(),
            checkFontLoad;
         if (_private.isLoaded(className)) {
            def.callback();
         } else {
            checkFontLoad = setInterval(function() {
               if (_private.isLoaded(className)) {
                  clearInterval(checkFontLoad);
                  def.callback();
               }
            }, 300);
         }

         return def;
      }
   };
});
