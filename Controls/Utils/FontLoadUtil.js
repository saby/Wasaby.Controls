define('Controls/Utils/FontLoadUtil', [
   'Core/Deferred'
], function(Deferred) {
   'use strict';

   var
      fallbackFontWidth,
      _private = {
         isLoaded: function(font) {
            var
               measurer = document.createElement('div'),
               loadedFontWidth;

            measurer.style.fontSize = '25px';
            measurer.style.position = 'absolute';
            measurer.style.top = '-9999px';
            measurer.style.left = '-9999px';
            measurer.style.visibility = 'hidden';
            measurer.innerText = 'test string';
            document.body.appendChild(measurer);

            if (!fallbackFontWidth) {
               measurer.style.fontFamily = 'Courier New'; //Courier New выбран за то, что он сильно отличается от большей части шрифтов и есть везде
               fallbackFontWidth = measurer.clientWidth;
            }

            measurer.style.fontFamily = font + ', Courier New';
            loadedFontWidth = measurer.clientWidth;
            document.body.removeChild(measurer);
            return fallbackFontWidth !== loadedFontWidth;
         }
      };

   return {
      waitForFontLoad: function(font) {
         var
            def = new Deferred(),
            checkFontLoad = setInterval(function() {
               if (_private.isLoaded(font)) {
                  clearInterval(checkFontLoad);
                  def.callback();
               }
            }, 300);

         return def;
      }
   };
});
