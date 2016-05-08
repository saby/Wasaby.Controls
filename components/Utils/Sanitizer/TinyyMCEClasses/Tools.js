define( 'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Tools', [
   'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Arr'
], function( Arr) {
   var whiteSpaceRegExp = /^\s*|\s*$/g;
   function trim(str) {
      return (str === null || str === undefined) ? '' : ("" + str).replace(whiteSpaceRegExp, '');
   }
   function is(obj, type) {
      if (!type) {
         return obj !== undefined;
      }
      if (type == 'array' && Arr.isArray(obj)) {
         return true;
      }
      return typeof obj == type;
   }
   function makeMap(items, delim, map) {
      var i;
      items = items || [];
      delim = delim || ',';
      if (typeof items == "string") {
         items = items.split(delim);
      }
      map = map || {};
      i = items.length;
      while (i--) {
         map[items[i]] = {};
      }
      return map;
   }
   function extend(obj, ext) {
      var i, l, name, args = arguments, value;
      for (i = 1, l = args.length; i < l; i++) {
         ext = args[i];
         for (name in ext) {
            if (ext.hasOwnProperty(name)) {
               value = ext[name];

               if (value !== undefined) {
                  obj[name] = value;
               }
            }
         }
      }
      return obj;
   }
   function explode(s, d) {
      if (!s || is(s, 'array')) {
         return s;
      }
      return Arr.map(s.split(d || ','), trim);
   }
   return {
      trim: trim,
      isArray: Arr.isArray,
      is: is,
      makeMap: makeMap,
      each: Arr.each,
      map: Arr.map,
      inArray: Arr.indexOf,
      extend: extend,
      explode: explode
   };
});