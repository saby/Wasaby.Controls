define('js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Arr', [], function() {
   var isArray = Array.isArray || function(obj) {
         return Object.prototype.toString.call(obj) === "[object Array]";
      };
   function each(o, cb, s) {
      var n, l;
      if (!o) {
         return 0;
      }
      s = s || o;
      if (o.length !== undefined) {
         for (n = 0, l = o.length; n < l; n++) {
            if (cb.call(s, o[n], n, o) === false) {
               return 0;
            }
         }
      } else {
         for (n in o) {
            if (o.hasOwnProperty(n)) {
               if (cb.call(s, o[n], n, o) === false) {
                  return 0;
               }
            }
         }
      }
      return 1;
   }
   function map(array, callback) {
      var out = [];
      each(array, function(item, index) {
         out.push(callback(item, index, array));
      });
      return out;
   }
   function indexOf(a, v) {
      var i, l;
      if (a) {
         for (i = 0, l = a.length; i < l; i++) {
            if (a[i] === v) {
               return i;
            }
         }
      }
      return -1;
   }
   return {
      isArray: isArray,
      each: each,
      map: map,
      indexOf: indexOf
   };
});