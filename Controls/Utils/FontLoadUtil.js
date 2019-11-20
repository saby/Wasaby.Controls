define('Controls/Utils/FontLoadUtil', [
   'Core/Deferred',
   'css!Controls/Utils/FontLoadUtil'
], function(Deferred) {
   'use strict';
   /* eslint-disable */
   var LOADED_FONTS_FOR_CLASS = {};
   var
      fallbackFontWidth,
      _private = {
         isLoaded: function(className) {
            if (LOADED_FONTS_FOR_CLASS[className]) {
               return true;
            }

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
      _private: _private,
      __loadedFonts: LOADED_FONTS_FOR_CLASS,
      waitForFontLoad: function(className) {
         var def = new Deferred();
         var checkFontLoad;

         def.addCallback(function(res) {
            LOADED_FONTS_FOR_CLASS[className] = true;
            return res;
         });

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
   /* eslint-enable */
});
