define('Controls/Popup/Opener/InfoBox/resources/themeConstantsGetter', [],
   function () {
      return function(className, hashMap){

         //Для тестов
         if(typeof window === 'undefined') {
            return {};
         }

         var obj = {};

         var div = document.createElement('div');
         div.setAttribute('class', className);
         div.setAttribute('style', 'position: absolute; top: -1000px; left: -1000px;');
         document.body.appendChild(div);

         var computedStyles = getComputedStyle(div);
         for(var key in hashMap){
            obj[key] = parseInt(computedStyles[hashMap[key]]);
         }

         //Почему не просто div.remove() ? IE 11 Support
         div.parentNode.removeChild(div);
         return obj;
      }
   }
);