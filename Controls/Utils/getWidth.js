define('Controls/Utils/getWidth', [
   'css!Controls/Utils/getWidth'
], function() {
   'use strict';

   return {
      /* eslint-disable */
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

         // clientWidth width returns integer, but real width is fractional
         width = measurer.getBoundingClientRect().width;

         //Откладываем удаление элемента, чтобы не пересчитвывать лишний раз DOM и быстрее отобразить страницу
         setTimeout(function() {
            document.body.removeChild(measurer);
         });
         return width;
      }
      /* eslint-enable */
   };
});
