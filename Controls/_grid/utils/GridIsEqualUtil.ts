// todo: removed by task https://online.sbis.ru/opendoc.html?guid=728d200e-ff93-4701-832c-93aad5600ced
function isEqualWithSkip(obj1, obj2, skipFields) {
   if ((!obj1 && obj2) || (obj1 && !obj2)) {
      return false;
   }
   if (!obj1 && !obj2) {
      return true;
   }
   if (obj1.length !== obj2.length) {
      return false;
   }
   for (var i = 0; i < obj1.length; i++) {
      for (var j in obj1[i]) {
         if (!skipFields[j] && obj1[i].hasOwnProperty(j)) {
            if (!obj2[i].hasOwnProperty(j) || obj1[i][j] !== obj2[i][j]) {
               return false;
            }
         }
      }
   }
   return true;
}
export {
   isEqualWithSkip
};
