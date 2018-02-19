define('Controls/InfoBoxOpener/resources/magicPixel', [],
   function () {
      return function(className, hashMap){
         var obj = {};

         var div = document.createElement('div');
         div.setAttribute('class', className);
         div.setAttribute('style', 'position: absolute; top: -1000px; left: -1000px;');
         document.body.appendChild(div);

         var computedStyles = getComputedStyle(div);
         for(key in hashMap){
            obj[key] = parseInt(computedStyles[hashMap[key]]);
         }

         div.remove();
         return obj;
      }
   }
);