define('Components/Validators/IsRequiredDef', ['Core/Deferred'], function(Deferred) {
   'use strict';

   return function(args) {
      var str = args.text;
      var def = new Deferred();
      if (typeof str !== 'string') {
         def.callback('IsRequiredDef: ' + str + ' не является строкой');
      } else if (!str.trim().length) {
         def.callback('IsRequiredDef: пустая строка');
      } else {
         def.callback(true);
      }
      return def;
   };
});