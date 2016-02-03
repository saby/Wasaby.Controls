(function() {
   'use strict';

   var global = (function () {
      return this || (0, eval)('this');
   }()),
   define = global.define || (global.requirejs && global.requirejs.define);

   define('help', [
      'js!SBIS3.Engine.HintManager',
      'js!SBIS3.Engine.FloatAreaHintManagerPlugin',
      'js!SBIS3.Engine.WindowHintManagerPlugin'
   ], function(
      hintManager
   ) {
      return {
         load: function(name, require, onLoad, config) {
            require(['json!' + name], function (json) {
               name = 'js!' + name.replace(/(\/resources\/help)$/, ''); // необходимо чтобы совпадало с именем контрола
               $ws.helpers.forEach(json, function(element) {
                  element.controlName = name;
                  hintManager.addHint(element);
               });
               onLoad(name);
            });
         }
      };
   });
}());