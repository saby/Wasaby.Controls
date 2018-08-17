define('Controls/Utils/hasHorizontalScroll', [
   'Core/detection'
], function(detection) {

   'use strict';

   return function hasHorizontalScroll(target) {
      var
         targetStyles = getComputedStyle(target),
         result = target.clientWidth !== target.scrollWidth;

      /*
          Если на элементе висит text-align: right, то хром очень странно округляет scrollWidth. Например при реальной
          ширине в 277.859 он может округлить scrollWidth до 279. При этом для clientWidth он округляет по какому-то другому
          алгоритму, и в итоге возникает ситуация, когда текст влезает, но clientWidth и scrollWidth сильно отличаются.
          Если вешать direction: rtl, то текст всё также остаётся справа, но scrollWidth почти совпадает с реальной шириной
          (погрешность в пределах 1). Поэтому считаем эту погрешность и если она больше 1, то скролл есть, если меньше - то нет.
          */
      if (targetStyles.textAlign === 'right' && detection.chrome) {
         target.style.direction = 'rtl';
         target.style.textAlign = 'left';
         result = Math.abs(parseFloat(targetStyles.width) - target.scrollWidth) >= 1;
         target.style.direction = '';
         target.style.textAlign = '';
      }

      return result;
   };
});
