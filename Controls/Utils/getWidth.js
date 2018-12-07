define('Controls/Utils/getWidth', [
   'css!theme?Controls/Utils/getWidth'
], function() {
   'use strict';

   return {
      getWidth: function(element) {
         var
            measurer = document.createElement('div'),
            width;
         measurer.classList.add('controls-WidthUtils__measurer');

         if (typeof element === 'string') {
            measurer.innerHTML = element;
         } else {
            measurer.appendChild(element);
         }
         document.body.appendChild(measurer);
         width = measurer.clientWidth;
         document.body.removeChild(measurer);
         return width;
      }
   };
});
