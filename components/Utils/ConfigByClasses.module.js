define('js!SBIS3.CONTROLS.Utils.ConfigByClasses', [], function () {
   'use strict';
   return function(opts, params, classes) {
      var
         elem;
      function hasClass(fullClass, classes) {
         if (typeof fullClass === 'string') {
            var index = fullClass.split(' ')
               .filter(function (el) {
                  return el !== ''
               })
               .indexOf(classes);
            return !!~index;
         } else {
            return undefined;
         }
      }
      for (var i = 0; i < params.length; i++) {
         elem = params[i];
         if (!opts[elem.optionName]) {
            if (hasClass(classes, elem.class)) {
               opts[elem.optionName] = elem.value;
            } else {
               opts[elem.optionName] = elem.defaultValue;
            }
         }
      }
   };
});